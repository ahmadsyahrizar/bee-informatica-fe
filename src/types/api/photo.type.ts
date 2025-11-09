export interface PayloadPhotoRequest {
 filename: string;
 mime: string;
 key: string;
}

export interface PropsCreatePhoto {
 accessToken: string;
 caseId: string;
 body: PayloadPhotoRequest;
}

export interface PayloadDeletePhoto {
 key: string;
}

export interface PropsDeletePhoto {
 accessToken: string;
 caseId: string;
 body: PayloadDeletePhoto;
};