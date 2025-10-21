"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import QueryProvider from "./providers";
import { Toaster } from "@/components/ui/sonner";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
 return (
  <SessionProvider>
   <QueryProvider>
    {children}
    <Toaster />
   </QueryProvider>
  </SessionProvider>
 );
}
