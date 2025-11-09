import React from "react";
import iconHistory from "@/assets/icons/icon-history.svg"
import Image from "next/image";

export default function CompletedStatus({ onOpenHistory }: { onOpenHistory: () => void }) {
 return (
  <div className="w-full">
   {/* CompletedStatus (your previously added component or inline markup) */}
   <div className="flex items-center justify-between border rounded-lg p-4 bg-white">
    <div className="flex items-center gap-3">
     {/* green pill */}
     <div className="flex items-center gap-2 rounded-md border border-green-100 bg-green-50 px-3 py-2">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-green-600">
       <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-sm font-medium text-green-700">Completed</span>
     </div>
    </div>

    {/* history button */}
    <div>
     <button onClick={onOpenHistory} className="rounded-md border border-gray-200 p-3 bg-white">
      {/* replace with your icon */}
      <Image src={iconHistory} alt="history" width={20} height={20} />
     </button>
    </div>
   </div>
  </div>
 );
}  