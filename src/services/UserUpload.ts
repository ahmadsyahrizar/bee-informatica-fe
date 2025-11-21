import { API_DOMAIN } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";

export interface SignedUrlResult {
 url: string;
 key: string;
}

export interface PropsGenerateSignedUrl {
 accessToken: string;
 filename: string;
 mime: string;
}

/**
 * Generate Signed URL
 */
export const generateSignedUrl = async <TResponse = unknown>({
 accessToken,
 filename,
 mime,
}: PropsGenerateSignedUrl) => {
 const res = await fetcher<TResponse>(`${API_DOMAIN}/auth/generate-upload-pic-signed-url`, {
  method: "POST",
  token: accessToken,
  body: { filename, mime },
 });

 if (!(res as any).ok) {
  throw new Error((res as any).error || `HTTP ${(res as any).status}`);
 }

 return res?.data;
};

/**
 * Upload to Signed URL — **IMPORTANT:** No token & no custom headers.
 */
export const uploadToSignedUrl = async (signedUrl: string, file: Blob) => {
 const res = await fetch(signedUrl, {
  method: "PUT",
  body: file,
 });

 if (!res.ok) {
  throw new Error(`Upload failed: HTTP ${res.status}`);
 }

 return res;
};

export default {
 generateSignedUrl,
 uploadToSignedUrl,
};
