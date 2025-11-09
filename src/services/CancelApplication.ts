import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import { PayloadCancelApplicationRequest } from "@/types/api/cancel-application.type";

export interface PropsCancelApplication {
 accessToken: string;
 caseId: string;
 body: PayloadCancelApplicationRequest
}

const CancelApplication = async <TResponse = "unknown">({ accessToken, caseId, body }: PropsCancelApplication) => {
 const res = await fetcher<TResponse>(`${BASE_API_URL}/${caseId}/cancel`, {
  method: "POST",
  token: accessToken,
  body: body
 });

 if (!res.ok) {
  throw new Error(res.error || `HTTP ${res.status}`);
 }

 return res;
};

export default CancelApplication;  