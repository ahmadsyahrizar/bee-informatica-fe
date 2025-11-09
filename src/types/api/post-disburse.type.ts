
export interface PostDisburseLoanRequest {
 memo?: string;
}

export interface ApiResponse<T = unknown> {
 ok: boolean;
 status: number;
 data?: T;
 error?: string;
}
