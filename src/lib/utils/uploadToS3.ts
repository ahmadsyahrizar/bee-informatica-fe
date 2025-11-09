export async function uploadToS3(presignedUrl: string, file: File | Blob) {
 const res = await fetch(presignedUrl, {
  method: "PUT",
  body: file,
  headers: { "Content-Type": (file as File).type || "application/octet-stream" },
 });

 if (!res.ok) {
  const text = await res.text().catch(() => "");
  throw new Error(`S3 upload failed: ${res.status} ${res.statusText} ${text}`);
 }
 const etag = res.headers.get("ETag") ?? undefined;
 return { etag };
}

/** Upload with progress + cancel using XHR (works in browsers). */
export function uploadToS3WithProgress(
 presignedUrl: string,
 file: File | Blob,
 onProgress?: (pct: number) => void
) {
 const xhr = new XMLHttpRequest();

 const promise = new Promise<{ etag?: string }>((resolve, reject) => {
  xhr.upload.onprogress = (evt) => {
   if (!evt.lengthComputable) return;
   const pct = Math.max(0, Math.min(100, Math.round((evt.loaded / evt.total) * 100)));
   onProgress?.(pct);
  };

  xhr.onreadystatechange = () => {
   if (xhr.readyState !== 4) return;
   if (xhr.status >= 200 && xhr.status < 300) {
    // S3 may return ETag in headers (case-insensitive)
    const etag = xhr.getResponseHeader("ETag") ?? undefined;
    resolve({ etag });
   } else {
    reject(new Error(`S3 upload failed: ${xhr.status} ${xhr.statusText} ${xhr.responseText || ""}`));
   }
  };

  xhr.open("PUT", presignedUrl, true);
  xhr.setRequestHeader("Content-Type", (file as File).type || "application/octet-stream");
  xhr.send(file as Blob);
 });

 return { promise, abort: () => xhr.abort() };
}
