import type { Metadata } from "next";
import { ProtectedPage } from "@/components/auth/protected-page";
import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AccountDetails } from "./account-details";

export const metadata: Metadata = { title: "Account" };

export default function AccountPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <ProtectedPage
          fallback={
            <CardHeader>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
          }
        >
          <AccountDetails />
        </ProtectedPage>
      </Card>
    </main>
  );
}
