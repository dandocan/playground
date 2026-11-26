"use client";

import { createContext, useContext, type ReactNode } from "react";

// Only fields that are safe to expose to the browser. Never put the session token here.
export type SessionUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified: boolean;
};

type SessionContextValue = { user: SessionUser };

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({
  user,
  children,
}: {
  user: SessionUser;
  children: ReactNode;
}) {
  return <SessionContext value={{ user }}>{children}</SessionContext>;
}

// Reads the session that ProtectedPage resolved on the server. For actions
// (sign out, updates) use authClient, then router.refresh() to re-read it.
export function useSession(): SessionContextValue {
  const session = useContext(SessionContext);
  if (!session) {
    throw new Error("useSession must be used inside <ProtectedPage>.");
  }
  return session;
}
