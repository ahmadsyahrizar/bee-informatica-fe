// transcription

import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import { PropsDeleteTranscriptionMetadata } from "@/types/api/save-transcription-meta-data.type";

const DeleteTranscriptionMetaData = async <TResponse = "unknown">({
 accessToken,
 caseId,
 body,
}: PropsDeleteTranscriptionMetadata) => {
 const res = await fetcher<TResponse>(
  `${BASE_API_URL}/${caseId}/transcription`,
  {
   method: "DELETE",
   token: accessToken,
   body,
  }
 );

 if (!res.ok) {
  throw new Error(res.error || `HTTP ${res.status}`);
 }

 return res;
};

export default DeleteTranscriptionMetaData;  