"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { returnValidationErrors } from "next-safe-action";

import { auth } from "@ryuu/auth";
import { eq } from "@ryuu/db";
import { db } from "@ryuu/db/client";
import { users } from "@ryuu/db/schema";
import { processError } from "@ryuu/observability/error";
import arcjet, { detectBot, request, slidingWindow } from "@ryuu/security";
import { emailSchema } from "@ryuu/validators";

import { env } from "~/env";
import { actionClient } from "~/lib/safe-action";

const aj = arcjet
  .withRule(detectBot({ mode: "LIVE", allow: [] }))
  .withRule(slidingWindow({ mode: "LIVE", interval: "10m", max: 5 }));

export const signInWithEmailAction = actionClient
  .schema(emailSchema)
  .action(async ({ parsedInput }) => {
    const { email } = parsedInput;

    if (env.NODE_ENV === "production") {
      const req = await request();
      const decision = await aj.protect(req);

      if (decision.isDenied())
        if (decision.reason.isRateLimit())
          return returnValidationErrors(emailSchema, {
            _errors: ["Too many requests. Please try again later."],
          });
        else
          return returnValidationErrors(emailSchema, {
            _errors: ["You've been blocked. Please try again later."],
          });
    }

    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user)
      return returnValidationErrors(emailSchema, {
        _errors: [
          "There is no Ryuu account associated with this email address.",
        ],
      });

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

    redirect("/sign-in/success");
  });
