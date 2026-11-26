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

export function ResetPasswordForm({ token }: { token?: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;
    const form = new FormData(event.currentTarget);
    const newPassword = String(form.get("password"));
    if (newPassword !== String(form.get("confirm"))) {
      setError("The passwords don't match.");
      return;
    }
    setPending(true);
    setError(null);
    const { error } = await authClient.resetPassword({ newPassword, token });
    setPending(false);
    if (error) {
      setError(error.message ?? "Could not reset the password.");
      return;
    }
    setDone(true);
  }

  if (!token) {
    return (
      <AuthCard
        title="Reset link invalid"
        footer={<Link href="/forgot-password">Request a new link</Link>}
      >
        <AuthMessage variant="destructive">
          This password reset link is invalid or has expired.
        </AuthMessage>
      </AuthCard>
    );
  }

  if (done) {
    return (
      <AuthCard
        title="Password updated"
        footer={<Link href="/sign-in">Sign in</Link>}
      >
        <AuthMessage>Your password has been reset. You can sign in now.</AuthMessage>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Choose a new password"
      description="Use at least 8 characters."
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        {error && <AuthMessage variant="destructive">{error}</AuthMessage>}
        <AuthField
          id="password"
          label="New password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={128}
          required
        />
        <AuthField
          id="confirm"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={128}
          required
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Reset password"}
        </Button>
      </form>
    </AuthCard>
  );
}
