import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

// BE 는 server.servlet.context-path = /api 로 떠있다. 모든 endpoint 가 /api 하위에 있다.
export const API_BASE = `${API_URL}/api`;

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init?.headers ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...init,
    headers,
  });
}

export async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await apiFetch(path, init);
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `API error: ${res.status}`);
  }
  return res.json() as Promise<T>;
}
