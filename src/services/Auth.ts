// services/auth.ts
import { API_DOMAIN } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";

export interface User {
 first_name?: string;
 last_name?: string;
 pic?: string | null;
 email?: string;
}

export interface PropsGetUser {
 accessToken: string;
}

export interface PropsUpdateUser {
 accessToken: string;
 body: Partial<User>;
}

export interface PropsSignOut {
 accessToken?: string;
}

const API_USER = `${API_DOMAIN}/auth/user`;
const API_SIGNOUT = `${API_DOMAIN}/auth/signout`;

export const getUser = async <TResponse = unknown>({ accessToken }: PropsGetUser) => {
 const res = await fetcher<TResponse>(API_USER, {
  method: "GET",
  token: accessToken,
 });

 if (!(res as any).ok) {
  throw new Error((res as any).error || `HTTP ${(res as any).status}`);
 }

 return res.data;
};

export const updateUser = async <TResponse = unknown>({ accessToken, body }: PropsUpdateUser) => {
 const res = await fetcher<TResponse>(API_USER, {
  method: "PUT",
  token: accessToken,
  body,
 });

 if (!(res as any).ok) {
  throw new Error((res as any).error || `HTTP ${(res as any).status}`);
 }

 return res;
};

export const signOut = async <TResponse = unknown>({ accessToken }: PropsSignOut = {}) => {
 const res = await fetcher<TResponse>(API_SIGNOUT, {
  method: "POST",
  token: accessToken,
 });

 if (!(res as any).ok) {
  throw new Error((res as any).error || `HTTP ${(res as any).status}`);
 }

 return res;
};

export default {
 getUser,
 updateUser,
 signOut,
};
