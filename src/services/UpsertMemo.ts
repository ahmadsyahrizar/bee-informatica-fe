// 151/memo

import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import { PayloadMemoRequest } from "@/types/api/memo.type";
const API_UPDATE_EMAIL_AND_PHONE = `${BASE_API_URL}`;

interface PropUpsertMemo {
 accessToken: string;
 caseId: string;
 body: PayloadMemoRequest
}

const UpsertMemo = async <TResponse = "unknown">({ accessToken, caseId, body }: PropUpsertMemo) => {
 const res = await fetcher<TResponse>(`${API_UPDATE_EMAIL_AND_PHONE}/${caseId}/memo`, {
  method: "POST",
  token: accessToken,
  body: body
 });

 if (!res.ok) {
  throw new Error(res.error || `HTTP ${res.status}`);
 }

 return res
};

export default UpsertMemo  