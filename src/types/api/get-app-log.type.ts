import { Stage } from "../case";
export interface PropsGetAppLog {
 accessToken: string;
 caseId: string;
 type: Stage
}

export interface PayloadGetAppLogRequest {
 type: string;
}

export interface ChecklistItem {
 question_id: string;
}

export interface RecordingInfo {
 filename: string;
 mime: string;
 key: string;
 subtitle_key: string;
}

export interface GetAppLogResponse {
 id: number;
 type: string; // e.g. "phone", "video", etc.
 checklist: ChecklistItem[];
 structured_notes: unknown | null; // can replace 'unknown' with specific type if known
 recording: RecordingInfo[];
}
