export interface RevertUser {
 first_name?: string;
 last_name?: string;
 pic?: string | null;
 created_at?: string;
 updated_at?: string;
 deleted_at?: string | null;
}

export interface RevertHistory {
 id: number;
 application_id: number;
 session: string;
 type: string;
 reason?: string | null;
 created_at?: string;
 updated_at?: string;
 deleted_at?: string | null;
 created_by?: number;
 updated_by?: number;
 user?: RevertUser | null;
}

export type HistoryWrapper =
 | { type: "revert"; revert_history: RevertHistory }
 | { type: "submit"; revert_history?: RevertHistory }
 | { type: "log_record_by"; additional_log?: any }
 | { type: string;[k: string]: any };

export interface SessionHistories {
 session: string;
 histories: HistoryWrapper[];
}

export interface GetRevertHistoryData {
 data: SessionHistories[]; // note: API returns data.data -> array
}

export interface GetRevertHistoryResponse {
 ok: boolean;
 status: number;
 data?: GetRevertHistoryData;
 error?: string;
 raw?: any;
}
