"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import CaseDetail from "@/services/ApplicationDetail";
import type { CaseDetailRequest } from "@/types/api/case-detail.type";

type Params = Omit<CaseDetailRequest, "accessToken">;

export default function useCaseDetail<TData = unknown>(
 param: Params,
 opts?: {
  enabled?: boolean;
  staleTime?: number;
 }
) {
 const { data: session, status } = useSession();
 // @ts-expect-error rija
 const accessToken = session?.accessToken;
 const enabled = Boolean(accessToken) && status === "authenticated" && (opts?.enabled ?? true);

 return useQuery({
  queryKey: ["caseDetail", param, accessToken],
  queryFn: async () => {
   if (!accessToken) {
    throw new Error("No access token available");
   }
   return await CaseDetail<TData>({ ...param, accessToken });
  },
  enabled,
  staleTime: opts?.staleTime ?? 1000 * 60 * 5,
 });
}  
