export interface PostSubmitToCamRevertRequest {
 reason: string;
 session_key: string;
}

export interface ApiResponse<T = unknown> {
 ok: boolean;
 status: number;
 data?: T;
 error?: string;
}  
