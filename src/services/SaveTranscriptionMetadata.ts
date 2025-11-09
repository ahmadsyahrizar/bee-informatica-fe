// transcription 

import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import { PropsSaveTranscriptionMetadata } from "@/types/api/save-transcription-meta-data.type";

const SaveTranscriptionMetaData = async <TResponse = "unknown">({
 accessToken,
 caseId,
 body,
}: PropsSaveTranscriptionMetadata) => {
 const res = await fetcher<TResponse>(
  `${BASE_API_URL}/${caseId}/transcription`,
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

export default SaveTranscriptionMetaData;  