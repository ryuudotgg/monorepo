import type { Geo } from "@vercel/functions";
import { captureException } from "@sentry/nextjs";

import type { Session } from "@ryuu/auth";

import { log } from "./log";

export function processError(
  error: unknown,
  session?: { user?: Session["user"]; ip?: string; geo?: Geo },
  extra?: Record<string, unknown>,
): string {
  let message = "An error occurred";

  if (error instanceof Error) message = error.message;
  else if (error && typeof error === "object" && "message" in error)
    message = error.message as string;
  else message = String(error);

  try {
    captureException(error, {
      user: session && {
        id: session.user?.id,
        email: session.user?.email,
        username: session.user?.username,
        ip_address: session.ip,
        geo: session.geo && {
          city: session.geo.city,
          region: session.geo.countryRegion,
          country_code: session.geo.country,
        },
      },
      extra,
    });

    log.error(message, { error });
  } catch (newError) {
    log.error("Process Error Failed", {
      newError,

      originalError: error,
      originalMessage: message,
    });
  }

  return message;
}
