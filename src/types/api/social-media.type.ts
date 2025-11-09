export interface SocialMediaDataResponse {
 id: number;
 application_id: number;
 instagram_url: string;
 facebook_url: string;
 photos: Photo[];
 arkmind_photos: null | Photo[];
 other_docs: OtherDoc[] | null;
}

export interface Photo {
 filename: string;
 mime: string;
 key: string;
}

export interface OtherDoc {
 type: string;
 description: string;
 url: string;
 approve_status: number;
}

export interface PayloadUpdateSocialMedia {
 type: "fb" | "ig";
 url: string;
};  