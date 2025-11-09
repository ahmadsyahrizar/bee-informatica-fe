"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";

function formatRM(n?: number | null) {
 if (typeof n !== "number" || Number.isNaN(n)) return "";
 return `${n.toLocaleString("en-MY")} RM`;
}

function CardShell({
 label,
 children,
 className = "",
}: {
 label: string;
 children: React.ReactNode;
 className?: string;
}) {
 return (
  <div
   className={[
    "rounded-[10px] bg-gray-50 px-4 py-3 border",
    className,
   ].join(" ")}
  >
   <div className="text-[12px] text-gray-500 mb-1 pl-16">{label}</div>
   {children}
  </div>
 );
}

/** Read-only applied amount card */
export function AppliedAmountCard({ amount }: { amount?: number | null }) {
 return (
  <CardShell label="Applied Loan Amount p-16">
   <div className="text-[20px] font-semibold text-gray-900 pl-16">
    {amount != null ? formatRM(amount) : "-"}
   </div>
  </CardShell>
 );
}

export function ApprovedAmountCard({
 amount,
 className = "",
}: {
 amount?: number | null;
 onSaveApproved?: (nextAmount: number) => Promise<void> | void;
 className?: string;
}) {
 const params = useSearchParams();
 const isFinalStage = (params.get("stage") ?? "").toLowerCase() === "final";

 return (
  <CardShell
   label="Approved Loan Amount"
   className={[
    className,
    !amount ? "border-brand-500" : "border-gray-200",
   ].join(" ")}
  >
   {/* Read or edit */}
   <button
    type="button"
    className="w-full text-left"
    disabled={!isFinalStage}
   >
    {!amount ? (
     <div
      className={[
       "text-[20px] font-semibold pl-16",
       !amount ? "text-brand-500" : "text-gray-400",
      ].join(" ")}
     >
      -
     </div>
    ) : (
     <div className="text-[20px] font-semibold text-gray-900 pl-16">
      {formatRM(amount)}
     </div>
    )}
   </button>
  </CardShell>
 );
}

/** Optional: a small wrapper to show both cards side-by-side */
export function LoanAmountsRow({
 applied,
 approved,
 onSaveApproved,
}: {
 applied?: number | null;
 approved?: number | null;
 onSaveApproved?: (nextAmount: number) => Promise<void> | void;
}) {

 return (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mt-32">
   <AppliedAmountCard amount={applied} />
   <ApprovedAmountCard className={approved ? 'bg-success-50 border-[#079455] text-gray-900' : 'border-[#DC6803] bg-warning-50 text-gray-900'} amount={approved} onSaveApproved={onSaveApproved} />
  </div>
 );
}
