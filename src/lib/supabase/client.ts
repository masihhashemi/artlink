import { createBrowserClient } from "@supabase/ssr";

/** Browser Supabase client — used when NEXT_PUBLIC_DEMO_MODE is false. */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Supabase env vars are missing. Use demo mode or set them in .env.local.");
  }
  return createBrowserClient(url, key);
}
