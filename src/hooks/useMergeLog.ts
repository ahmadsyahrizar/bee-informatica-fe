"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import GetLogTemplate from "@/services/GetLogTemplate";
import GetAppLog from "@/services/GetAppLog";
import GetSignedTranscriptionUrl from "@/services/GetSignedUrlTranscription";
import type {
  LogTemplateResponse,
  ChecklistItem as ApiChecklistItem,
  StructuredNote as ApiStructuredNote,
} from "@/types/api/log.type";
import type { PropsGetAppLog } from "@/types/api/get-app-log.type";
import { BASE_API_URL } from "@/constants";
import { AppChecklistItem, AppLogShape, AppRecording, AppScreenshot, AppStructuredNoteArrayItem, AppTranscriptItem, ChecklistItem, KeyValueField, QueryPayload, VideoCallLogData } from "@/types/app-log";

const empty: VideoCallLogData = {
  checklist: [],
  structured: [],
  operatorNotes: "",
  videoUrl: undefined,
  transcript: [],
  screenshots: [],
};

function safeString(v?: string | null) {
  if (v === undefined || v === null || v === "") return "-";
  return String(v);
}

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

      let signedUrl: string | null = null;

      try {
        const appLogShape = (logRes?.data?.data ?? null) as AppLogShape | null;
        const rec = appLogShape?.recording;
        const extractKey = (r?: AppRecording | null): string | null => {
          if (!r) return null;
          if (typeof (r as any).key === "string" && (r as any).key) return String((r as any).key);
          return null;
        };

        let candidateKey: string | null = null;
        if (Array.isArray(rec)) {
          for (const rr of rec as AppRecording[]) {
            const k = extractKey(rr);
            if (k) {
              candidateKey = k;
              break;
            }
          }
        } else {
          candidateKey = extractKey(rec as AppRecording | null);
        }

        if (candidateKey) {
          const body = {
            type,
            key: candidateKey,
          };

          try {
            const signedRes = await GetSignedTranscriptionUrl<{ data: { data?: { url?: string } } }>({
              accessToken,
              caseId,
              body,
            });

            signedUrl = (signedRes as any)?.data?.data ?? null;
          } catch (err) {
            signedUrl = null;
          }
        }
      } catch (err) {
      }

      return { tplRes: tplRes?.data?.data ?? null, logRes: logRes?.data?.data ?? null, signedUrl };
    },
    enabled: Boolean(open && accessToken && caseId),
    staleTime: 1000 * 60 * 2,
  });

  const mapped = useMemo(() => {
    if (!data) return empty;

    const tpl: LogTemplateResponse | null = data.tplRes ?? null;
    const appLog: AppLogShape | null = (data.logRes as unknown as AppLogShape) ?? null;

    const appChecklistIds = new Set<string>();
    if (Array.isArray(appLog?.checklist)) {
      for (const it of appLog.checklist as AppChecklistItem[]) {
        const qid = it?.question_id;
        if (qid !== undefined && qid !== null && String(qid).trim() !== "") {
          appChecklistIds.add(String(qid));
        }
      }
    }

    const templateChecklist = (tpl?.checklist ?? []).map((c: ApiChecklistItem, idx: number) => {
      const qid = c.question_id ?? (typeof c.order === "number" ? String(c.order) : String(idx));
      return {
        id: String(qid),
        questionId: String(qid),
        text: safeString(c.question),
        done: appChecklistIds.has(String(qid)),
      } as ChecklistItem;
    });

    if (Array.isArray(appLog?.checklist)) {
      for (const it of appLog.checklist as AppChecklistItem[]) {
        const qid = String(it.question_id ?? "");
        if (!templateChecklist.some((t) => String(t.questionId) === qid)) {
          templateChecklist.push({
            id: qid || `unknown-${Math.random().toString(36).slice(2, 8)}`,
            questionId: qid,
            text: qid || "-",
            done: true,
          });
        }
      }
    }

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
              ? (value.answer as string) ?? (value.value as string) ?? "-"
              : typeof value === "string"
                ? value
                : "-"
          ),
        });
      }
    }

    const structured: KeyValueField[] = [];
    for (const s of tplStructured) {
      const key = String(s.key ?? s.value ?? "");
      const kv = structuredMap.get(key);
      if (kv) structured.push(kv);
      structuredMap.delete(key);
    }
    for (const kv of structuredMap.values()) structured.push(kv);

    let videoUrl: string | undefined = undefined;
    const rec = appLog?.recording;
    if (rec) {
      if (data.signedUrl) {
        videoUrl = data.signedUrl;
      } else {
        if (Array.isArray(rec)) {
          const r = rec.find((x) => (x as AppRecording).key) as AppRecording | undefined;
          if (r?.key) videoUrl = `${BASE_API_URL}/files/${String(r.key)}`;
        } else {
          const r = rec as AppRecording;
          if (r.key) videoUrl = `${BASE_API_URL}/files/${String(r.key)}`;
        }
      }
    }

    const transcript: AppTranscriptItem[] = Array.isArray(appLog?.transcript) ? (appLog!.transcript as AppTranscriptItem[]) : [];

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
      return refetch();
    },
  };
}
