import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import type { PostRevertCamRequest } from "@/types/api/post-revert-cam.type";

type PropsPostRevertCam = {
 accessToken: string;
 caseId: string | number;
 body: PostRevertCamRequest;
};

const PostRevertCam = async <TResponse = unknown>({
 accessToken,
 caseId,
 body,
}: PropsPostRevertCam) => {
 const res = await fetcher<TResponse>(
  `${BASE_API_URL}/${caseId}/revert-cam`,
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

export default PostRevertCam;
