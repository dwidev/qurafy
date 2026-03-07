import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { sendPasswordResetEmail } from "@/lib/mailer";

const authUrl = process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
const authSecret = process.env.BETTER_AUTH_SECRET;

if (!authUrl) {
  throw new Error("Missing BETTER_AUTH_URL or NEXT_PUBLIC_BETTER_AUTH_URL environment variable");
}

if (!authSecret) {
  throw new Error("Missing BETTER_AUTH_SECRET environment variable");
}

export const auth = betterAuth({
  baseURL: authUrl,
  secret: authSecret,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({
        to: user.email,
        resetUrl: url,
        name: user.name,
      });
    },
  },
  socialProviders: {
    google:
      process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }
        : undefined,
  },
});
