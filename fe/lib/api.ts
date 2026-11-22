export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

export type MeResponse = {
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  tenant_id: string;
  tenant_name: string;
  product_url: string | null;
  onboarded: boolean;
};

async function apiFetch<T>(
  path: string,
  opts: { method?: string; token?: string; body?: unknown } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  if (opts.token) headers.Authorization = `Bearer ${opts.token}`;
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";

  const res = await fetch(`${API_BASE}${path}`, {
    method: opts.method ?? "GET",
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text || `API ${res.status}`;
    try {
      const json = JSON.parse(text) as { detail?: string };
      if (json.detail) message = json.detail;
    } catch {
      /* plain text */
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export function fetchMe(token: string) {
  return apiFetch<MeResponse>("/api/me", { token });
}

export function bootstrapWorkspace(
  token: string,
  body: { workspace_name?: string; product_url?: string }
) {
  return apiFetch<MeResponse>("/api/me/bootstrap", {
    method: "POST",
    token,
    body,
  });
}

export function markOnboarded(token: string) {
  return apiFetch<MeResponse>("/api/me/onboarded", { method: "POST", token });
}
