import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { after } from "next/server";
import { Pool } from "pg";
import { sendEmail } from "./email";

// The pooled DATABASE_URL is for runtime queries; migrations use DATABASE_URL_UNPOOLED.
const globalForPool = globalThis as unknown as { authPool?: Pool };
const pool =
  globalForPool.authPool ??
  new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
globalForPool.authPool = pool;

const vercelOrigins = [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]
  .filter((host): host is string => Boolean(host))
  .map((host) => `https://${host}`);

const baseURL =
  process.env.BETTER_AUTH_URL ?? vercelOrigins[0] ?? "http://localhost:3000";

function socialProvider(clientId?: string, clientSecret?: string) {
  return clientId && clientSecret ? { clientId, clientSecret } : undefined;
}

const google = socialProvider(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);
const github = socialProvider(
  process.env.GITHUB_CLIENT_ID,
  process.env.GITHUB_CLIENT_SECRET,
);

export const auth = betterAuth({
  baseURL,
  trustedOrigins: vercelOrigins,
  database: pool,
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Hi ${user.name},\n\nUse this link to reset your password:\n${url}\n\nIf you didn't ask for this, you can ignore this email.`,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Hi ${user.name},\n\nConfirm your email address with this link:\n${url}\n\nIf you didn't create an account, you can ignore this email.`,
      });
    },
  },
  socialProviders: {
    ...(google && { google }),
    ...(github && { github }),
  },
  rateLimit: { storage: "database" },
  advanced: {
    // Vercel replaces any client-supplied value for this header.
    ipAddress: { ipAddressHeaders: ["x-vercel-forwarded-for"] },
    // Let serverless functions finish sending emails after the response.
    backgroundTasks: { handler: (promise) => after(promise) },
  },
  // Must stay last.
  plugins: [nextCookies()],
});
