import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseAnonKey, getSupabaseUrl, supabaseAuthCookieOptions } from "@/lib/supabase/public-env";

export async function updateSession(request: NextRequest) {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookieOptions: supabaseAuthCookieOptions(),
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, responseHeaders) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
        if (responseHeaders && typeof responseHeaders === "object") {
          for (const [key, value] of Object.entries(responseHeaders)) {
            if (typeof value === "string") {
              supabaseResponse.headers.set(key, value);
            }
          }
        }
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isProtected = path.startsWith("/espace-client") || path.startsWith("/espace-admin");

  if (isProtected && !user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", path);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && (path.startsWith("/espace-client") || path.startsWith("/espace-admin"))) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const isAdmin = profile?.role === "admin";

    if (path.startsWith("/espace-admin") && !isAdmin) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/espace-client";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }

    if (path.startsWith("/espace-client") && isAdmin) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/espace-admin";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }
  }

  return supabaseResponse;
}
