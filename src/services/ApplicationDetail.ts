import { BASE_API_URL } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import { CaseDetailRequest } from "@/types/api/case-detail.type"

const CaseDetail = async <TResponse = "unknown">({ accessToken, caseId, type }: CaseDetailRequest) => {
 return await fetcher<TResponse>(`${BASE_API_URL}/${caseId}?type=${type}`, {
  token: accessToken
 });
};

export default CaseDetail