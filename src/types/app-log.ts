import { PropsGetAppLog } from "./api/get-app-log.type";
import { LogTemplateResponse } from "./api/log.type";

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
 subtitleUrl?: string
 subtitleSrt?: string;
 isTemplateLoading?: boolean;
 isAppLogLoading?: boolean;
 isAppLogPolling?: boolean;
 isFetchingSigned?: boolean;
};

/** App shapes (runtime-tolerant) */
export type AppChecklistItem = {
 question_id?: string | number | null;
 [k: string]: unknown;
};

export type AppStructuredNoteArrayItem = {
 key?: string | number | null;
 value?: string | null;
 answer?: string | null;
 [k: string]: unknown;
};

export type AppRecording = {
 key?: string | null;
 filename?: string | null;
 mime?: string | null;
 subtitle_key?: string | null;
 [k: string]: unknown;
};

export type AppScreenshot = {
 key?: string | null;
 url?: string | null;
 caption?: string | null;
 [k: string]: unknown;
};

export type AppTranscriptItem = {
 role?: "Staff" | "Client" | string;
 time?: string;
 text?: string;
 [k: string]: unknown;
};

export type AppLogShape = {
 checklist?: AppChecklistItem[] | null;
 structured_notes?: AppStructuredNoteArrayItem[] | Record<string, AppStructuredNoteArrayItem> | null;
 operator_notes?: string | null;
 recording?: AppRecording | AppRecording[] | null;
 transcript?: AppTranscriptItem[] | null;
 screenshots?: AppScreenshot[] | null;
 [k: string]: unknown;
};

/** Query return typing */
export type QueryPayload = {
 tplRes?: LogTemplateResponse | null;
 logRes?: PropsGetAppLog | null;
 signedSubtitleUrl?: string | null;
 subtitleSrtText?: string | null;
 signedUrl?: string | null; // new: signed url if available
};