// /types/api/get-credit-score.type.ts

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

/** Common score pair structure */
export interface ScorePair {
 key: string;
 score: number;
}

/** Pre-screening section */
export interface PreScreening {
 credit_score_data: { key: PreScreeningKey; score: number }[];
}

/** Cashflow analysis section */
export interface CashflowAnalysis {
 credit_score_data: { key: CashflowAnalysisKey; score: number }[];
}

/** Qualitative score section */
export interface QualitativeScore {
 qualitative_score_data: {
  category_id: number;
  final_score: number;
 }[];
}

/** Response data from GET /credit-score */
export interface GetCreditScoreData {
 pre_screening: PreScreening;
 cashflow_analysis: CashflowAnalysis;
 qualitative_score: QualitativeScore;
}

/** Full API response */
export interface GetCreditScoreResponse {
 data: GetCreditScoreData;
}

/** Wrapper for standard fetcher responses */
export interface ApiResponse<T = unknown> {
 ok: boolean;
 status: number;
 data?: T;
 error?: string;
}
