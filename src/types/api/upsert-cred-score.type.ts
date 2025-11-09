// /types/api/post-credit-score.type.ts

export type PreScreeningKey =
 | "ssm"
 | "license"
 | "kyc"
 | "signboard"
 | "identity_check";

export type CashflowAnalysisKey =
 | "average_balance"
 | "balance_stability"
 | "sudden_increase_or_decrease"
 | "cash_flow_from_main_business"
 | "other_revenue_stream"
 | "cash_flow_analysis"
 | "individual_ctos"
 | "individual_ccris"
 | "business_ctos"
 | "business_ccris"
 | "cash_flow_other_revenue_stream"
 | "payment_term"
 | "payment_delays_from_main_clients"
 | "payment_method"
 | "number_of_main_clients"
 | "year_of_business_operation"
 | "office_tour_verification"
 | "personal_guarantees";

/**
 * Single score item used for both pre_screening and cashflow_analysis
 */
export interface ScoreItem {
 key: PreScreeningKey | CashflowAnalysisKey;
 score: number;
}

/**
 * Qualitative score entry
 */
export interface QualitativeScoreItem {
 category_id: number;
 score: number;
}

/**
 * Request payload for POST /{caseId}/credit-score
 */
export interface PostCreditScoreRequest {
 pre_screening: ScoreItem[];
 cashflow_analysis: ScoreItem[];
 qualitative_score: QualitativeScoreItem[];
}

/**
 * Generic response wrapper from your fetcher util.
 * Adjust fields to match your real API response when known.
 */
export interface ApiResponse<T = unknown> {
 ok: boolean;
 status: number;
 data?: T;
 error?: string;
}
