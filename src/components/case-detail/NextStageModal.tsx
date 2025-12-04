"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Stage } from "@/types/case";

export default function NextStageModal({
 open,
 onClose,
 onConfirm,
 stage,
}: {
 open: boolean;
 onClose: () => void;
 onConfirm: () => void;
 stage: Stage;
}) {
 if (!open) return null;

 const remappedstageToNext: Record<"phone" | "video" | "1st_review", string> = {
  phone: "Video",
  video: "1st Review",
  "1st_review": "CAM",
 }

 return (
  <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/30">
   <div className="w-[600px] rounded-2xl bg-white p-6 shadow-xl border-0 relative">
    <div className="flex flex-col items-start gap-4 p-[24px]">
     {/* left circular icon */}
     <div className="flex-shrink-0">
      <div className="h-[72px] w-[72px] rounded-full bg-[#E9FBF0] flex items-center justify-center">
       <div className="h-[44px] w-[44px] rounded-full bg-[#E9FBF0] flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M7 7L12 12L7 17" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
         <path d="M12 7L17 12L12 17" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
       </div>
      </div>
     </div>

     {/* content */}
     <div className="flex-1">
      <h3 className="text-2xl font-semibold text-gray-900">
       Proceed to {remappedstageToNext[stage as keyof typeof remappedstageToNext]} Stage ?
      </h3>

      <p className="mt-3 text-gray-600 text-base leading-7">
       Once you proceed, you cannot return to this stage. You will still be able to view the application details,
       but no further changes can be made. This action cannot be undone.
      </p>

      <div className="mt-9 pt-6 flex gap-3">
       <Button variant="outline" className="flex-1 px-6 py-3 border-gray-300" onClick={onClose}>
        Cancel
       </Button>

       <Button
        onClick={() => onConfirm()}
        className="flex-1 px-6 py-3 bg-[#F05A2B] !text-white shadow-md hover:brightness-95"
       >
        Yes, Proceed to Next Stage
       </Button>
      </div>
     </div>

     {/* close x in top-right */}
     <button aria-label="Close" className="absolute right-20 top-20 text-gray-500" onClick={onClose}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
       <path d="M18 6L6 18" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
       <path d="M6 6L18 18" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
     </button>
    </div>
   </div>
  </div>
 );
}
