"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  AuthCard,
  AuthField,
  AuthMessage,
} from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function ForgotPasswordForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    const { error } = await authClient.requestPasswordReset({
      email: String(form.get("email")),
      redirectTo: "/reset-password",
    });
    setPending(false);
    if (error) {
      setError(error.message ?? "Could not send the reset link.");
      return;
    }
    setSent(true);
  }

  return (
    <AuthCard
      title="Forgot your password?"
      description="Enter your email and we'll send you a reset link."
      footer={<Link href="/sign-in">Back to sign in</Link>}
    >
      {sent ? (
        <AuthMessage>
          If an account exists for that email, a reset link is on its way.
        </AuthMessage>
      ) : (
        <form onSubmit={onSubmit} className="grid gap-4">
          {error && <AuthMessage variant="destructive">{error}</AuthMessage>}
          <AuthField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            required
          />
          <Button type="submit" disabled={pending}>
            {pending ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
