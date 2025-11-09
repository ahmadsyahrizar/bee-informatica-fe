export type LogType = "phone" | "visit" | "field" | "other";

export interface LogChecklistAdditional {
 enable: boolean;
 session_key?: string;
}

export interface PostLogChecklistRequest {
 log_type: LogType | string;
 question_id: string;
 checked: boolean;
 additional?: LogChecklistAdditional;
}

export interface ApiResponse<T = unknown> {
 ok: boolean;
 status: number;
 data?: T;
 error?: string;
}
