export interface FinancialHealth {
 profitability: string;
 cash_flow_stability: string;
 working_capital: string;
 credit_history: string;
 others: string;
}

export interface BusinessAndSales {
 revenue_streams: string;
 customer_base: string;
 market_trends: string;
 competitor_positioning: string;
 others: string;
}

export interface LoanPurposeAndObjective {
 purpose: string;
 plan: string;
 others: string;
}

export interface UboAndDirectors {
 management_experience: string;
 company_reputation: string;
 stability_ownership: string;
 others: string;
}

export interface RiskControls {
 guarantees: string;
 others: string;
}

export interface CashFlowAndRepaymentAbility {
 projected_cash_flow: string;
 seasonal_cash_flow: string;
 backup_repayment_strategy: string;
 others: string;
}

export interface LegalAndCompliance {
 mandatory_identification: string;
 valid_lisence: string;
 no_pending_lawsuit: string;
 tax_compliance: string;
 others: string;
}

export interface BusinessAssessmentResponse {
 id: number;
 application_id: number;
 financial_health: FinancialHealth;
 business_and_sales: BusinessAndSales;
 loan_purpose_and_objective: LoanPurposeAndObjective;
 ubo_and_directors: UboAndDirectors;
 risk_controls: RiskControls;
 cash_flow_and_repayment_ability: CashFlowAndRepaymentAbility;
 legal_and_compliance: LegalAndCompliance;
}

export type Criterion = {
 label: string;
 value?: string | React.ReactNode;
 hint?: string;
};

export type Section = {
 id: number;
 title: string;
 criteria: Criterion[];
};