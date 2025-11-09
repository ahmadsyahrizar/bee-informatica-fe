
import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import type { PostDisburseLoanRequest } from "@/types/api/post-disburse.type";

type PropsPostDisburseLoan = {
 accessToken: string;
 caseId: string | number;
 body: PostDisburseLoanRequest;
};

const PostDisburseLoan = async <TResponse = unknown>({
 accessToken,
 caseId,
 body,
}: PropsPostDisburseLoan) => {
 const res = await fetcher<TResponse>(
  `${BASE_API_URL}/${caseId}/disburse-loan`,
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

export default PostDisburseLoan;
