import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
const API_UPDATE_EMAIL_AND_PHONE = `${BASE_API_URL}`;
interface PropGetMemo {
 accessToken: string;
 caseId: string;
 // stage: PayloadMemoRequest['stage']
}

const GetMemo = async <TResponse = "unknown">({ accessToken, caseId }: PropGetMemo) => {
 // const res = await fetcher<TResponse>(`${API_UPDATE_EMAIL_AND_PHONE}/${caseId}/memo?stage=${stage}`, {
 const res = await fetcher<TResponse>(`${API_UPDATE_EMAIL_AND_PHONE}/${caseId}/memo`, {
  method: "GET",
  token: accessToken,
 });

 if (!res.ok) {
  throw new Error(res.error || `HTTP ${res.status}`);
 }

 return res?.data
};

export default GetMemo  