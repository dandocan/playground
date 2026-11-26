import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = { title: "Reset password" };

async function ResetPasswordContent({
  searchParams,
}: Pick<PageProps<"/reset-password">, "searchParams">) {
  const { token, error } = await searchParams;
  // Better Auth redirects here with ?token=… for a valid link, or ?error=INVALID_TOKEN.
  return (
    <ResetPasswordForm
      token={!error && typeof token === "string" ? token : undefined}
    />
  );
}

export default function ResetPasswordPage({
  searchParams,
}: PageProps<"/reset-password">) {
  return (
    <Suspense>
      <ResetPasswordContent searchParams={searchParams} />
    </Suspense>
  );
}
