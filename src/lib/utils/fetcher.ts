// lib/fetcher.ts
export interface FetcherOptions {
 method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
 headers?: Record<string, string | number | boolean>;
 body?: unknown; // no any
 token?: string;
 cache?: RequestCache;
 retries?: number;
 retryDelay?: number;
 signal?: AbortSignal;
}

export interface FetcherResult<T> {
 ok: boolean;
 status: number;
 data?: T;
 error?: string;
 raw?: unknown;
}

function wait(ms: number) {
 return new Promise((res) => setTimeout(res, ms));
}

export async function fetcher<T>(url: string, opts: FetcherOptions = {}): Promise<FetcherResult<T>> {
 const {
  method = "GET",
  headers = {},
  body,
  token,
  cache = "no-store",
  retries = 0,
  retryDelay = 300,
  signal,
 } = opts;

 const h: Record<string, string> = {
  "Content-Type": "application/json",
  ...Object.fromEntries(Object.entries(headers).map(([k, v]) => [k, String(v)])),
 };

 const resolvedToken = token ?? process.env.API_TOKEN ?? "";
 if (resolvedToken) {
  h.Authorization = resolvedToken.startsWith("Bearer ")
   ? resolvedToken
   : `Bearer ${resolvedToken}`;
 }

 let bodyToSend: BodyInit | undefined;
 if (body !== undefined && body !== null) {
  if (typeof body === "string" || body instanceof Uint8Array || body instanceof ArrayBuffer) {
   bodyToSend = body as BodyInit;
  } else {
   bodyToSend = JSON.stringify(body);
  }
 }

 let attempt = 0;

 while (true) {
  try {
   const res = await fetch(url, { method, headers: h, body: bodyToSend, cache, signal });

   let parsed: unknown;
   try {
    parsed = await res.json();
   } catch {
    parsed = await res.text().catch(() => null);
   }

   if (res.ok) {
    return { ok: true, status: res.status, data: parsed as T, raw: parsed };
   } else {
    const errMsg =
     (parsed as Record<string, string>)?.message ??
     (parsed as Record<string, string>)?.error ??
     `HTTP ${res.status} ${res.statusText}`;
    return { ok: false, status: res.status, error: errMsg, raw: parsed };
   }
  } catch (err) {
   if ((err as Error)?.name === "AbortError") {
    return { ok: false, status: 0, error: "Request aborted" };
   }

   attempt += 1;
   if (attempt > retries) {
    return { ok: false, status: 0, error: (err as Error)?.message ?? "Network error" };
   }

   await wait(retryDelay * Math.pow(2, attempt - 1));
  }
 }
}
