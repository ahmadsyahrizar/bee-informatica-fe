import { API_DOMAIN } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import { CaseDetailRequest } from "@/types/api/case-detail.type"

const CASE_DETAIL_API = `${API_DOMAIN}/api/applications`;

const CaseDetail = async <TResponse = "unknown">({ accessToken, caseId, type }: CaseDetailRequest) => {
 return await fetcher<TResponse>(`${CASE_DETAIL_API}/${caseId}?type=${type}`, {
  token: accessToken
 });
};

export default CaseDetail