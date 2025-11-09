import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import { PropPutSignedUrlRequest, PutSignedUrlResponse } from "@/types/api/put-signed-url.type";

const PutSignedTranscriptionUrl = async <TResponse = PutSignedUrlResponse>({
 accessToken,
 caseId,
 body,
}: PropPutSignedUrlRequest) => {
 const res = await fetcher<TResponse>(
  `${BASE_API_URL}/${caseId}/transcription/put-signed-url`,
  {
   method: "POST",
   token: accessToken,
   body,
  }
 );

 if (!res.ok) {
  throw new Error(res.error || `HTTP ${res.status}`);
 }

 return res;
};

export default PutSignedTranscriptionUrl;
export type { PutSignedTranscriptionUrl as PutSignedUrlTranscriptionService };
