import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import { PayloadUpdateSocialMedia } from "@/types/api/social-media.type";


export interface PropUpdateSocialMediaRequest {
 accessToken: string;
 caseId: string;
 body: PayloadUpdateSocialMedia
}

const UpdateSocialMedia = async <TResponse = "unknown">({ accessToken, caseId, body }: PropUpdateSocialMediaRequest) => {
 const res = await fetcher<TResponse>(`${BASE_API_URL}/${caseId}/social-media`, {
  method: "PATCH",
  token: accessToken,
  body: body
 });

 if (!res.ok) {
  throw new Error(res.error || `HTTP ${res.status}`);
 }

 return res
};

export default UpdateSocialMedia  