"use client";

import Link from "next/link";
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

export function SignUpForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    setPending(true);
    setError(null);
    const { error } = await authClient.signUp.email({
      name: String(form.get("name")),
      email,
      password: String(form.get("password")),
      callbackURL: "/account",
    });
    setPending(false);
    if (error) {
      setError(error.message ?? "Could not create the account.");
      return;
    }
    setSentTo(email);
  }

  if (sentTo) {
    return (
      <AuthCard
        title="Check your email"
        footer={<Link href="/sign-in">Back to sign in</Link>}
      >
        <AuthMessage>
          We sent a verification link to {sentTo}. Open it to finish creating
          your account.
        </AuthMessage>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Create an account"
      description="Sign up with your email or a social account."
      footer={
        <>
          Already have an account? <Link href="/sign-in">Sign in</Link>
        </>
      }
    >
      <SocialButtons />
      <Separator />
      <form onSubmit={onSubmit} className="grid gap-4">
        {error && <AuthMessage variant="destructive">{error}</AuthMessage>}
        <AuthField id="name" label="Name" autoComplete="name" required />
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
          autoComplete="new-password"
          minLength={8}
          maxLength={128}
          required
        />
        <Button type="submit" disabled={pending}>
          {pending ? "Creating account…" : "Sign up"}
        </Button>
      </form>
    </AuthCard>
  );
}
