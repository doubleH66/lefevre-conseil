import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sanitizeInternalPath } from "@/lib/sanitize-internal-path";
import { requireSupabasePublicEnv, supabaseAuthCookieOptions } from "@/lib/supabase/public-env";

export async function GET(request: Request) {
  let url: string;
  let anonKey: string;
  try {
    ({ url, anonKey } = requireSupabasePublicEnv());
  } catch {
    return NextResponse.redirect(new URL("/login?error=config", request.url));
  }

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeInternalPath(searchParams.get("next"), "/espace-client");

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=auth", origin));
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(url, anonKey, {
    cookieOptions: supabaseAuthCookieOptions(),
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          /* ignore */
        }
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/login?error=auth", origin));
  }

  return NextResponse.redirect(`${origin}${next}`);
}
