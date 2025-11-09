export interface FinancialSummary {
 month: string;
 cash_in: number;
 cash_out: number;
 net_cash: number;
 balance: number;
 buffer: number;
}

export interface MetaData {
 cash_flow_health: string;
 cash_flow_health_identifier: string;
 ending_balance_consistency: string;
 ending_balance_consistency_identifier: string;
 cash_in_consistency: string;
 cash_in_consistency_identifier: string;
 high_inflow_month: string;
 high_inflow_month_identifier: string;
 low_inflow_month: string;
 low_inflow_month_identifier: string;
 net_cashflow: string;
 net_cashflow_identifier: string;
}

export interface FinancialAnalysisResponse {
 id: number;
 application_id: number;
 strengths: string[];
 risks: string[];
 financial_summaries: FinancialSummary[];
 meta: MetaData;
}
