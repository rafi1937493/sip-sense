"use client";

import { NeonAuthUIProvider } from "@neondatabase/auth/react/ui";
import { authClient } from "@/lib/auth";
import "@neondatabase/auth/ui/css";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <NeonAuthUIProvider 
      authClient={authClient} 
      redirectTo="/"
      defaultTheme="light"
    >
      {children}
    </NeonAuthUIProvider>
  );
}
