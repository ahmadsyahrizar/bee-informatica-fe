import { Stage } from "../case";

export interface PayloadMemoRequest {
 stage: Stage,
 memo: string
}
export interface MemoUser {
 first_name: string;
 pic: string;
 last_name: string;
 created_at: string;
 updated_at: string;
}

export interface GetMemoResponse {
 id: number;
 user: MemoUser;
 application_id: number;
 stage: string;
 memo: string;
 reason: string;
 created_by: number;
 updated_by: number;
 created_at: string;
 updated_at: string;
}

export interface ApiResponse<T = unknown> {
 ok: boolean;
 status: number;
 data?: T;
 error?: string;
}
