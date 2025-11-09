import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";

export interface PropsGetCreditScoreTemplate {
 accessToken: string;
 caseId: string;
}

const GetCreditScoreTemplate = async <TResponse = "unknown">({ accessToken }: PropsGetCreditScoreTemplate) => {
 const res = await fetcher<TResponse>(`${BASE_API_URL}/credit-score-template`, {
  method: "GET",
  token: accessToken,
 });

 if (!res.ok) {
  throw new Error(res.error || `HTTP ${res.status}`);
 }

 return res;
};

export default GetCreditScoreTemplate;  