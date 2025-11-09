'use client';

import { Suspense } from "react";
import { OverviewSidebar } from "@/components/case-detail/OverviewSidebar";
import { SummaryBlock } from "@/components/case-detail/SummaryBlock";
import SalesReport from "@/components/case-detail/SalesReport";
import EvaluationDetails from "@/components/case-detail/EvaluationDetail";
import { CCRISContainer } from "@/components/case-detail/CCRISContainer";

import AiContainer from "@/components/case-detail/AiContainer";
import MediaContainer from "@/components/case-detail/MediaContainer";
import { CaseDetailProvider } from "@/context/InitCaseDetailContext";
import { useParams } from "next/navigation";

export default function Page() {
 const { id } = useParams();

 return (
  <CaseDetailProvider caseId={id as string}>
   <div className="min-h-screen">
    <div className="grid grid-cols-12 gap-16">
     <aside className="col-span-12 lg:col-span-2">
      <OverviewSidebar />
     </aside>

     <main className="col-span-12 lg:col-span-10">
      <Suspense>
       <SummaryBlock />
       <AiContainer />
       <SalesReport className="mt-32" />
       <EvaluationDetails />
       <CCRISContainer />
       <MediaContainer />
      </Suspense>
     </main>
    </div>
   </div>
  </CaseDetailProvider>
 );
}
