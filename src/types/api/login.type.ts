export interface LoginBody {
 email: string;
 remember?: boolean;
}

export interface OTPBody {
 code: string
}

export interface OTPResponse {
 data: {
  token: string
 }
}