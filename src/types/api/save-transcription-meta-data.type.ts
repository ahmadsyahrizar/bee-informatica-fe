export interface UploadAdditionalInfo {
 enable: boolean;
 session_key: string;
}

export interface UploadFilePayload {
 filename: string; // e.g. "test.mp4"
 mime: string;     // e.g. "video/mp4"
 type: string;     // e.g. "phone", "video", etc.
 key: string;      // e.g. "4dd8c4f3-875e-47a2-b597-883fde8fd696/test.mp4"
 reupload?: boolean;
 additional?: UploadAdditionalInfo;
}

export interface PropsSaveTranscriptionMetadata {
 accessToken: string;
 caseId: string;
 body: UploadFilePayload
}

export interface PayloadDeleteTranscriptionMetadata {
 type: string,
 key: string,
 additional: {
  enable: true,
  session_key: string
 }
}

export interface PropsDeleteTranscriptionMetadata {
 accessToken: string;
 caseId: string;
 body: PayloadDeleteTranscriptionMetadata
}  