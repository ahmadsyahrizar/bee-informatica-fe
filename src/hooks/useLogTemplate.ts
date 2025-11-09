"use client";

import { useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import GetLogTemplate from "@/services//GetLogTemplate";
import type {
 LogTemplateResponse,
 ChecklistItem as ApiChecklistItem,
 StructuredNote as ApiStructuredNote,
} from "@/types/api/log.type";

export type ChecklistItem = { id: number | string; text: string; done?: boolean };
export type KeyValueField = { label: string; value: string };

function mapApiToVideoCallData(template: LogTemplateResponse | null) {
 if (!template) return { checklist: [] as ChecklistItem[], structured: [] as KeyValueField[] };

 const checklist: ChecklistItem[] = (template.checklist || []).map((c: ApiChecklistItem, idx) => {
  const id = typeof c.order === "number" ? c.order : c.question_id ?? idx;
  return { id, text: c.question, done: false };
 });

 const structured: KeyValueField[] = (template.structured_notes || []).map((s: ApiStructuredNote) => ({
  label: s.value ?? s.key ?? s.key,
  value: s.answer && s.answer !== "" ? s.answer : "-",
 }));

 return { checklist, structured };
}

export default function useLogTemplate({
 accessToken,
 caseId,
 type = "video",
 open = false,
}: {
 accessToken: string;
 caseId: string;
 type?: "video" | "phone";
 open?: boolean;
}): {
 data: { checklist: ChecklistItem[]; structured: KeyValueField[] } | null;
 isLoading: boolean;
 isError: boolean;
 error: unknown;
 refetch: () => Promise<unknown>;
} {
 // const qc = useQueryClient();
 const queryKey = ["logTemplate", caseId];
 const { data, isPending, isError, error, refetch } = useQuery(
  {

   queryKey,
   queryFn: () => GetLogTemplate<LogTemplateResponse>({
    accessToken,
    caseId,
    type,
   }),
   enabled: Boolean(open && accessToken && caseId)
  }
 );

 console.log("useLogTemplate debug:", { open, accessTokenPresent: Boolean(accessToken), caseId, isLoading: isPending, data: data });

 const mapped = useMemo(() => {
  if (!data) return null;
  return mapApiToVideoCallData(data);
 }, [data]);

 return {
  data: mapped,
  isLoading: isPending,
  isError: isError,
  error: error,
  refetch: refetch,
 };
}
