"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import QueryProvider from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/authContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
 return (
  <SessionProvider>
   <QueryProvider>
    <AuthProvider>
     {children}
    </AuthProvider>
    <Toaster />
   </QueryProvider>
  </SessionProvider>
 );
}
