export const runtime = "nodejs";

export async function GET(req: Request) {
 const targetUrl = new URL(req.url).searchParams.get("url");
 if (!targetUrl) {
  return new Response("Missing url", { status: 400 });
 }

 try {
  const response = await fetch(targetUrl);
  if (!response.ok) {
   return new Response("Failed to fetch target file", { status: 500 });
  }

  const contentType = response.headers.get("content-type") || "application/pdf";
  const arrayBuffer = await response.arrayBuffer();

  return new Response(arrayBuffer, {
   headers: {
    "Content-Type": contentType,
    "Content-Disposition": "inline",
   },
  });
 } catch (err) {
  console.error("Proxy error:", err);
  return new Response("Error fetching target file", { status: 500 });
 }
}
