import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import { OverviewPayloadRequest } from "@/types/api/overview.type";
const API_UPDATE_EMAIL_AND_PHONE = `${BASE_API_URL}`;

interface PropUpdateEmailAndPhoneRequest {
 accessToken: string;
 caseId: string;
 body: OverviewPayloadRequest
}


const UpdateEmailAndPhone = async <TResponse = "unknown">({ accessToken, caseId, body }: PropUpdateEmailAndPhoneRequest) => {
 const res = await fetcher<TResponse>(`${API_UPDATE_EMAIL_AND_PHONE}/${caseId}/overview`, {
  method: "PATCH",
  token: accessToken,
  body: body
 });

 if (!res.ok) {
  throw new Error(res.error || `HTTP ${res.status}`);
 }

 return res
};

export default UpdateEmailAndPhone  