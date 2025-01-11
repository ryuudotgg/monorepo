import type { CreateEmailResponse } from "resend";

import type { users } from "@ryuu/db/schema";

import { resend } from "..";
import { env } from "../../env";
import { SignIn } from "./template";

interface Props {
  user: typeof users.$inferSelect;
  token: string;
  city?: string;
  country?: string;
  ip?: string;
}

async function sendSignIn({
  user,
  token,
  city,
  country,
  ip,
}: Props): Promise<CreateEmailResponse> {
  return resend.emails.send({
    from: env.RESEND_FROM,
    to: user.email,
    subject: "Sign in to Ryuu",
    react: (
      <SignIn user={user} token={token} city={city} country={country} ip={ip} />
    ),
  });
}

export { sendSignIn, SignIn };
