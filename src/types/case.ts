export type Stage =
 | "phone"
 | "video"
 | "1st Review"
 | "Final Review"
 | "Approved"
 | "Rejected";

export interface CaseRowType {
 id: string | number;
 applicant_name: string;
 application_code: string;
 company_name: string;
 stage: string;
 schedule?: string;
 score?: number;
 attentionRequired?: boolean;
 applied_loan_amount?: number;
 approved_loan_amount?: number;
 registered_at?: string
};

export interface CaseRowPagination {
 current_page: number;
 total_pages: number;
 total_records: number;
 page_size: number;
}