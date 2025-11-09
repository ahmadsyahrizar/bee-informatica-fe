import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import type {
 PostCreditScoreRequest
} from "@/types/api/upsert-cred-score.type";

type PropsPostCreditScore = {
 accessToken: string;
 caseId: string | number;
 body: PostCreditScoreRequest;
};

const PostCreditScore = async <TResponse = unknown>({
 accessToken,
 caseId,
 body,
}: PropsPostCreditScore) => {
 const res = await fetcher<TResponse>(
  `${BASE_API_URL}/${caseId}/credit-score`,
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

export default PostCreditScore;
