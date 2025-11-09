export interface CreditScoreItem {
 key: string;
 value: string;
 header_key: string;
 header_value: string;
 ratio: number;
 full_rate: number;
 order: number;
}

export interface CashflowAnalysis {
 ratio_allocation: number;
 credit_score_data: CreditScoreItem[];
}

export interface PreScreening {
 ratio_allocation: number;
}

export interface QualitativeScoreItem {
 category_id: number;
 order: number;
}

export interface QualitativeScore {
 ratio_allocation: number;
 qualitative_score_data: QualitativeScoreItem[];
}

export interface ScoreCompositionResponse {
 id: number;
 pre_screening: PreScreening;
 cashflow_analysis: CashflowAnalysis;
 qualitative_score: QualitativeScore;
}