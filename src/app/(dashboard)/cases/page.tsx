import React from "react";
import CaseListClient from "@/components/case/CaseListClient";
import { fetchApplications } from "@/lib/api/applications";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export default async function Page({
 searchParams,
}: {
 searchParams: Record<string, string | string[] | undefined>;
}) {
 const params = await searchParams;
 // @ts-expect-error rija
 const session = await getServerSession(authOptions)
 // @ts-expect-error rija
 const accessToken = session?.accessToken;

 const pick = (k: string) => {
  const v = params[k];
  return Array.isArray(v) ? v[0] : v;
 };

 const q = pick("q") ?? "";
 const stage = pick("stage") ?? "";
 const ob = pick("ob") ?? "newest";
 const page = Number(pick("page") ?? "1") || 1;
 const size = Number(pick("size") ?? "50") || 50;

 const result = await fetchApplications(
  {
   q,
   stages: stage ? [stage] : undefined,
   ob,
   page,
   size,
  },
  { cache: "no-store", token: accessToken }
 );

 const rows = result.ok ? result.rows : [];
 const pagination = result.ok
  ? result.pagination
  : {
   current_page: page,
   total_pages: 1,
   total_records: 0,
   page_size: size,
  };


 return (
  <CaseListClient
   rows={rows}
   pagination={pagination}
   currentFilters={{
    q,
    stage,
    ob,
    page,
    size
   }}
  />
 );
}
