import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import type { GetRevertHistoryResponse } from "@/types/api/get-revert-history.type";

type PropsGetRevertHistory = {
 accessToken: string;
 caseId: string | number;
};

const GetRevertHistory = async ({
 accessToken,
 caseId,
}: PropsGetRevertHistory) => {
 const res = await fetcher<GetRevertHistoryResponse>(
  `${BASE_API_URL}/${caseId}/revert-history`,
  {
   method: "GET",
   token: accessToken,
  }
 );

 if (!res.ok) {
  throw new Error(res.error || `HTTP ${res.status}`);
 }

 return res;
};

export default GetRevertHistory;
