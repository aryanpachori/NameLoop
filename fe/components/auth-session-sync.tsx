"use client";

import { useEffect, useRef } from "react";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import { loadMe, syncWorkspaceFromUrl } from "@/lib/auth-session";
import { useWorkspace } from "@/lib/store";

/** Pull tenant from NameLoop API into local workspace after Supabase session exists. */
export function AuthSessionSync() {
  const { hydrateFromApi } = useWorkspace();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current || !supabaseConfigured()) return;
    ran.current = true;

    let cancelled = false;

    (async () => {
      try {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token || cancelled) return;

        const productUrl =
          typeof window !== "undefined"
            ? new URLSearchParams(window.location.search).get("url")
            : null;

        const me = productUrl
          ? await syncWorkspaceFromUrl(session.access_token, productUrl)
          : await loadMe(session.access_token);

        if (cancelled) return;
        hydrateFromApi({
          tenantName: me.tenant_name,
          productUrl: me.product_url ?? productUrl,
          onboarded: me.onboarded,
        });
      } catch {
        /* API cold start / unauthenticated — mock workspace still works */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hydrateFromApi]);

  return null;
}
