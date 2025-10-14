import { API_DOMAIN } from "@/constants";
import { fetcher } from "@/lib/utils/fetcher";
import { OTPResponse } from "@/types/api/login.type";
import NextAuth, { SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_VERIFICATION = `${API_DOMAIN}/auth/verify-otp`

if (!API_DOMAIN) {
 throw new Error("Missing AUTH_API_URL env");
}

export const authOptions = {
 providers: [
  CredentialsProvider({
   id: "credentials",
   name: "Email OTP",
   credentials: {
    email: { label: "email", type: "text" },
    code: { label: "code", type: "text" },
    tempToken: { label: "Temp token", type: "text" }
   },
   async authorize(credentials) {
    if (!credentials?.email || !credentials.code || !credentials?.tempToken) return null;

    try {
     const resp = await fetcher<OTPResponse>(API_VERIFICATION, {
      method: "POST",
      headers: {
       "Authorization": `Bearer ${credentials.tempToken}`
      },
      body: {
       code: Number(credentials.code)
      }
     });

     if (!resp.ok) return null;
     const finalToken = resp.data?.data.token;
     if (!finalToken) return null;
     return {
      id: crypto.randomUUID(),
      accessToken: finalToken
     }

    } catch (error) {
     console.error("authorize error", error);
     return null
    }
   }
  })
 ],
 session: { strategy: ("jwt" as SessionStrategy), maxAge: 60 * 60 * 24 * 7 },
 secret: "secret",
 callbacks: {
  async jwt({ token, user }: { token: Record<string, string>; user?: Record<string, string> }) {
   if (user && (user as Record<string, string>).accessToken) {
    token.accessToken = (user as Record<string, string>).accessToken;
   }
   return token;
  },

  async session({ session, token }: { session: Record<string, string>; token: Record<string, string> }) {
   (session as Record<string, string>).accessToken = (token as Record<string, string>).accessToken;
   return session;
  },
 },
 pages: {
  signIn: '/login'
 }
}
// @ts-expect-error rija
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }; 