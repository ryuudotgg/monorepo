import type { BetterAuthOptions } from "better-auth";
import { geolocation, ipAddress } from "@vercel/functions";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins/magic-link";
import { passkey } from "better-auth/plugins/passkey";
import { z } from "zod";

import { eq } from "@ryuu/db";
import { db } from "@ryuu/db/client";
import { usernameZod } from "@ryuu/db/helpers";
import {
  accounts,
  passkeys,
  sessions,
  users,
  verifications,
} from "@ryuu/db/schema";
import { sendSignIn, sendSignUp } from "@ryuu/emails";
import { nanoid } from "@ryuu/shared/helpers";

import type { Session } from ".";
import { env } from "../env";

export const isSecureContext = env.NODE_ENV !== "development";

const SESSION_EXPIRES_IN = 60 * 60 * 24 * 7; // 7 days
const SESSION_UPDATE_AGE = 60 * 60 * 24; // 1 day (every 1 day the session expiration is updated)
const SESSION_MAX_AGE = 60 * 15; // 15 minutes

export const authConfig = {
  database: drizzleAdapter(db, {
    provider: "mysql",
    schema: {
      user: users,
      account: accounts,
      session: sessions,
      passkey: passkeys,
      verification: verifications,
    },
  }),

  secret: env.AUTH_SECRET,
  baseURL: env.AUTH_BASE_URL,

  plugins: [
    passkey({
      rpID: "ryuu",
      rpName: "Ryuu's Monorepo",
      origin: env.AUTH_BASE_URL,
    }),

    magicLink({
      sendMagicLink: async ({ email, token }, request) => {
        const { city, country } = request ? geolocation(request) : {};
        const ip = request ? ipAddress(request) : undefined;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email));

        if (user) await sendSignIn({ user, token, city, country, ip });
        else await sendSignUp({ email, token, city, country, ip });
      },
    }),

    // This must remain the last item of the array.
    nextCookies(),
  ],

  session: {
    expiresIn: SESSION_EXPIRES_IN,
    updateAge: SESSION_UPDATE_AGE,

    cookieCache: {
      enabled: true,
      maxAge: SESSION_MAX_AGE,
    },

    storeSessionInDatabase: true,
  },

  socialProviders: {
    discord: {
      clientId: env.AUTH_DISCORD_ID,
      clientSecret: env.AUTH_DISCORD_SECRET,
    },

    google: {
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },

    apple: {
      clientId: env.AUTH_APPLE_ID,
      clientSecret: env.AUTH_APPLE_SECRET,
    },
  },

  user: {
    additionalFields: {
      username: {
        type: "string",
        unique: true,
        required: true,
        defaultValue: users.username.defaultFn as () => string,
        validator: {
          input: usernameZod,
          output: usernameZod,
        },
      },

      role: {
        type: "string",
        required: true,
        defaultValue: users.role.default as string,
        input: false,
        validator: {
          input: z.enum(users.role.enumValues),
          output: z.enum(users.role.enumValues),
        },
      },

      public: {
        type: "boolean",
        required: true,
        defaultValue: users.public.default as boolean,
      },
    },
  },

  account: { accountLinking: { enabled: true } },
  advanced: { useSecureCookies: isSecureContext, generateId: () => nanoid() },
} satisfies BetterAuthOptions;

export const validateToken = async (token: string): Promise<Session | null> => {
  const sessionToken = token.slice("Bearer ".length);
  const [result] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.token, sessionToken))
    .innerJoin(users, eq(users.id, sessions.userId))
    .limit(1);

  return result
    ? {
        session: result.sessions,
        user: { ...result.users, name: result.users.username },
      }
    : null;
};
