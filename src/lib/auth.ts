import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import bcrypt from "bcryptjs";

import { Role as RoleEnum } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

function getAuthSecret() {
  const fromEnv = process.env.BETTER_AUTH_SECRET;
  if (fromEnv) return fromEnv;
  if (process.env.NODE_ENV === "production") {
    throw new Error("BETTER_AUTH_SECRET est requis en production.");
  }
  return "dev-only-better-auth-secret-change-me-32chars";
}

const secret = getAuthSecret();

const baseURL =
  process.env.BETTER_AUTH_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

const extraTrusted =
  process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",").map((s) => s.trim()).filter(Boolean) ??
  [];

export const auth = betterAuth({
  secret,
  baseURL,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  trustedOrigins: Array.from(new Set([baseURL, ...extraTrusted])),
  plugins: [nextCookies()],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        input: false,
        defaultValue: RoleEnum.VICTIM,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    password: {
      hash: (password) => bcrypt.hash(password, 12),
      verify: ({ hash, password }) => bcrypt.compare(password, hash),
    },
    sendResetPassword: async ({ user, url }) => {
      // MVP: pas d’email transactionnel - journaliser le lien (à remplacer par SMTP/Resend).
      // eslint-disable-next-line no-console
      console.info("[Cobra Kill] Lien de réinitialisation:", { email: user.email, url });
    },
  },
});
