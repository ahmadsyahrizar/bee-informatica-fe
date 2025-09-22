"use client";
import { DetailHeader } from "./DetailHeader";
import { ChevronRight } from "lucide-react";
import KV from "./KV";
import { useState } from "react";
import CreditScoreDrawer from "./drawerDetail";

export function SummaryBlock() {
 const [openDrawer, setDrawer] = useState(false)

 const handleDrawer = () => setDrawer(prev => !prev)

 return (
  <>
   <DetailHeader caseId={"CS-1234"} />
   <section className="grid grid-cols-12 gap-16 mt-[24px]">
    <div className="col-span-12 xl:col-span-12">
     <div className="flex items-start justify-between gap-16">
      <div className="min-w-0">
       <div className="text-20 font-semibold text-gray-900 mb-[8px]">Muhammad Syaari Zainudin <span >(33)</span></div>
       <div className="flex gap-8">
        <div className="h-[84px] w-[140px] rounded-lg bg-gray-200" />
        <div className="h-[84px] w-[140px] rounded-lg bg-gray-200" />
       </div>
      </div>

      {/* total score */}
      <div className="w-[203px] col-span-12 xl:col-span-4">
       <div className="border-0 rounded-[8px] bg-gray-50 p-12">
        <div className="flex flex-row justify-between items-center">
         <div className="text-14 text-gray-600">Total Score</div>
         <ChevronRight onClick={handleDrawer} className="size-16" />
        </div>
        {/* TODO NEXT: PRESENTATION TOTAL SCORE PROGRESS BAR HALF CIRCLE */}
        <div className="mt-10 flex items-center gap-8">
         <div className="text-12 text-gray-500">A) Pre-Screening <br /> B) Cashflow <br /> C) Qualitative</div>
        </div>
       </div>
      </div>
     </div>

     <div className="mt-[32px]">
      <div className="mb-[12px] text-18 font-semibold text-gray-900">Business Overview</div>
      <div className="grid grid-cols-12 gap-12">
       <div className="col-span-12 md:col-span-6 xl:col-span-4"><KV label="Business Name" value="Iffat Resources Sdn. Bhd." /></div>
       <div className="col-span-12 md:col-span-6 xl:col-span-4"><KV label="Address" value={<span>Jalan Dagang B/3A, Ampang, Selangor 68000</span>} footer={<span>Address Verification</span>} /></div>
       <div className="col-span-12 md:col-span-6 xl:col-span-4"><KV label="NOB" value="Restaurants, Cafeterias/Canteens" /></div>
       <div className="col-span-12 md:col-span-6 xl:col-span-4"><KV label="Start Up Capital" value="20K" /></div>
       <div className="col-span-12 md:col-span-6 xl:col-span-4"><KV label="Year of Operation" value="Since 2020 (5 years)" /></div>
       <div className="col-span-12 md:col-span-6 xl:col-span-4"><KV label="Owner Work Experience" value={<span>Head chef for 8 years at a Michelin-starred restaurant in Singapore.</span>} /></div>
      </div>
     </div>
    </div>


   </section>

   <CreditScoreDrawer onOpenChange={handleDrawer} open={openDrawer} />
  </>
 );
}   