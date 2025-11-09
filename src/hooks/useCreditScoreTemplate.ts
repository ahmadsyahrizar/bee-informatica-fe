import { useQuery } from "@tanstack/react-query";
import GetCreditScoreTemplate from "@/services/GetCreditScoreTemplate";

/**
 * returns the API response object from GET /credit-score-template
 */
export function useCreditScoreTemplate(accessToken: string | undefined) {
 return useQuery({
  queryKey: ["credit-score-template"],
  queryFn: async () => {
   if (!accessToken) throw new Error("No access token");
   const res = await GetCreditScoreTemplate({ accessToken, caseId: "" });
   return res.data;
  },
  enabled: !!accessToken,
  staleTime: 1000 * 60 * 5,
 });
} 
