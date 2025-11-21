export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { promises as fs } from "fs";

const DEV_LOCAL_FALLBACK_PATH = "/mnt/data/72c886e6-36d9-4f5e-b492-4df383497457.png";

const ALLOWED_REMOTE_PREFIX = "https://";

function safeUrlCandidate(candidate: string | null | undefined) {
 if (!candidate) return null;
 const trimmed = String(candidate).trim();
 if (!trimmed) return null;
 return trimmed;
}

async function fetchTextRobust(url: string): Promise<{ ok: boolean; status: number; text: string | null; headers: Record<string, string> }> {
 try {
  // follow redirects
  const res = await fetch(url, { redirect: "follow" });
  const headers: Record<string, string> = {};
  res.headers.forEach((v, k) => (headers[k] = v));

  // try text()
  try {
   const t = await res.text();
   if (t && String(t).trim() !== "") {
    return { ok: res.ok, status: res.status, text: t, headers };
   }
  } catch (errText) {
   // continue to arrayBuffer fallback
   console.debug("resp.text() failed", errText);
  }

  // fallback: arrayBuffer + TextDecoder
  try {
   const buf = await res.arrayBuffer();
   if (buf && buf.byteLength > 0) {
    const dec = new TextDecoder("utf-8");
    const textFromBuffer = dec.decode(buf);
    if (textFromBuffer && String(textFromBuffer).trim() !== "") {
     return { ok: res.ok, status: res.status, text: textFromBuffer, headers };
    }
   }
  } catch (errBuf) {
   console.debug("resp.arrayBuffer() failed", errBuf);
  }

  // nothing useful
  return { ok: res.ok, status: res.status, text: null, headers };
 } catch (err) {
  console.debug("fetchRobust threw", err);
  return { ok: false, status: 0, text: null, headers: {} };
 }
}

export async function GET(req: NextRequest) {
 try {
  const urlParam = safeUrlCandidate(
   req.nextUrl.searchParams.get("url") ?? req.nextUrl.searchParams.get("file")
  );
  const target = urlParam ?? DEV_LOCAL_FALLBACK_PATH;

  // remote https URL -> proxy it server-side
  if (target.startsWith(ALLOWED_REMOTE_PREFIX)) {
   // Defensive: only allow https urls
   console.debug("Proxying remote subtitle URL", { target });
   const result = await fetchTextRobust(target);

   // If fetch yielded text, return it
   if (result.text !== null) {
    return new Response(result.text, {
     status: result.status || 200,
     headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      // helpful debug headers (optional)
      "X-Proxied-From": target,
      "X-Remote-Status": String(result.status),
      ...Object.fromEntries(Object.entries(result.headers).slice(0, 5)), // don't expose too many headers
     },
    });
   }

   // If remote fetch returned empty, fall back to local dev file
   console.debug("Remote fetch returned no text, falling back to local dev file");
   try {
    const buf = await fs.readFile(DEV_LOCAL_FALLBACK_PATH);
    const text = buf.toString("utf8");
    return new Response(text, {
     status: 200,
     headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "X-Proxied-From-Fallback": "local",
     },
    });
   } catch (errLocal) {
    console.debug("Local fallback read failed", errLocal);
    // Neither remote nor local works
    return new Response(`Failed to fetch subtitle (remote returned empty, local fallback failed): ${String(errLocal)}`, {
     status: 502,
     headers: { "Content-Type": "text/plain; charset=utf-8", "Access-Control-Allow-Origin": "*" },
    });
   }
  }

  // local /mnt/data path -> read file from disk (dev)
  if (target.startsWith("/mnt/data/")) {
   try {
    const buf = await fs.readFile(target);
    const text = buf.toString("utf8");
    return new Response(text, {
     status: 200,
     headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
     },
    });
   } catch (err: any) {
    return new Response(`Failed to read local file: ${String(err?.message ?? err)}`, {
     status: 500,
     headers: { "Content-Type": "text/plain; charset=utf-8", "Access-Control-Allow-Origin": "*" },
    });
   }
  }

  // Not allowed target
  return new Response("Invalid url parameter. Only https URLs and /mnt/data/* local paths are allowed.", {
   status: 400,
   headers: { "Content-Type": "text/plain; charset=utf-8", "Access-Control-Allow-Origin": "*" },
  });
 } catch (err: any) {
  return new Response(`Internal server error: ${String(err?.message ?? err)}`, {
   status: 500,
   headers: { "Content-Type": "text/plain; charset=utf-8", "Access-Control-Allow-Origin": "*" },
  });
 }
}
