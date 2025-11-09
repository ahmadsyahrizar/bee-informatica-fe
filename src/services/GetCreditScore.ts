import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import type {
 GetCreditScoreResponse,
} from "@/types/api/get-cred-score.type";

type PropsGetCreditScore = {
 accessToken: string;
 caseId: string | number;
};

const GetCreditScore = async ({
 accessToken,
 caseId,
}: PropsGetCreditScore) => {
 const res = await fetcher<GetCreditScoreResponse>(
  `${BASE_API_URL}/${caseId}/credit-score`,
  {
   method: "GET",
   token: accessToken,
  }
 );

 if (!res.ok) {
  throw new Error(res.error || `HTTP ${res.status}`);
 }

 return res;
};

export default GetCreditScore;
