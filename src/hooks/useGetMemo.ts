import { useQuery, useQueryClient } from "@tanstack/react-query";
import GetMemo from "@/services/GetMemo";
import { GetMemoResponse } from "@/types/api/memo.type";
import { useMemo } from "react";
import { useSession } from "next-auth/react";

export function useGetMemo(caseId?: string | number) {
 console.log({ caseId })
 // @ts-expect-error rija
 const accessToken = useSession().data?.accessToken ?? "";
 const queryClient = useQueryClient();

 const query = useQuery({
  queryKey: ["getMemo", caseId],
  queryFn: async () => {
   return await GetMemo<GetMemoResponse[]>({
    accessToken,
    caseId: String(caseId ?? ""),
    // stage: stage as PayloadMemoRequest["stage"],
   });
  },
  enabled: !!caseId && !!accessToken,
  staleTime: 1000 * 60 * 2,
  retry: 2
 });

 const entries = useMemo(() => {
  // @ts-expect-error rija
  const d = query.data?.data;
  if (!d) return undefined;
  if (Array.isArray(d)) return d as GetMemoResponse[];
  if (d && typeof d === "object" && "data" in d) return d as GetMemoResponse[];
  return undefined;
 }, [query.data]);

 return {
  ...query,
  entries,
  invalidate: () => queryClient.invalidateQueries({ queryKey: ["getMemo", caseId] }),
 };
}
