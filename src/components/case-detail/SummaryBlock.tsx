"use client";
import { DetailHeader } from "./DetailHeader";
import KV from "./KV";
import { useState } from "react";
import ContactInfoCard from "./Contact";
import Image from "next/image";
import { Badge } from "../ui/badge";
import AddressVerificationModal from "./AddressVerifModal";
import TotalScore from "./TotalScore";
import { LoanAmountsRow } from "./Loan";

export function SummaryBlock() {

 const [openAddressModal, setOpenAddressModal] = useState(false);
 const handleModalAddress = () => setOpenAddressModal(true);

 return (
  <>
   <DetailHeader
    caseId="CS-1234"
   // onUpload={async (file) => { }}
   />
   <section className="grid grid-cols-12 gap-16 mt-[24px] scroll-mt-28 lg:scroll-mt-32" id="overview">
    <div className="col-span-12 xl:col-span-12">
     <div className="flex items-start justify-between gap-16">
      <div className="min-w-0">
       <Badge variant="default" className="h-[24px] rounded-sm text-gray-600 font-medium text-14">
        CS-1234
       </Badge>

       <div className="text-20 font-semibold text-gray-900 mb-[8px]">
        Muhammad Syaari Zainudin <span>(33)</span>
       </div>
       <div className="flex gap-8">
        <div className="w-[100px] h-[100px] aspect-square">
         <Image alt="selfie" width={100} height={100} className="rounded-md" src={"https://placehold.co/100x100.png"} />
        </div>
        <div className="w-[150px] h-[100px] aspect-auto">
         <Image alt="ktp" width={150} height={100} className="rounded-md" src={"https://placehold.co/150x100.png"} />
        </div>
       </div>
      </div>
      <TotalScore />
     </div>

     <div className="mt-32">
      <ContactInfoCard />
     </div>

     <LoanAmountsRow
      applied={1_000_000}
      // approved={approvedLoanAmount /* e.g. from API */}
      onSaveApproved={async (next) => {
       // await api.updateApprovedAmount(caseId, next);
       // then update your local state / SWR cache if needed
      }}
     />

     <div className="mt-[32px]">
      <div className="mb-[12px] text-18 font-semibold text-gray-900">Business Overview</div>
      <div className="grid grid-cols-12 gap-12">
       <div className="col-span-12 md:col-span-6 xl:col-span-4">
        <KV label="Business Name" value="Iffat Resources Sdn. Bhd." />
       </div>

       <div className="col-span-12 md:col-span-6 xl:col-span-4">
        <KV
         label="Address"
         value={<span>Jalan Dagang B/3A, Ampang, Selangor 68000</span>}
         footer={
          <button
           type="button"
           onClick={handleModalAddress}
           className="text-brand-600 hover:underline font-medium underline"
          >
           Verify Address
          </button>
         }
        />
       </div>

       <div className="col-span-12 md:col-span-6 xl:col-span-4">
        <KV label="NOB" value="Restaurants, Cafeterias/Canteens" />
       </div>

       <div className="col-span-12 md:col-span-6 xl:col-span-4">
        <KV label="Start Up Capital" value="20K" />
       </div>

       <div className="col-span-12 md:col-span-6 xl:col-span-4">
        <KV label="Year of Operation" value="Since 2020 (5 years)" />
       </div>

       <div className="col-span-12 md:col-span-6 xl:col-span-4">
        <KV
         label="Owner Work Experience"
         value={<span>Head chef for 8 years at a Michelin-starred restaurant in Singapore.</span>}
        />
       </div>
      </div>
     </div>
    </div>
   </section>

   {/* Address Verification Modal */}
   <AddressVerificationModal
    open={openAddressModal}
    onOpenChange={setOpenAddressModal}
   />
  </>
 );
}
