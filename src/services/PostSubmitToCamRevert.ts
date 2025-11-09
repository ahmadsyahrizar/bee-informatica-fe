import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import type {
 PostSubmitToCamRevertRequest,
} from "@/types/api/post-submit-to-cam-revert.type";

type PropsPostSubmitToCamRevert = {
 accessToken: string;
 caseId: string | number;
 body: PostSubmitToCamRevertRequest;
};

const PostSubmitToCamRevert = async <TResponse = unknown>({
 accessToken,
 caseId,
 body,
}: PropsPostSubmitToCamRevert) => {
 const res = await fetcher<TResponse>(
  `${BASE_API_URL}/${caseId}/submit-to-cam-revert`,
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

export default PostSubmitToCamRevert;
