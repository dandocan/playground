"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  AuthCard,
  AuthField,
  AuthMessage,
} from "@/components/auth/auth-card";
import { SocialButtons } from "@/components/auth/social-buttons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

export function SignInForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    const { error } = await authClient.signIn.email({
      email: String(form.get("email")),
      password: String(form.get("password")),
      callbackURL: "/account",
    });
    setPending(false);
    if (error) {
      setError(
        error.status === 403
          ? "Your email isn't verified yet. We've sent you a new verification link."
          : (error.message ?? "Could not sign in."),
      );
      return;
    }
    router.push("/account");
    router.refresh();
  }

  return (
    <AuthCard
      title="Sign in"
      description="Welcome back. Sign in to your account."
      footer={
        <>
          No account? <Link href="/sign-up">Sign up</Link>
        </>
      }
    >
      <SocialButtons />
      <Separator />
      <form onSubmit={onSubmit} className="grid gap-4">
        {error && <AuthMessage variant="destructive">{error}</AuthMessage>}
        <AuthField
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
        />
        <AuthField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
        <Link
          href="/forgot-password"
          className="text-center text-sm text-muted-foreground underline underline-offset-4"
        >
          Forgot your password?
        </Link>
      </form>
    </AuthCard>
  );
}
