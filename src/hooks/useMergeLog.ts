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
import { useCaseDetailContext } from "@/context/InitCaseDetailContext";
import formatRM from "@/lib/utils/formatRM";

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
  const { data: initDataDetail } = useCaseDetailContext()
  const appliedLoanAmount = initDataDetail?.applied_loan_amount || ""
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

  const mapped = useMemo(() => {
    const template = tplQuery.data ?? null;
    const app = appLogQuery.data ?? null;

    if (!template && !app) return empty;

    const appIds = new Set(
      (app?.checklist ?? []).map((i: AppChecklistItem) => String(i.question_id))
    );

    const checklist = (template?.checklist ?? []).map((c: ApiChecklistItem, i: number) => {
      const id = String(c.question_id ?? c.order ?? i);
      return {
        id,
        questionId: id,
        text: safeString(c.question),
        done: appIds.has(id),
      } as ChecklistItem;
    });

    // ---------- Normalizers & alias helpers ----------
    const normalizeRaw = (s?: string | null) =>
      String(s ?? "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_]+/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");

    // strip trailing plural endings for each underscore token (s, es)
    const normalizeTokenwise = (s?: string | null) =>
      normalizeRaw(s)
        .split("_")
        .map((tk) => {
          if (tk.endsWith("es") && tk.length > 2) return tk.slice(0, -2);
          if (tk.endsWith("s") && tk.length > 1) return tk.slice(0, -1);
          return tk;
        })
        .join("_");

    // small alias rules (explicit common cases)
    const aliasKeys = (k: string) => {
      const out = new Set<string>([k]);
      if (k.startsWith("defaults_")) out.add(k.replace(/^defaults_/, "default_"));
      if (k.endsWith("_late_payment") && !k.endsWith("_late_payments")) out.add(k + "s");
      if (k.endsWith("_late_payments") && !k.endsWith("_late_payment")) out.add(k.replace(/_late_payments$/, "_late_payment"));
      return Array.from(out);
    };

    // ---------- Build template maps (ordered) ----------
    const templateList = Array.isArray(template?.structured_notes) ? template!.structured_notes : [];
    const tplExactToLabel = new Map<string, string>();
    const tplNormalizedToExact = new Map<string, string>();

    for (const t of templateList) {
      const exact = String(t.key ?? t.value ?? "");
      const label = safeString(t.value ?? t.key);
      tplExactToLabel.set(exact, label);

      const n = normalizeTokenwise(exact);
      tplNormalizedToExact.set(n, exact);
      tplNormalizedToExact.set(normalizeRaw(exact), exact);

      // also add explicit alias normalized keys
      for (const alias of aliasKeys(exact)) {
        tplNormalizedToExact.set(normalizeTokenwise(alias), exact);
        tplNormalizedToExact.set(normalizeRaw(alias), exact);
      }
    }

    // ---------- Build app maps ----------
    const appList = Array.isArray(app?.structured_notes) ? (app!.structured_notes as AppStructuredNoteArrayItem[]) : [];
    const appExactMap = new Map<string, AppStructuredNoteArrayItem>();
    const appNormalizedMap = new Map<string, AppStructuredNoteArrayItem>();
    const appLabelMap = new Map<string, AppStructuredNoteArrayItem>();

    for (const a of appList) {
      if (!a?.key) continue;
      const exact = String(a.key);
      appExactMap.set(exact, a);
      appNormalizedMap.set(normalizeTokenwise(exact), a);
      appNormalizedMap.set(normalizeRaw(exact), a);
      for (const alias of aliasKeys(exact)) {
        appNormalizedMap.set(normalizeTokenwise(alias), a);
        appNormalizedMap.set(normalizeRaw(alias), a);
      }
      appLabelMap.set(safeString(String(a.value ?? a.key)).toLowerCase(), a);
    }

    // ---------- Matching function ----------
    const findAppForTemplateExact = (tplExact: string): AppStructuredNoteArrayItem | null => {
      // 1) exact
      const exact = appExactMap.get(tplExact);
      if (exact) return exact;

      const n = normalizeTokenwise(tplExact);
      const nmatch = appNormalizedMap.get(n);
      if (nmatch) return nmatch;

      const nr = normalizeRaw(tplExact);
      const nrmatch = appNormalizedMap.get(nr);
      if (nrmatch) return nrmatch;

      for (const alias of aliasKeys(tplExact)) {
        const am = appNormalizedMap.get(normalizeTokenwise(alias)) ?? appNormalizedMap.get(normalizeRaw(alias));
        if (am) return am;
      }

      const tplLabel = safeString(tplExactToLabel.get(tplExact) ?? tplExact).toLowerCase();
      const byLabel = appLabelMap.get(tplLabel);
      if (byLabel) return byLabel;

      return null;
    };

    const structuredRows: KeyValueField[] = [];
    const includedAppKeys = new Set<string>();
    const includedTplKeys = new Set<string>();

    if (templateList.length > 0) {
      for (const t of templateList) {
        const exactKey = String(t.key ?? t.value ?? "");
        const appItem = findAppForTemplateExact(exactKey);

        if (appItem && appItem.key) {
          includedAppKeys.add(String(appItem.key));
          includedTplKeys.add(exactKey);
        }

        let value = appItem ? safeString((appItem.answer as any) || (appItem.value as any)) : "-";
        if (exactKey === "requested_loan_amount") {
          value = formatRM(Number(safeString(String(appliedLoanAmount))));
        }
        const label = tplExactToLabel.get(exactKey) ?? safeString(t.value ?? t.key);

        structuredRows.push({ key: exactKey, label, value });

      }

      for (const a of appList) {
        const exact = String(a.key);
        if (includedAppKeys.has(exact)) continue;
        const n = normalizeTokenwise(exact);
        const nr = normalizeRaw(exact);
        const matchedTplExact = tplNormalizedToExact.get(n) ?? tplNormalizedToExact.get(nr);

        const alreadyIncluded =
          includedTplKeys.has(exact) ||
          (typeof matchedTplExact === "string" && includedTplKeys.has(matchedTplExact));

        if (alreadyIncluded) continue;

        structuredRows.push({
          key: exact,
          label: safeString(String(a.value ?? a.key)),
          value: safeString((a.answer as any) ?? (a.value as any)),
        });
      }
    } else {
      for (const a of appList) {
        if (!a?.key) continue;
        structuredRows.push({
          key: String(a.key),
          label: safeString(String(a.value ?? a.key)),
          value: safeString((a.answer as any) ?? (a.value as any)),
        });
      }
    }

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
      structured: structuredRows,
      operatorNotes: safeString(app?.operator_notes),
      videoUrl,
      transcript: (app?.transcript ?? []) as AppTranscriptItem[],
      screenshots,
      subtitleUrl: signedSubtitleUrl ?? undefined,
      subtitleSrt: subtitleSrtText ?? undefined,

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
