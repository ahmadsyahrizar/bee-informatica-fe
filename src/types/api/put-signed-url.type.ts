import { Stage } from "../case";

export interface PayloadPutSignedUrlRequest {
 filename: string;
 mime: string;
 type: Stage;
 additional?: {
  enable?: boolean;
  session_key?: string;
 };
}

export interface PutSignedUrlResponseData {
 url: string;
 key: string;
}

export interface PutSignedUrlResponse<T = PutSignedUrlResponseData> {
 data: T;
 status?: string;
 message?: string;
}

export interface PropPutSignedUrlRequest {
 accessToken: string;
 caseId: string | number;
 body: PayloadPutSignedUrlRequest;
}