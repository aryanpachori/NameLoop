import { API_BASE, bootstrapWorkspace, fetchMe, type MeResponse } from "@/lib/api";

/** Resolve post-auth destination from BE onboarded flag. */
export function resolveAuthDestination(
  me: MeResponse,
  requestedNext: string
): string {
  const path = requestedNext.startsWith("/") ? requestedNext : `/${requestedNext}`;
  const [pathname, search = ""] = path.split("?");
  const q = search ? `?${search}` : "";

  if (me.onboarded) {
    if (pathname === "/onboarding" || pathname.startsWith("/onboarding/")) {
      return `/app${q}`;
    }
    return path;
  }

  if (pathname === "/app" || pathname.startsWith("/app/")) {
    return `/onboarding${q}`;
  }
  return path.startsWith("/onboarding") ? path : `/onboarding${q}`;
}

export async function loadMe(token: string): Promise<MeResponse> {
  return fetchMe(token);
}

export async function syncWorkspaceFromUrl(
  token: string,
  productUrl: string | null | undefined
): Promise<MeResponse> {
  if (!productUrl?.trim()) return fetchMe(token);
  return bootstrapWorkspace(token, { product_url: productUrl.trim() });
}

export { API_BASE };
