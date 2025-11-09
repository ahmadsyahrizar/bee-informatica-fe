import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import type {
 PutAddressVerificationDocsRequest,
} from "@/types/api/put-address-verification-docs.type";

type PropsPutAddressVerificationDocs = {
 accessToken: string;
 caseId: string | number;
 body: PutAddressVerificationDocsRequest;
};

const PutAddressVerificationDocs = async <TResponse = unknown>({
 accessToken,
 caseId,
 body,
}: PropsPutAddressVerificationDocs) => {
 const res = await fetcher<TResponse>(
  `${BASE_API_URL}/${caseId}/address-verification-docs`,
  {
   method: "PUT",
   token: accessToken,
   body,
  }
 );

 if (!res.ok) {
  throw new Error(res.error || `HTTP ${res.status}`);
 }

 return res;
};

export default PutAddressVerificationDocs;
