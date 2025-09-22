'use client';

import { Suspense } from "react";
import { OverviewSidebar } from "@/components/case-detail/OverviewSidebar";
import { SummaryBlock } from "@/components/case-detail/SummaryBlock";
import { AIHighlight } from "@/components/case-detail/AiHighlight";
import { FinancialSummary } from "@/components/case-detail/FinancialSummary";
// import { FooterNav } from "@/components/case-detail/FooterNav";
import SalesReport from "@/components/case-detail/SalesReport";
import EvaluationDetails from "@/components/case-detail/EvaluationDetail";
import { CCRISContainer } from "@/components/case-detail/CCRISContainer";
import { SocialMedia } from "@/components/case-detail/SocialMedia";
import { PhotosSection, PhotoItem } from "@/components/case-detail/media/photoSection";
import { OtherDocumentsSection, DocumentItem } from "@/components/case-detail/media/otherDocuments";

const fbPosts = [
 {
  id: 1,
  platform: "facebook",
  username: "@emon_kitchen",
  date: "August 24, 2025",
  text: "Feeling the heat and loving every bite 🔥🍜 Spicy noodles to warm your soul. Can you handle it?",
  imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1600&auto=format&fit=crop",
  likes: 24,
  comments: 2,
  postUrl: "https://facebook.com/",
 },
 {
  id: 2,
  platform: "facebook",
  username: "@emon_kitchen",
  date: "August 24, 2025",
  text: "Chicken that packs a punch! 🍗 Bring on the heat and flavor. Who’s ready for this spicy kick?",
  imageUrl: "https://images.unsplash.com/photo-1604908177071-731dc987a1f6?q=80&w=1600&auto=format&fit=crop",
  likes: 24,
  comments: 2,
  postUrl: "https://facebook.com/",
 },
];

const igPosts = [
 {
  id: 3,
  platform: "instagram",
  username: "@emon_kitchen",
  date: "August 24, 2025",
  text: "Feeling the heat and loving every bite 🔥🍜 Spicy noodles to warm your soul. Can you handle it?",
  imageUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=1600&auto=format&fit=crop",
  likes: 24,
  comments: 2,
  postUrl: "https://instagram.com/",
 },
 {
  id: 4,
  platform: "instagram",
  username: "@emon_kitchen",
  date: "August 24, 2025",
  text: "Chicken that packs a punch! 🍗 Bring on the heat and flavor. Who’s ready for this spicy kick?",
  imageUrl: "https://images.unsplash.com/photo-1604908177071-731dc987a1f6?q=80&w=1600&auto=format&fit=crop",
  likes: 24,
  comments: 2,
  postUrl: "https://instagram.com/",
 },
];



const photos: PhotoItem[] = [
 { id: 1, url: "https://images.unsplash.com/photo-1528605105345-5344ea20e269?q=80&w=1600&auto=format&fit=crop" },
 { id: 2, url: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop" },
 { id: 3, url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop" },
 { id: 4, url: "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?q=80&w=1600&auto=format&fit=crop" },
 { id: 5, url: "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?q=80&w=1600&auto=format&fit=crop" },
];

const documents: DocumentItem[] = [
 {
  id: "biz-license",
  label: "Business License",
  url: "https://images.unsplash.com/photo-1606326608606-aa0b62935f13?q=80&w=1600&auto=format&fit=crop",
  thumbUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f13?q=80&w=1200&auto=format&fit=crop",
 },
 {
  id: "utility-bill",
  label: "Utility Bills",
  url: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=1600&auto=format&fit=crop",
  thumbUrl: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=1200&auto=format&fit=crop",
 },
];



export default function Page({ params }: { params: { id: string } }) {
 // Fetch your case data here (RSC)
 // const data = await fetchCase(params.id)

 const sampleRows = [
  {
   no: 1,
   date: "03/02/2016",
   facility: "Purchase of passenger cars",
   balance: 673.0,
   limit: 46000.0,
   months: { Jul: 0, Jun: 0, May: 0, Apr: 0, Mar: 0, Feb: 0, Jan: 0, Dec: 0 },
  },
  {
   no: 2,
   date: "03/02/2016",
   facility: "Purchase of passenger cars",
   balance: 673.0,
   limit: 46000.0,
   months: { Jul: 0, Jun: 0, May: 0, Apr: 0, Mar: 0, Feb: 0, Jan: 0, Dec: 0 },
  },
  {
   no: 3,
   date: "03/02/2016",
   facility: "Purchase of passenger cars",
   balance: 673.0,
   limit: 46000.0,
   months: { Jul: 0, Jun: 0, May: 0, Apr: 0, Mar: 0, Feb: 0, Jan: 0, Dec: 0 },
  },
 ];

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
       stats={[
        { label: "Sales monthly", value: "RM130 – 150K" },
        { label: "Profit", value: "RM5K" },
        { label: "Expenses monthly", value: "RM30K" },
        { label: "Rent monthly", value: "RM7,9K" },
        { label: "Salary staff monthly", value: "10K" },
        { label: "Salary model", value: "Daily pay" },
        { label: "Salary per day", value: "RM60 – 70/ Day" },
       ]}
      />

      <EvaluationDetails
       sections={[
        {
         id: 1,
         title: "Financial Health",
         criteria: [
          {
           label: "Profitability (Net income over past 6 months)",
           value: "-",
          },
          {
           label: "Cash flow stability",
           hint: "Consistency of inflows/outflows",
           value: "-",
          },
          { label: "Working Capital", value: "-", hint: "Testing" },
          { label: "Credit History", value: "-" },
          { label: "Others", value: "-" },
         ],
        },
        {
         id: 2,
         title: "Business & Sales",
         criteria: [
          { label: "Revenue Streams", value: "-" },
          { label: "Customer Base", value: "-" },
          {
           label: "Market Trends and Growth potential in industry.",
           value: "-",
          },
          {
           label: "Competitor’s positioning & market share",
           value: "-",
          },
          { label: "Others", value: "-" },
         ],
        },
       ]}
      />

      {/* ⬇️ Inserted Tabs above CCRIS table */}
      <CCRISContainer
       individualRows={sampleRows}
       companyRows={sampleRows}
      />

      {/* Social Media */}
      <SocialMedia
       className="mt-32"
       facebook={fbPosts}
       instagram={igPosts}
       facebookProfileUrl="https://facebook.com/emon_kitchen"
       instagramProfileUrl="https://instagram.com/emon_kitchen"
      />

      <PhotosSection
       className="mt-10"
       photos={photos}
       onUploadClick={() => console.log("open uploader")}
       onDeletePhoto={(p) => console.log("delete photo", p)}
      />

      <OtherDocumentsSection
       className="mt-10"
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
