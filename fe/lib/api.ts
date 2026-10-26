export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function apiUrl(path: string) {
  return `${API_URL}${path}`;
}

// Swap this module for live FastAPI calls once the backend is wired.
// The workspace currently reads and writes through `lib/store.tsx`.
