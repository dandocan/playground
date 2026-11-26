"use client";

import { useState } from "react";
import { AuthMessage } from "@/components/auth/auth-card";
import { GithubIcon, GoogleIcon } from "@/components/auth/social-icons";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const providers = [
  { id: "google", label: "Continue with Google", Icon: GoogleIcon },
  { id: "github", label: "Continue with GitHub", Icon: GithubIcon },
] as const;

export function SocialButtons({ callbackURL = "/account" }: { callbackURL?: string }) {
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signIn(provider: (typeof providers)[number]["id"]) {
    setPending(provider);
    setError(null);
    const { error } = await authClient.signIn.social({ provider, callbackURL });
    // On success the browser is already navigating to the provider.
    if (error) {
      setPending(null);
      setError(error.message ?? "Could not start sign-in.");
    }
  }

  return (
    <div className="grid gap-2">
      {error && <AuthMessage variant="destructive">{error}</AuthMessage>}
      {providers.map(({ id, label, Icon }) => (
        <Button
          key={id}
          type="button"
          variant="outline"
          disabled={pending !== null}
          onClick={() => signIn(id)}
        >
          <Icon data-icon="inline-start" />
          {label}
        </Button>
      ))}
    </div>
  );
}
