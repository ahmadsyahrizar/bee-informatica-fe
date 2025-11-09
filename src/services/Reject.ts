import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import { PayloadRejectRequest } from "@/types/api/reject.type";
const API_UPDATE_EMAIL_AND_PHONE = `${BASE_API_URL}`;

interface PropReject {
 accessToken: string;
 caseId: string;
 body: PayloadRejectRequest
}

const Reject = async <TResponse = "unknown">({ accessToken, caseId, body }: PropReject) => {
 const res = await fetcher<TResponse>(`${API_UPDATE_EMAIL_AND_PHONE}/${caseId}/reject`, {
  method: "POST",
  token: accessToken,
  body: body
 });

 if (!res.ok) {
  throw new Error(res.error || `HTTP ${res.status}`);
 }

 return res
};

export default Reject  