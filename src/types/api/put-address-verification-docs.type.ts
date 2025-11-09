
export type AddressDocKey =
 | "utility_bills_address"
 | "license"
 | "ssm"
 | "cto";

export interface PutAddressVerificationDocsRequest {
 approved_docs: AddressDocKey[];
 rejected_docs: AddressDocKey[];
}

export interface ApiResponse<T = unknown> {
 ok: boolean;
 status: number;
 data?: T;
 error?: string;
}
