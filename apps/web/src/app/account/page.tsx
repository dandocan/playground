import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";

export const metadata: Metadata = { title: "Account" };

// The proxy only checks that a session cookie exists; this validates it.
async function AccountDetails() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  return (
    <>
      <CardHeader>
        <CardTitle>{session.user.name}</CardTitle>
        <CardDescription>{session.user.email}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        You&apos;re signed in.
      </CardContent>
      <CardFooter>
        <SignOutButton />
      </CardFooter>
    </>
  );
}

export default function AccountPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <Suspense
          fallback={
            <CardHeader>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
          }
        >
          <AccountDetails />
        </Suspense>
      </Card>
    </main>
  );
}
