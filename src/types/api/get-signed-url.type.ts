export interface PayloadGetSignedUrlRequest {
 key: string
}

export interface PropsGetSignedUrl {
 accessToken: string,
 caseId: string,
 body: PayloadGetSignedUrlRequest
}

export interface FileAdditionalInfo {
 enable: boolean;
 session_key: string;
}

export interface GetSignedTranscriptionUrl {
 type: string; // e.g. "video", "image", etc.
 key: string;  // e.g. "4dd8c4f3-875e-47a2-b597-883fde8fd696/test.mp4"
 additional?: FileAdditionalInfo;
}

export interface PropsGetSignedTranscriptionUrl {
 accessToken: string,
 caseId: string,
 body: GetSignedTranscriptionUrl
}