

import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import { PropsGetSignedUrl } from "@/types/api/get-signed-url.type";
import { PutSignedUrlResponse } from "@/types/api/put-signed-url.type";

const GetSignedUrl = async <TResponse = PutSignedUrlResponse>({
 accessToken,
 caseId,
 body,
}: PropsGetSignedUrl) => {
 const res = await fetcher<TResponse>(
  `${BASE_API_URL}/${caseId}/photo/get-signed-url`,
  {
   method: "POST",
   token: accessToken,
   body,
  }
 );

 if (!res.ok) {
  throw new Error(res.error || `HTTP ${res.status}`);
 }

 return res;
};

export default GetSignedUrl;
