import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";

export interface PropsGetAppVerificationDoc {
 accessToken: string;
 caseId: string;
}

const GetAppVerificationDocs = async <TResponse = "unknown">({ accessToken, caseId }: PropsGetAppVerificationDoc) => {
 const res = await fetcher<TResponse>(`${BASE_API_URL}/${caseId}/address-verification-docs`, {
  method: "GET",
  token: accessToken,
 });

 if (!res.ok) {
  throw new Error(res.error || `HTTP ${res.status}`);
 }

 return res;
};

export default GetAppVerificationDocs;  