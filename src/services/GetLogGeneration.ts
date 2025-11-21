import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";

export type CreateLogGenerationBody = {
 type: string;
 key: string;
 additional?: {
  enable?: boolean;
  session_key?: string;
  [k: string]: unknown;
 };
};

const CreateLogGeneration = async <TResponse = unknown>({
 accessToken,
 caseId,
 body,
}: {
 accessToken: string;
 caseId: string;
 body: CreateLogGenerationBody;
}) => {
 const res = await fetcher<TResponse>(`${BASE_API_URL}/${caseId}/transcription/log-generation`, {
  method: "POST",
  token: accessToken,
  body,
 });

 if (!res.ok) {
  throw new Error(res.error ?? `HTTP ${res.status}`);
 }

 return res;
};

export default CreateLogGeneration;
