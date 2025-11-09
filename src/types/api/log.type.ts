export type LogType = "video" | "phone"

export interface PayloadLogRequest {
 type: LogType
}

export interface LogTemplateResponse {
 id: number;
 type: LogType;
 checklist: ChecklistItem[];
 structured_notes: StructuredNote[];
}

export interface ChecklistItem {
 question_id: string;         // e.g. "V1"
 question: string;            // question text
 credit_score_item: string;   // e.g. "-", "Signboard"
 weight: number;              // e.g. 0.24
 report_category: string[];   // e.g. ["legal_compliance"]
 order: number;               // ordering index
 priority: number;            // priority flag (number)
}

export interface StructuredNote {
 key: string;     // e.g. "requested_loan_amount"
 value: string;   // label / human readable
 answer: string;  // possibly empty or filled string
 order: number;   // ordering index
}
