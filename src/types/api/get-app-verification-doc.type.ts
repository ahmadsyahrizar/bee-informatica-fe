export interface DocumentListResponse {
 type: string;          // e.g. "utility_bills_address", "ssm", "license", "cto"
 description: string;   // human-readable label
 url: string;           // public document link
 approve_status: number; // e.g. 0 = pending, 1 = approved, etc.
}   