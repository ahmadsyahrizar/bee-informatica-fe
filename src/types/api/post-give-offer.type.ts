
/** ISO 8601 date string (e.g. "2025-10-23T00:00:00Z") */
export type ISODateString = string;

/** Request body for POST /applications/:id/give-offer */
export interface PostGiveOfferRequest {
 approved_loan_amount: number;
 memo?: string;
 repayment_deadline: ISODateString;
}

/** Generic API response wrapper used by your fetcher util.
 *  Update when you have the real response shape.
 */
export interface ApiResponse<T = unknown> {
 ok: boolean;
 status: number;
 data?: T;
 error?: string;
}
