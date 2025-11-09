"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import CaseDetail from "@/services/ApplicationDetail";
import type { CaseDetailRequest } from "@/types/api/case-detail.type";

type Params = Omit<CaseDetailRequest, "accessToken">;

function unwrapNestedData<T>(payload: unknown): T | undefined {
 let current: unknown = payload;
 if (current === null || current === undefined) return undefined;

 while (
  current &&
  typeof current === "object" &&
  !Array.isArray(current) &&
  "data" in (current as Record<string, unknown>)
 ) {
  current = (current as Record<string, unknown>).data;
 }

 return current as T | undefined;
}

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

 return useQuery<
  unknown,
  Error,
  TData | undefined
 >({
  queryKey: ["caseDetail", param.type, param.caseId],
  queryFn: async () => {
   if (!accessToken) throw new Error("No access token available");
   return await CaseDetail<TData>({ ...param, accessToken });
  },
  enabled,
  staleTime: opts?.staleTime ?? 1000 * 60 * 5,
  select: (rawRes: Record<string, unknown> | unknown) => {
   const candidate =
    rawRes && typeof rawRes === "object" && "data" in rawRes
     ? (rawRes as Record<string, unknown>).data
     : rawRes;
   return unwrapNestedData<TData>(candidate);
  },
 });
}
