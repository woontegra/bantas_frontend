import { fetchWithTimeout } from "./fetchWithTimeout";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const TOKEN_KEY = "bantas_admin_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function adminFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = getToken();
  const res = await fetchWithTimeout(`${API_URL}${path}`, {
    timeoutMs: 15000,
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });
  if (res.status === 401) {
    removeToken();
    window.location.href = "/admin/login";
    throw new Error("Oturum süresi doldu");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Hata: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/** FormData POST/PUT (for file uploads — no Content-Type header, browser sets boundary) */
export async function adminUpload<T>(
  path: string,
  formData: FormData,
  method: "POST" | "PUT" = "POST",
): Promise<T> {
  const token = getToken();
  const res = await fetchWithTimeout(`${API_URL}${path}`, {
    method,
    timeoutMs: 120000,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (res.status === 401) {
    removeToken();
    window.location.href = "/admin/login";
    throw new Error("Oturum süresi doldu");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Hata: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/** Login — returns token or throws */
export async function adminLogin(email: string, password: string) {
  const res = await fetchWithTimeout(`${API_URL}/api/auth/login`, {
    method: "POST",
    timeoutMs: 20000,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Giriş başarısız");
  setToken(data.token as string);
  return data as { token: string; user: { id: string; email: string; name: string; role: string } };
}

/** Verify current token — returns user or throws */
export async function verifyToken() {
  const token = getToken();
  if (!token) throw new Error("Token yok");
  const res = await fetchWithTimeout(`${API_URL}/api/auth/verify`, {
    method: "POST",
    timeoutMs: 15000,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) {
    removeToken();
    throw new Error("Geçersiz token");
  }
  return (await res.json()) as { user: { id: string; email: string; name: string; role: string } };
}

export const API = API_URL;
