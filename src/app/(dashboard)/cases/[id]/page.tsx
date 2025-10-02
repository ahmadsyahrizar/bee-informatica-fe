'use client';

import { Suspense } from "react";
import { OverviewSidebar } from "@/components/case-detail/OverviewSidebar";
import { SummaryBlock } from "@/components/case-detail/SummaryBlock";
import { AIHighlight } from "@/components/case-detail/AiHighlight";
import { FinancialSummary } from "@/components/case-detail/FinancialSummary";
import SalesReport from "@/components/case-detail/SalesReport";
import EvaluationDetails from "@/components/case-detail/EvaluationDetail";
import { CCRISContainer } from "@/components/case-detail/CCRISContainer";
import { SocialMedia } from "@/components/case-detail/SocialMedia";
import { PhotosSection } from "@/components/case-detail/media/photoSection";
import { OtherDocumentsSection } from "@/components/case-detail/media/otherDocuments";
import { documents, dummyEvaluationDetail, dummySales, photos, sampleRows, fbPosts, igPosts } from "@/lib/api/cases";


export default function Page({ params }: { params: { id: string } }) {
 console.log({ params })
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

      <SalesReport
       className="mt-32"
       stats={dummySales}
      />

      <EvaluationDetails
       sections={dummyEvaluationDetail}
      />

      {/* ⬇️ Inserted Tabs above CCRIS table */}
      <CCRISContainer
       individualRows={sampleRows}
       companyRows={sampleRows}
      />

      {/* Social Media */}
      <SocialMedia
       // @ts-expect-error rija
       facebook={fbPosts}
       // @ts-expect-error rija
       instagram={igPosts}
       facebookProfileUrl="https://facebook.com/emon_kitchen"
       instagramProfileUrl="https://instagram.com/emon_kitchen"
      />

      <PhotosSection
       photos={photos}
       onUploadClick={() => console.log("open uploader")}
       onDeletePhoto={(p) => console.log("delete photo", p)}
      />

      <OtherDocumentsSection
       documents={documents}
       onDeleteDocument={(d) => console.log("delete doc", d)}
      />
      {/* <FooterNav /> */}
     </Suspense>
    </main>
   </div>
  </div>
 );
}
