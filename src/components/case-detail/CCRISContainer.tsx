"use client";

import * as React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CCRISTable } from "@/components/case-detail/CCRISTable";
import useCaseDetail from "@/hooks/useCaseDetail";
import { useParams } from "next/navigation";
import type { CreditReportList } from "@/types/api/ccris.type";

export function CCRISContainer() {
  const id = useParams().id;
  const { data } = useCaseDetail<CreditReportList>({ type: "ccris_report", caseId: id as string });

  const individualData = data?.find(({ type }) => type === 'individual')?.reports ?? [];
  const companyData = data?.find(({ type }) => type === 'company')?.reports ?? [];

  return (
    <section className="w-full mt-32 scroll-mt-28 lg:scroll-mt-32" id="ccris">
      <h2 className="text-[18px] text-gray-900 font-semibold tracking-tight">CCRIS</h2>

      <Tabs defaultValue="individual" className="mt-4 w-full">
        <TabsList className="h-auto bg-transparent p-0 border-b rounded-none border-slate-200">
          <TabsTrigger value="individual" className="relative rounded-none bg-transparent px-0 mr-10 pb-3 text-[14px] font-semibold text-slate-400 data-[state=active]:text-orange-600 data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:left-0 data-[state=active]:after:bottom-[-1px] data-[state=active]:after:h-[3px] data-[state=active]:after:w-full data-[state=active]:after:bg-orange-600">
            Individual
          </TabsTrigger>

          <TabsTrigger value="company" className="relative rounded-none bg-transparent px-0 mr-10 pb-3 text-14px font-semibold text-slate-400 data-[state=active]:text-orange-600 data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:left-0 data-[state=active]:after:bottom-[-1px] data-[state=active]:after:h-[3px] data-[state=active]:after:w-full data-[state=active]:after:bg-orange-600">
            Company
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="mt-5">
          <CCRISTable rows={individualData} />
        </TabsContent>

        <TabsContent value="company" className="mt-5">
          <CCRISTable rows={companyData} />
        </TabsContent>
      </Tabs>
    </section>
  );
}
