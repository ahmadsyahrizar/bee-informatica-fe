"use client";

import { useMemo, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import GetLogTemplate from "@/services/GetLogTemplate";
import GetAppLog from "@/services/GetAppLog";
import GetSignedTranscriptionUrl from "@/services/GetSignedUrlTranscription";

import type {
  LogTemplateResponse,
  ChecklistItem as ApiChecklistItem,
} from "@/types/api/log.type";
import type { PropsGetAppLog } from "@/types/api/get-app-log.type";

import type {
  AppChecklistItem,
  AppLogShape,
  AppRecording,
  AppScreenshot,
  AppStructuredNoteArrayItem,
  AppTranscriptItem,
  ChecklistItem,
  KeyValueField,
  VideoCallLogData,
} from "@/types/app-log";

import { BASE_API_URL } from "@/constants";

const SRT_PROXY = "/api/srt";

const POLL_INTERVAL_MS = 5000;

const empty: VideoCallLogData = {
  checklist: [],
  structured: [],
  operatorNotes: "",
  videoUrl: undefined,
  transcript: [],
  screenshots: [],
};

// -------------------------------
// Helpers
// -------------------------------
function safeString(v?: string | null) {
  return !v ? "-" : String(v);
}

const extractRecordings = (l?: AppLogShape | null): AppRecording[] => {
  if (!l) return [];
  if (Array.isArray(l.recording)) return l.recording as AppRecording[];
  if (l.recording) return [l.recording as AppRecording];
  return [];
};

const extractRecordingStatus = (r?: AppRecording | null): string | null => {
  if (!r) return null;
  const s = (r as any).status ?? (r as any).subtitle_status ?? null;
  return s ? String(s).toLowerCase() : null;
};

// -------------------------------
// Hook Main
// -------------------------------
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
}) {
  const enabled = Boolean(open && accessToken && caseId);

  // -------------------------------------
  // 1) TEMPLATE QUERY (NO POLLING)
  // -------------------------------------
  const tplQuery = useQuery({
    queryKey: ["logTemplate", caseId, type],
    enabled,
    queryFn: async (): Promise<LogTemplateResponse | null> => {
      const res = await GetLogTemplate<{ data: LogTemplateResponse }>({
        accessToken,
        caseId,
        type,
      });
      return (res?.data?.data ?? null) as LogTemplateResponse | null;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // -------------------------------------
  // 2) APP LOG QUERY (WITH POLLING)
  // -------------------------------------
  const appLogQuery = useQuery({
    queryKey: ["appLog", caseId, type],
    enabled,
    queryFn: async (): Promise<AppLogShape | null> => {
      const res = await GetAppLog<{ data: PropsGetAppLog }>({
        accessToken,
        caseId,
        type,
      });
      return (res?.data?.data ?? null) as AppLogShape | null;
    },
    refetchInterval: (query: any) => {
      try {
        const latest: AppLogShape | undefined | null = query?.state?.data ?? null;
        const recs = extractRecordings(latest ?? null);
        const statuses = recs.map((r) => extractRecordingStatus(r));
        return statuses.some((s) => s === "in_progress") ? POLL_INTERVAL_MS : false;
      } catch {
        return false;
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 30,
    retry: 1,
  });

  const isTemplateLoading = tplQuery.isLoading;
  const isAppLogLoading = appLogQuery.isLoading;

  const recordings = extractRecordings(appLogQuery.data ?? null);
  const isAppLogPolling = recordings
    .map((r) => extractRecordingStatus(r))
    .some((s) => s === "in_progress");

  // -------------------------------------
  // 3) Fetch SIGNED URL + SRT after appLog updates
  // -------------------------------------
  const [signedPlaybackUrl, setSignedPlaybackUrl] = useState<string | null>(null);
  const [signedSubtitleUrl, setSignedSubtitleUrl] = useState<string | null>(null);
  const [subtitleSrtText, setSubtitleSrtText] = useState<string | null>(null);
  const [isFetchingSigned, setIsFetchingSigned] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const appLog = appLogQuery.data ?? null;
    if (!appLog) {
      setSignedPlaybackUrl(null);
      setSignedSubtitleUrl(null);
      setSubtitleSrtText(null);
      return;
    }

    (async () => {
      setIsFetchingSigned(true);
      setSignedPlaybackUrl(null);
      setSignedSubtitleUrl(null);
      setSubtitleSrtText(null);

      try {
        const recs = extractRecordings(appLog);

        // -------- Playback Signed URL --------
        const firstRecWithKey = recs.find((r) => r && (r as any).key);
        const playbackKey = firstRecWithKey ? (firstRecWithKey as any).key : null;

        if (playbackKey) {
          const body = { type, key: playbackKey };
          const sr = await GetSignedTranscriptionUrl<{ data: { data?: { url?: string } } }>({
            accessToken,
            caseId,
            body,
          });
          const cand = (sr as any)?.data?.data ?? null;
          const url = typeof cand === "object" ? cand?.url : cand;
          if (!cancelled) setSignedPlaybackUrl(url ?? null);
        }

        // -------- Subtitle Signed URL --------
        let subtitleKey: string | null = null;
        let subtitleStatus: string | null = null;

        for (const r of recs) {
          if (!r) continue;
          const subField = (r as any).subtitle_key ?? (r as any).subtitle ?? null;
          if (!subtitleKey && subField)
            subtitleKey = typeof subField === "string" ? subField : subField.key;
          if (!subtitleStatus && (r as any).status)
            subtitleStatus = String((r as any).status);
          if (subtitleKey && subtitleStatus) break;
        }

        if (subtitleKey && subtitleStatus?.toLowerCase() === "completed") {
          const body = { type, key: subtitleKey };
          const sr = await GetSignedTranscriptionUrl<{ data: { data?: { url?: string } } }>({
            accessToken,
            caseId,
            body,
          });
          const cand = (sr as any)?.data?.data ?? null;
          const url = typeof cand === "object" ? cand?.url : cand;
          if (!cancelled) setSignedSubtitleUrl(url ?? null);

          if (url) {
            const proxyUrl = `${SRT_PROXY}?url=${encodeURIComponent(url)}`;
            const resp = await fetch(proxyUrl);
            const text = resp.ok ? await resp.text() : "";
            if (!cancelled) setSubtitleSrtText(text.trim() || null);
          }
        }
      } catch (e) {
        if (!cancelled) {
          setSignedPlaybackUrl(null);
          setSignedSubtitleUrl(null);
          setSubtitleSrtText(null);
        }
      } finally {
        if (!cancelled) setIsFetchingSigned(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [appLogQuery.data, accessToken, caseId, type]);

  // -------------------------------------
  // 4) Final Mapping → VideoCallLogData
  // -------------------------------------
  const mapped = useMemo(() => {
    const template = tplQuery.data ?? null;
    const app = appLogQuery.data ?? null;

    if (!template && !app) return empty;

    const appIds = new Set(
      (app?.checklist ?? []).map((i: AppChecklistItem) =>
        String(i.question_id),
      ),
    );

    const checklist = (template?.checklist ?? []).map(
      (c: ApiChecklistItem, i: number) => {
        const id = String(c.question_id ?? c.order ?? i);
        return {
          id,
          questionId: id,
          text: safeString(c.question),
          done: appIds.has(id),
        } as ChecklistItem;
      },
    );

    const structuredMap = new Map<string, KeyValueField>();
    for (const s of template?.structured_notes ?? []) {
      const key = String(s.key ?? s.value ?? "");
      structuredMap.set(key, {
        key,
        label: safeString(s.value ?? s.key),
        value: "-",
      });
    }

    for (const s of (app?.structured_notes ??
      []) as AppStructuredNoteArrayItem[]) {
      if (!s?.key) continue;
      structuredMap.set(String(s.key), {
        key: String(s.key),
        label:
          structuredMap.get(String(s.key))?.label ??
          safeString(String(s.value ?? s.key)),
        value: safeString((s.answer as any) ?? (s.value as any)),
      });
    }

    const structured = Array.from(structuredMap.values());

    const videoUrl =
      signedPlaybackUrl ??
      (app?.recording && (app.recording as any[])[0]?.key
        ? `${BASE_API_URL}/files/${(app.recording as any)[0].key}`
        : undefined);

    const screenshots = (app?.screenshots ?? []).map((s: AppScreenshot) => ({
      url: s.key ? `${BASE_API_URL}/files/${s.key}` : s.url,
      caption: s.caption,
    }));

    return {
      checklist,
      structured,
      operatorNotes: safeString(app?.operator_notes),
      videoUrl,
      transcript: (app?.transcript ?? []) as AppTranscriptItem[],
      screenshots,
      subtitleUrl: signedSubtitleUrl ?? undefined,
      subtitleSrt: subtitleSrtText ?? undefined,

      // ------ UI FLAGS ------
      isTemplateLoading,
      isAppLogLoading,
      isAppLogPolling,
      isFetchingSigned,
    };
  }, [
    tplQuery.data,
    appLogQuery.data,
    signedPlaybackUrl,
    signedSubtitleUrl,
    subtitleSrtText,
    isTemplateLoading,
    isAppLogLoading,
    isAppLogPolling,
    isFetchingSigned,
  ]);

  return {
    data: mapped,
    isLoading:
      isTemplateLoading || isAppLogLoading || isFetchingSigned || isAppLogPolling,
    isError: tplQuery.isError || appLogQuery.isError,
    error: tplQuery.error ?? appLogQuery.error,
    refetch: async () => {
      await Promise.all([tplQuery.refetch(), appLogQuery.refetch()]);
    },
  };
}
