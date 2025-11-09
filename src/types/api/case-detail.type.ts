export interface CaseDetailRequest {
 accessToken: string;
 caseId: string | number;
 type: string;
}

export type CaseDetailInitResponse = {
 id: number;
 applicant_name: string;
 application_code: string;
 applied_loan_amount: number;
 approved_loan_amount: number;
 company_name: string;
 score: number;
 stage: string;
};    