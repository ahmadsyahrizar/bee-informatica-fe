import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import type { PropsGetAppLog } from "@/types/api/get-app-log.type";

const GetAppLog = async <TResponse = unknown>({ accessToken, caseId, type }: PropsGetAppLog) => {
 const res = await fetcher<TResponse>(`${BASE_API_URL}/${caseId}/log?type=${type}`, {
  method: "GET",
  token: accessToken,
 });

 if (!res.ok) {
  throw new Error(res.error || `HTTP ${res.status}`);
 }

 return res;
};

export default GetAppLog;
