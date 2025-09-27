"use client";

import * as React from "react";
import { Check, X, FileText, Clock } from "lucide-react";
import iconApprove from "../../../public/icons/icon-app-approved.svg"
import iconReject from "../../../public/icons/icon-app-reject.svg"
import Image from "next/image";

export type DecisionStatus = "approved" | "rejected";

export function DecisionStatusCard({
 status,
 reason,
 onAction,
 actionIcon,
 className = "",
}: {
 status: DecisionStatus;
 reason: string;
 onAction?: () => void;
 actionIcon?: React.ReactNode;
 className?: string;
}) {
 const isApproved = status === "approved";

 const tone = isApproved
  ? {
   title: "Application Approved",
   titleColor: "text-emerald-700",
   bg: "bg-emerald-50",
   border: "border-emerald-200",
   chipBorder: "border-emerald-200",
   badgeBg: "bg-emerald-50",
   badgeBorder: "border-emerald-300",
   icon: <Check className="h-20 w-20 text-emerald-600" />,
  }
  : {
   title: "Application Rejected",
   titleColor: "text-red-600",
   bg: "bg-red-50",
   border: "border-red-200",
   chipBorder: "border-red-200",
   badgeBg: "bg-red-50",
   badgeBorder: "border-red-300",
   icon: <X className="h-20 w-20 text-red-600" />,
  };

 return (
  <div
   className={[
    "relative rounded-md border p-12",
    tone.bg,
    tone.border,
    className,
   ].join(" ")}
  >
   {/* status badge (top-right) */}
   {isApproved ? <Image className="absolute right-0 top-0" src={iconApprove} width={40} height={40} alt="approve" /> : <Image className="absolute right-0 top-0" src={iconReject} width={40} height={40} alt="approve" />}

   {/* title */}
   <div className={["text-[16px] font-semibold", tone.titleColor].join(" ")}>
    {tone.title}
   </div>

   {/* reason chip + action */}
   <div className="mt-2 flex items-center gap-2">
    <div
     className={[
      "flex w-[250px] min-w-0 flex-1 items-center gap-2 rounded-md border bg-white px-[10px] py-[8px] border-gray-200",
      "text-gray-600",
     ].join(" ")}
    >
     <FileText className="size-18 text-gray-500 shrink-0" />
     <span className="truncate">{reason}</span>
    </div>

    <button
     type="button"
     onClick={onAction}
     disabled={!onAction}
     className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white disabled:opacity-50"
     title="Action"
    >
     {actionIcon ?? <Clock className="size-18 text-gray-700" />}
    </button>
   </div>
  </div>
 );
}
