'use client';

import { Suspense } from "react";
import { OverviewSidebar } from "@/components/case-detail/OverviewSidebar";
import { SummaryBlock } from "@/components/case-detail/SummaryBlock";
import { AIHighlight } from "@/components/case-detail/AiHighlight";
import { FinancialSummary } from "@/components/case-detail/FinancialSummary";
import { FooterNav } from "@/components/case-detail/FooterNav";

export default function Page({ params }: { params: { id: string } }) {
 // Fetch your case data here (RSC)
 // const data = await fetchCase(params.id)
 return (
  <div className="min-h-screen">
   <div className="grid grid-cols-12 gap-16">
    <aside className="col-span-12 lg:col-span-2">
     <OverviewSidebar />
    </aside>

    <main className="col-span-12 lg:col-span-10">
     <Suspense>
      <SummaryBlock />
      <AIHighlight />
      <FinancialSummary />
     </Suspense>

     <FooterNav />
    </main>
   </div>
   {/* </div> */}
  </div>
 );
}  