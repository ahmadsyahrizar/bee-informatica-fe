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
import useCaseDetail from "@/hooks/useCaseDetail";
import { useParams } from "next/navigation";
import { CaseDetailInitResponse } from "@/types/api/case-detail.type";
import { OverviewResponse } from "@/types/api/overview.type";
import getDiffYear from "@/lib/utils/getDiffYear";
import getAge from "@/lib/utils/getAge";

export function SummaryBlock() {
 const { id } = useParams()
 const { data: dataInit } = useCaseDetail<CaseDetailInitResponse>({ type: "initial", caseId: id as string });
 const { data: dataOverview } = useCaseDetail<OverviewResponse>({ type: "overview", caseId: id as string });
 const initDataDetail = dataInit?.data?.data;
 const overviewDataDetail = dataOverview?.data?.data;
 const businessOverview = overviewDataDetail?.business_overview;
 const overview = overviewDataDetail?.overview;

 const [openAddressModal, setOpenAddressModal] = useState(false);
 const handleModalAddress = () => setOpenAddressModal(true);

 return (
  <>
   <DetailHeader caseId={initDataDetail?.application_code || "CS-0000"} />
   <section className="grid grid-cols-12 gap-16 mt-[24px] scroll-mt-28 lg:scroll-mt-32" id="overview">
    <div className="col-span-12 xl:col-span-12">
     <div className="flex items-start justify-between gap-16">
      <div className="min-w-0">
       <Badge variant="default" className="h-[24px] rounded-sm text-gray-600 font-medium text-14">
        {initDataDetail?.application_code}
       </Badge>

       <div className="text-20 font-semibold text-gray-900 mb-[8px]">
        {initDataDetail?.applicant_name} <span>({getAge(overview?.applicant_dob || "")})</span>
       </div>
       <div className="flex gap-8">
        <div className="w-[100px] h-[100px] aspect-square">
         <Image alt="selfie" width={100} height={100} className="rounded-md" src={overview?.applicant_photo_url || ""} />
        </div>
        <div className="w-[150px] h-[100px] aspect-auto">
         <Image alt="ktp" width={150} height={100} className="rounded-md" src={overview?.applicant_identity_photo_url || ""} />
        </div>
       </div>
      </div>
      <TotalScore
       preScreening={overview?.pre_screen_score}
       cashflowScore={overview?.cashflow_score}
       qualitativeScore={overview?.qualitative_score}

      />
     </div>

     <div className="mt-32">
      <ContactInfoCard defaultPhone={overview?.phone_number} defaultEmail={overview?.email} />
     </div>

     <LoanAmountsRow
      applied={initDataDetail?.applied_loan_amount}
     // approved={approvedLoanAmount /* e.g. from API */}

     />

     <div className="mt-[32px]">
      <div className="mb-[12px] text-18 font-semibold text-gray-900">Business Overview</div>
      <div className="grid grid-cols-12 gap-12">
       <div className="col-span-12 md:col-span-6 xl:col-span-4">
        <KV label="Business Name" value={businessOverview?.name} />
       </div>

       <div className="col-span-12 md:col-span-6 xl:col-span-4">
        <KV
         label="Address"
         value={<span>{businessOverview?.address}</span>}
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
        <KV label="NOB" value={businessOverview?.nob} />
       </div>

       <div className="col-span-12 md:col-span-6 xl:col-span-4">
        <KV label="Start Up Capital" value={businessOverview?.capital} />
       </div>

       <div className="col-span-12 md:col-span-6 xl:col-span-4">
        <KV label="Year of Operation" value={`Since ${businessOverview?.year_of_establishment} (${getDiffYear(businessOverview?.year_of_establishment || 0)} years)`} />
       </div>

       <div className="col-span-12 md:col-span-6 xl:col-span-4">
        <KV
         label="Owner Work Experience"
         value={<span>{businessOverview?.owner_work_experience}</span>}
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
