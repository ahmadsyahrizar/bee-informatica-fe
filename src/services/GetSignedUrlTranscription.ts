// get-signed-url

import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import { PropsGetSignedTranscriptionUrl } from "@/types/api/get-signed-url.type";

const GetSignedTranscriptionUrl = async <TResponse = "unknown">({
 accessToken,
 caseId,
 body,
}: PropsGetSignedTranscriptionUrl) => {
 const res = await fetcher<TResponse>(
  `${BASE_API_URL}/${caseId}/transcription/get-signed-url`,
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

export default GetSignedTranscriptionUrl;  