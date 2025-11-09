// next-stage

import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";

export interface PropsNextStage {
 accessToken: string;
 caseId: string;
}

const NextPage = async <TResponse = "unknown">({ accessToken, caseId }: PropsNextStage) => {
 const res = await fetcher<TResponse>(`${BASE_API_URL}/${caseId}/next-stage`, {
  method: "POST",
  token: accessToken,
 });

 if (!res.ok) {
  throw new Error(res.error || `HTTP ${res.status}`);
 }

 return res;
};

export default NextPage;  