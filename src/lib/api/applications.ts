import { API_DOMAIN } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import type { CaseRowType, CaseRowPagination } from "@/types/case";

export interface ApplicationsAPIResponse {
 data: {
  applications: CaseRowType[];
  pagination: CaseRowPagination;
 };
 message?: string;
}

export interface ApplicationsQueryParams {
 stages?: string[];
 q?: string;
 ob?: string;
 page?: number;
 size?: number;
 [key: string]: unknown;
}

export interface FetchApplicationsResult {
 ok: boolean;
 status: number;
 rows: CaseRowType[];
 pagination: CaseRowPagination;
 raw?: ApplicationsAPIResponse;
 error?: string;
}

export function buildApplicationsUrl(
 params: Record<string, unknown> = {},
 domain?: string
): string {
 const API_DOMAIN =
  domain
 const p = new URLSearchParams();

 if (params.stages && Array.isArray(params.stages)) {
  for (const s of params.stages) {
   if (s) p.append("stages", String(s));
  }
 }

 if (params.q) p.set("q", String(params.q));
 if (params.ob) p.set("ob", String(params.ob));
 if (params.page) p.set("page", String(params.page));
 if (params.size) p.set("size", String(params.size));

 for (const [k, v] of Object.entries(params)) {
  if (["stages", "q", "ob", "page", "size"].includes(k)) continue;
  if (v === undefined || v === null || v === "") continue;
  if (Array.isArray(v)) v.forEach((vv) => p.append(k, String(vv)));
  else p.set(k, String(v));
 }

 return `${API_DOMAIN}/api/applications?${p.toString()}`;
}

export async function fetchApplications(
 params: ApplicationsQueryParams = {},
 opts?: { token?: string; cache?: RequestCache; retries?: number }
): Promise<FetchApplicationsResult> {

 const queryParams: Record<string, unknown> = {
  q: params.q,
  ob: params.ob,
  page: params.page,
  size: params.size,
 };

 if (params.stages) queryParams.stages = params.stages;

 const url = buildApplicationsUrl(queryParams, API_DOMAIN);
 const result = await fetcher<ApplicationsAPIResponse>(url, {
  method: "GET",
  cache: opts?.cache ?? "no-store",
  token: opts?.token,
  retries: opts?.retries ?? 0,
 });

 const fallbackPagination: CaseRowPagination = {
  current_page: params.page ?? 1,
  total_pages: 1,
  total_records: 0,
  page_size: params.size ?? 10,
 };

 if (!result.ok || !result.data) {
  return {
   ok: false,
   status: result.status,
   rows: [],
   pagination: fallbackPagination,
   raw: result.data,
   error: result.error ?? "Unknown API error",
  };
 }

 const { applications, pagination } = result.data.data;
 return {
  ok: true,
  status: result.status,
  rows: applications,
  pagination: pagination ?? fallbackPagination,
  raw: result.data,
 };
}
