import { createAuthClient } from "@neondatabase/auth";
import { BetterAuthReactAdapter } from "@neondatabase/auth/react/adapters";

const authUrl = process.env.NEXT_PUBLIC_NEON_AUTH_URL;

if (!authUrl) {
  throw new Error("NEXT_PUBLIC_NEON_AUTH_URL environment variable is not set");
}

export const authClient = createAuthClient(authUrl, {
  adapter: BetterAuthReactAdapter(),
});
