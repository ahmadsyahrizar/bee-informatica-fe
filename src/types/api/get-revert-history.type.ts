export interface GetRevertHistoryResponse {
 data: string
}

export interface ApiResponse<T = unknown> {
 ok: boolean;
 status: number;
 data?: T;
 error?: string;
}
