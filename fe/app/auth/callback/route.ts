import { NextResponse } from "next/server";
import { API_BASE, type MeResponse } from "@/lib/api";
import { resolveAuthDestination } from "@/lib/auth-session";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/onboarding";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      let dest = next.startsWith("/") ? next : `/${next}`;
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.access_token) {
          const res = await fetch(`${API_BASE}/api/me`, {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${session.access_token}`,
            },
            cache: "no-store",
          });
          if (res.ok) {
            const me = (await res.json()) as MeResponse;
            dest = resolveAuthDestination(me, dest);
          }
        }
      } catch {
        /* cold start / network — keep requested next */
      }
      return NextResponse.redirect(`${origin}${dest}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
