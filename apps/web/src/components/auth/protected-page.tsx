import { Suspense, type ReactNode } from "react";
import { SessionProvider } from "@/components/auth/session-provider";
import { requireSession } from "@/lib/session";

async function ProtectedContent({ children }: { children: ReactNode }) {
  const { user } = await requireSession();
  return (
    <SessionProvider
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        emailVerified: user.emailVerified,
      }}
    >
      {children}
    </SessionProvider>
  );
}

// Validates the session on the server for this page (the proxy only checks that a cookie
// exists), redirects to /sign-in without one, and exposes the user to client components
// through useSession(). Server components can call getSession() from "@/lib/session".
export function ProtectedPage({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return (
    <Suspense fallback={fallback}>
      <ProtectedContent>{children}</ProtectedContent>
    </Suspense>
  );
}
