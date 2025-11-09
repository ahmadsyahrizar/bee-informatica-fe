import { useQuery } from "@tanstack/react-query";
import GetCreditScore from "@/services/GetCreditScore";

export function useCreditScore(accessToken: string | undefined, caseId: string | number | undefined) {
 return useQuery({
  queryKey: ["credit-score", caseId],
  queryFn: async () => {
   if (!accessToken || !caseId) throw new Error("Missing params");
   const res = await GetCreditScore({ accessToken, caseId });
   return res.data;
  },
  enabled: !!accessToken && !!caseId,
  staleTime: 1000 * 60 * 5,
 });
}  
