export type Stage =
 | "Phone"
 | "Meet"
 | "1st Review"
 | "Final Review"
 | "Approved"
 | "Rejected";

export type CaseRowType = {
 id: string;
 clientName: string;
 caseId: string;
 company: string;
 stage: Stage;
 schedule?: string; // ISO or display string
 score?: number; // 0-100
 attentionRequired?: boolean;
 avatars?: { src?: string; name: string }[];
};