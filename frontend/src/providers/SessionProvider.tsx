"use client";
import { ReactNode } from "react";
import { SessionProvider as NextAuthSessionsProvider } from "next-auth/react";

export default function SessionProvider({ children }: { children: ReactNode }) {
  return <NextAuthSessionsProvider>{children}</NextAuthSessionsProvider>;
}
