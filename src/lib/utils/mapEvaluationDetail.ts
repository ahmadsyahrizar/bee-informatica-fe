import { BusinessAssessmentResponse, Section } from "@/types/api/evaluation-detail.type";

const hasData = (v?: string) => (v && v.trim().length ? v : "-");

export function mapAssessmentToSections(data: BusinessAssessmentResponse): Section[] {
 return [
  {
   id: 1,
   title: "Financial Health",
   criteria: [
    {
     label: "Profitability (Net income over past 6 months)",
     value: hasData(data?.financial_health?.profitability),
    },
    {
     label: "Cash flow stability",
     hint: "Consistency of inflows/outflows",
     value: hasData(data?.financial_health?.cash_flow_stability),
    },
    {
     label: "Working Capital",
     hint: "Ability to cover short term liabilities",
     value: hasData(data?.financial_health?.working_capital),
    },
    {
     label: "Credit History",
     value: hasData(data?.financial_health?.credit_history),
    },
    {
     label: "Others",
     value: hasData(data?.financial_health?.others),
    },
   ],
  },

  {
   id: 2,
   title: "Business & Sales",
   criteria: [
    {
     label: "Revenue Streams",
     value: hasData(data?.business_and_sales?.revenue_streams),
    },
    {
     label: "Customer Base",
     value: hasData(data?.business_and_sales?.customer_base),
    },
    {
     label: "Market Trends and Growth potential in industry.",
     value: hasData(data?.business_and_sales?.market_trends),
    },
    {
     label: "Competitor’s positioning & market share",
     value: hasData(data?.business_and_sales?.competitor_positioning),
    },
    {
     label: "Others",
     value: hasData(data?.business_and_sales?.others),
    },
   ],
  },

  {
   id: 3,
   title: "Loan Purpose & Objective",
   criteria: [
    {
     label: "Purpose",
     value: hasData(data?.loan_purpose_and_objective?.purpose),
    },
    {
     label: "Plan",
     hint: "Operational plan to use the loan",
     value: hasData(data?.loan_purpose_and_objective?.plan),
    },
    {
     label: "Others",
     value: hasData(data?.loan_purpose_and_objective?.others),
    },
   ],
  },

  {
   id: 4,
   title: "UBO & Directors",
   criteria: [
    {
     label: "Management Experience",
     value: hasData(data?.ubo_and_directors?.management_experience),
    },
    {
     label: "Company Reputation",
     value: hasData(data?.ubo_and_directors?.company_reputation),
    },
    {
     label: "Stability of Ownership",
     value: hasData(data?.ubo_and_directors?.stability_ownership),
    },
    {
     label: "Others",
     value: hasData(data?.ubo_and_directors?.others),
    },
   ],
  },

  {
   id: 5,
   title: "Risk Controls",
   criteria: [
    {
     label: "Guarantees",
     value: hasData(data?.risk_controls?.guarantees),
    },
    {
     label: "Others",
     value: hasData(data?.risk_controls?.others),
    },
   ],
  },

  {
   id: 6,
   title: "Cash Flow & Repayment Ability",
   criteria: [
    {
     label: "Projected Cash Flow",
     value: hasData(data?.cash_flow_and_repayment_ability?.projected_cash_flow),
    },
    {
     label: "Seasonal Cash Flow",
     hint: "Seasonality and peaks/valleys",
     value: hasData(data?.cash_flow_and_repayment_ability?.seasonal_cash_flow),
    },
    {
     label: "Backup Repayment Strategy",
     value: hasData(data?.cash_flow_and_repayment_ability?.backup_repayment_strategy),
    },
    {
     label: "Others",
     value: hasData(data?.cash_flow_and_repayment_ability?.others),
    },
   ],
  },

  {
   id: 7,
   title: "Legal & Compliance",
   criteria: [
    {
     label: "Mandatory Identification",
     value: hasData(data?.legal_and_compliance?.mandatory_identification),
    },
    {
     label: "Valid License",
     value: hasData(data?.legal_and_compliance?.valid_lisence),
    },
    {
     label: "Pending Lawsuits",
     hint: "Any ongoing legal actions",
     value: hasData(data?.legal_and_compliance?.no_pending_lawsuit),
    },
    {
     label: "Tax Compliance",
     value: hasData(data?.legal_and_compliance?.tax_compliance),
    },
    {
     label: "Others",
     value: hasData(data?.legal_and_compliance?.others),
    },
   ],
  },
 ];
}
