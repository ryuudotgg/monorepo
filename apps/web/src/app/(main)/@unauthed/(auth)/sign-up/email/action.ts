"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { returnValidationErrors } from "next-safe-action";

import { auth } from "@ryuu/auth";
import { processError } from "@ryuu/observability/error";
import arcjet, {
  detectBot,
  request,
  slidingWindow,
  validateEmail,
} from "@ryuu/security";
import { emailSchema } from "@ryuu/validators";

import { env } from "~/env";
import { actionClient } from "~/lib/safe-action";

const aj = arcjet
  .withRule(detectBot({ mode: "LIVE", allow: [] }))
  .withRule(slidingWindow({ mode: "LIVE", interval: "10m", max: 5 }))
  .withRule(
    validateEmail({
      mode: "LIVE",
      block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
    }),
  );

export const signUpWithEmailAction = actionClient
  .schema(emailSchema)
  .action(async ({ parsedInput }) => {
    const { email } = parsedInput;

    if (env.NODE_ENV === "production") {
      const req = await request();
      const decision = await aj.protect(req, { email });

      if (decision.isDenied())
        if (decision.reason.isEmail())
          return returnValidationErrors(emailSchema, {
            email: { _errors: ["This email is not allowed."] },
          });
        else if (decision.reason.isRateLimit())
          return returnValidationErrors(emailSchema, {
            _errors: ["Too many requests. Please try again later."],
          });
        else
          return returnValidationErrors(emailSchema, {
            _errors: ["You've been blocked. Please try again later."],
          });
    }

    try {
      const result = await auth.signInMagicLink({
        body: { email },
        headers: await headers(),
      });

      if (!result.status) throw new Error("Failed to Send");
    } catch (error) {
      processError(error, undefined, { email });

      return returnValidationErrors(emailSchema, {
        _errors: ["Something went wrong. Please try again later."],
      });
    }

    redirect("/sign-up/success");
  });
