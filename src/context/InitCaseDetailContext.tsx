"use client";

import React, { createContext, useContext, ReactNode } from "react";
import useCaseDetail from "@/hooks/useCaseDetail";
import type { CaseDetailInitResponse } from "@/types/api/case-detail.type";

export type CaseDetailContextValue = {
 caseId: string;
 data?: CaseDetailInitResponse;
 isLoading: boolean;
 isError: boolean;
 refetch?: () => void;
};

const CaseDetailContext = createContext<CaseDetailContextValue | undefined>(undefined);

export function CaseDetailProvider({
 caseId,
 children,
}: {
 caseId: string;
 children: ReactNode;
}) {
 const {
  data: initData,
  isLoading: isLoadingInit,
  isError: isErrorInit,
 } = useCaseDetail<CaseDetailInitResponse>({ type: "initial", caseId });

 const value: CaseDetailContextValue = {
  caseId,
  data: initData,
  isLoading: !!isLoadingInit,
  isError: !!isErrorInit,
 };

 return <CaseDetailContext.Provider value={value}>{children}</CaseDetailContext.Provider>;
}

export function useCaseDetailContext(): CaseDetailContextValue {
 const ctx = useContext(CaseDetailContext);
 if (!ctx) {
  throw new Error("useCaseDetailContext must be used within a CaseDetailProvider");
 }
 return ctx;
}
