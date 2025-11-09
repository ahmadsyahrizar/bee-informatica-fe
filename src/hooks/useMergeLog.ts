"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import GetLogTemplate from "@/services/GetLogTemplate";
import GetAppLog from "@/services/GetAppLog";
import type {
 LogTemplateResponse,
 ChecklistItem as ApiChecklistItem,
 StructuredNote as ApiStructuredNote,
} from "@/types/api/log.type";
import type { PropsGetAppLog } from "@/types/api/get-app-log.type";
import { BASE_API_URL } from "@/constants";

/** UI types */
export type ChecklistItem = { id: number | string; questionId?: string; text: string; done?: boolean };
export type KeyValueField = { key: string; label: string; value: string };
export type VideoCallLogData = {
 checklist: ChecklistItem[];
 structured: KeyValueField[];
 operatorNotes?: string;
 videoUrl?: string;
 transcript?: { role: "Staff" | "Client"; time?: string; text: string }[];
 screenshots?: { url: string; caption?: string }[];
};

const empty: VideoCallLogData = {
 checklist: [],
 structured: [],
 operatorNotes: "",
 videoUrl: undefined,
 transcript: [],
 screenshots: [],
};

/** Safe helpers */
function safeString(v?: string | null) {
 if (!v || v === "") return "-";
 return String(v);
}

/** ----- Local types for app (returned by GetAppLog) ----- */
/** If your PropsGetAppLog already defines these shapes, you can remove these and reference PropsGetAppLog directly. */
type AppChecklistItem = {
 // expected fields from the app log checklist items
 question_id?: string | number | null;
 // keep other potential fields permissive
 [k: string]: unknown;
};

type AppStructuredNoteArrayItem = {
 key?: string | number | null;
 value?: string | null;
 answer?: string | null;
 // other possible fields
 [k: string]: unknown;
};

type AppRecording = {
 key?: string | null;
 [k: string]: unknown;
};

type AppScreenshot = {
 key?: string | null;
 url?: string | null;
 caption?: string | null;
 [k: string]: unknown;
};

type AppTranscriptItem = {
 role?: "Staff" | "Client" | string;
 time?: string;
 text?: string;
 [k: string]: unknown;
};

type AppLogShape = {
 checklist?: AppChecklistItem[]; // sometimes array
 structured_notes?: AppStructuredNoteArrayItem[] | Record<string, AppStructuredNoteArrayItem> | null;
 operator_notes?: string | null;
 recording?: AppRecording | null;
 transcript?: AppTranscriptItem[] | null;
 screenshots?: AppScreenshot[] | null;
 // allow other props without failing types
 [k: string]: unknown;
};

/** Query return typing */
type QueryPayload = {
 tplRes?: LogTemplateResponse | null;
 logRes?: PropsGetAppLog | null;
};

export default function useMergedLog({
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
 data: VideoCallLogData;
 isLoading: boolean;
 isError: boolean;
 error: unknown;
 refetch: () => Promise<unknown>;
} {
 const queryKey = ["mergedLog", caseId, type];

 const { data, isLoading, isError, error, refetch } = useQuery<QueryPayload, unknown>({
  queryKey,
  queryFn: async (): Promise<QueryPayload> => {
   const [tplRes, logRes] = await Promise.all([
    GetLogTemplate<{ data: LogTemplateResponse }>({ accessToken, caseId, type }),
    GetAppLog<{ data: PropsGetAppLog }>({ accessToken, caseId, type }),
   ]);
   // normalize to just the inner data objects (or null)
   return { tplRes: tplRes?.data?.data ?? null, logRes: logRes?.data?.data ?? null };
  },
  enabled: Boolean(open && accessToken && caseId),
  staleTime: 1000 * 60 * 2,
 });

 const mapped = useMemo(() => {
  if (!data) return empty;

  // template (from API) — use imported LogTemplateResponse type
  const tpl: LogTemplateResponse | null = data.tplRes ?? null;
  // app log — typed as PropsGetAppLog if available, but we use a local AppLogShape for runtime-safe reads
  const appLog: AppLogShape | null = (data.logRes as unknown as AppLogShape) ?? null;

  // gather checklist ids from app log
  const appChecklistIds = new Set<string>();
  if (Array.isArray(appLog?.checklist)) {
   for (const it of appLog.checklist as AppChecklistItem[]) {
    const qid = it?.question_id;
    if (qid !== undefined && qid !== null) appChecklistIds.add(String(qid));
   }
  }

  // template checklist -> ApiChecklistItem from imported types
  const templateChecklist = (tpl?.checklist ?? []).map((c: ApiChecklistItem, idx: number) => {
   const qid =
    c.question_id ?? (typeof c.order === "number" ? String(c.order) : String(idx));
   return {
    id: qid,
    questionId: qid,
    text: safeString(c.question),
    done: appChecklistIds.has(String(qid)),
   } as ChecklistItem;
  });

  if (Array.isArray(appLog?.checklist)) {
   for (const it of appLog.checklist as AppChecklistItem[]) {
    const qid = String(it.question_id ?? "");
    if (!templateChecklist.some((t) => String(t.questionId) === qid)) {
     templateChecklist.push({
      id: qid,
      questionId: qid,
      text: qid,
      done: true,
     });
    }
   }
  }

  // structured notes: prefer template order, but override values from app log
  const structuredMap = new Map<string, KeyValueField>();
  const tplStructured: ApiStructuredNote[] = tpl?.structured_notes ?? [];

  for (const s of tplStructured) {
   const key = String(s.key ?? s.value ?? "");
   structuredMap.set(key, {
    key,
    label: safeString(s.value ?? s.key),
    value: safeString(s.answer ?? "-"),
   });
  }

  const appStructured = appLog?.structured_notes;
  if (Array.isArray(appStructured)) {
   for (const s of appStructured as AppStructuredNoteArrayItem[]) {
    const key = String(s.key ?? "");
    if (!key) continue;
    structuredMap.set(key, {
     key,
     label: structuredMap.get(key)?.label ?? safeString(String(s.value ?? s.key)),
     value: safeString((s.answer as string) ?? (s.value as string) ?? "-"),
    });
   }
  } else if (appStructured && typeof appStructured === "object") {
   for (const [key, value] of Object.entries(appStructured as Record<string, AppStructuredNoteArrayItem>)) {
    structuredMap.set(key, {
     key,
     label: structuredMap.get(key)?.label ?? key,
     value: safeString(
      typeof value === "object" && value !== null
       ? value.answer ?? "-"
       : typeof value === "string"
        ? value
        : "-"
     ),
    });
   }
  }

  const structured: KeyValueField[] = [];
  // keep template order first
  for (const s of tplStructured) {
   const key = String(s.key ?? s.value ?? "");
   const kv = structuredMap.get(key);
   if (kv) structured.push(kv);
   structuredMap.delete(key);
  }
  // append remaining keys from app
  for (const kv of structuredMap.values()) structured.push(kv);

  // recording -> video url
  let videoUrl: string | undefined = undefined;
  if (appLog?.recording && (appLog.recording as AppRecording).key) {
   videoUrl = `${BASE_API_URL}/files/${String((appLog.recording as AppRecording).key)}`;
  }

  const transcript: AppTranscriptItem[] =
   Array.isArray(appLog?.transcript) ? (appLog!.transcript as AppTranscriptItem[]) : [];

  const screenshots =
   Array.isArray(appLog?.screenshots)
    ? (appLog!.screenshots as AppScreenshot[]).map((s) => ({
     url: s.key ? `${BASE_API_URL}/files/${String(s.key)}` : String(s.url ?? ""),
     caption: s.caption ?? undefined,
    }))
    : [];

  return {
   checklist: templateChecklist,
   structured,
   operatorNotes: safeString(appLog?.operator_notes ?? ""),
   videoUrl,
   transcript: transcript.map((t) => ({
    role: (t.role === "Staff" || t.role === "Client") ? (t.role as "Staff" | "Client") : "Staff",
    time: t.time,
    text: String(t.text ?? ""),
   })),
   screenshots,
  } as VideoCallLogData;
 }, [data]);

 return {
  data: mapped,
  isLoading,
  isError,
  error,
  refetch: async () => {
   // keep the same signature as before
   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
   // @ts-ignore - react-query returns a complex result; we expose a simple Promise
   return refetch();
  },
 };
}
