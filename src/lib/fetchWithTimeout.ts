export type FetchWithTimeoutInit = RequestInit & {
  timeoutMs?: number;
  /** Next.js Data Cache (Server Components) */
  next?: { revalidate?: number | false; tags?: string[] };
};

/**
 * Backend kapalı / ağ takılınca sayfa sonsuza kadar beklemesin.
 */
export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: FetchWithTimeoutInit = {},
): Promise<Response> {
  const { timeoutMs = 8000, ...rest } = init;
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(input, { ...rest, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}
