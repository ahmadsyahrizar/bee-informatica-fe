export type Stage =
 | "Phone"
 | "Meet"
 | "1st Review"
 | "Final Review"
 | "Approved"
 | "Rejected";

export type CaseRowType = {
 id: string | number;
 clientName: string;
 caseId: string;
 company: string;
 stage: string;
 schedule?: string;
 score?: number;
 attentionRequired?: boolean;
 avatars?: { src?: string; name: string }[];
 appliedLoanAmount?: number;   // in RM
 approvedLoanAmount?: number;  // in RM
};