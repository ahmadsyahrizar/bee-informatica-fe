import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import type {
 PostLogChecklistRequest
} from "@/types/api/post-log-checklist.type";

type PropsPostLogChecklist = {
 accessToken: string;
 caseId: string | number;
 body: PostLogChecklistRequest;
};

/**
 * POST /{caseId}/log-checklist
 */
const PostLogChecklist = async <TResponse = unknown>({
 accessToken,
 caseId,
 body,
}: PropsPostLogChecklist) => {
 const res = await fetcher<TResponse>(
  `${BASE_API_URL}/${caseId}/log-checklist`,
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

export default PostLogChecklist;
