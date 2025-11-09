import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import { LogType } from "@/types/api/log.type";

export interface PropGetLogTemplate {
 accessToken: string;
 caseId: string;
 type: LogType
}

const GetLogTemplate = async <TResponse = "unknown">({ accessToken, type }: PropGetLogTemplate) => {
 const res = await fetcher<TResponse>(`${BASE_API_URL}/log-template?type=${type}`, {
  method: "GET",
  token: accessToken
 });

 console.log("[GetLogTemplate] fetcher returned", res);
 if (!res.ok) {
  throw new Error(res.error || `HTTP ${res.status}`);
 }



 return res
};

export default GetLogTemplate  