"use client";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { useSession } from "@/components/auth/session-provider";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AccountDetails() {
  const { user } = useSession();

  return (
    <>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        You're signed in.
      </CardContent>
      <CardFooter>
        <SignOutButton />
      </CardFooter>
    </>
  );
}
