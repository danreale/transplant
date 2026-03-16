import {
  createServerClient,
  parseCookieHeader,
  serializeCookieHeader,
} from "@supabase/ssr";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export function createClient(request: Request) {
  const headers = new Headers();

  if (!process.env.SUPABASE_URL) {
    throw new Error("SUPABASE_URL is not set in environment variables.");
  }

  if (!process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY) {
    throw new Error(
      "SUPABASE_PUBLISHABLE_DEFAULT_KEY is not set in environment variables."
    );
  }

  const supabase = createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get("Cookie") ?? "") as {
            name: string;
            value: string;
          }[];
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            headers.append(
              "Set-Cookie",
              serializeCookieHeader(name, value, options)
            )
          );
        },
      },
    }
  );

  return { supabase, headers };
}

export function getSupabaseAdmin() {
  if (!process.env.SUPABASE_URL) {
    throw new Error("SUPABASE_URL is not set in environment variables.");
  }

  if (!process.env.SUPABASE_SECRET_KEY) {
    throw new Error("SUPABASE_SECRET_KEY is not set in environment variables.");
  }
  const supabaseAdmin = createAdminClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
  );

  return supabaseAdmin;
}
