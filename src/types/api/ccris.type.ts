export interface ConductOfAccount {
 month: number;
 count?: number;
}

export interface Report {
 date: string;
 facility: string;
 outstanding: number;
 limit: number;
 conduct_of_account: ConductOfAccount[];
}

export interface CreditReport {
 id: number;
 application_id: number;
 type: "individual" | "company";
 reports: Report[];
}

// full array type
export type CreditReportList = CreditReport[];
