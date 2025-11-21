"use client";
import React, { createContext, useContext, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as authService from "@/services/Auth";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

type TUser = authService.User | null;

interface AuthContextValue {
 user: TUser;
 isLoading: boolean;
 refetch: () => void;
 setUserLocally: (u: TUser) => void;
 refreshUser: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
 const queryClient = useQueryClient();
 // @ts-expect-error RIJA
 const accessToken = useSession()?.data?.accessToken ?? ""
 const { data, isLoading, refetch } = useQuery({
  queryKey: ["auth", "user"],
  queryFn: () => authService.getUser({ accessToken }),
  enabled: !!accessToken
 });

 const setUserLocally = useCallback((u: TUser) => {
  queryClient.setQueryData(["auth", "user"], u);
 }, [queryClient]);

 const refreshUser = useCallback(() => {
  refetch();
 }, [refetch]);

 return (
  <AuthContext.Provider value={{ user: data ?? null, isLoading, refetch: refreshUser, setUserLocally, refreshUser }}>
   {children}
  </AuthContext.Provider>
 );
};

export const useAuth = (): AuthContextValue => {
 const ctx = useContext(AuthContext);
 if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
 return ctx;
};
