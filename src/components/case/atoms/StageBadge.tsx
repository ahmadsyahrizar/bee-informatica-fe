import * as React from "react";
import { Phone, Video, XCircle, Check } from "lucide-react";
import firstReviewIcon from "../../../../public/icons/firstReview.svg"
import finalReview from "../../../../public/icons/finalReview.svg"
import { Stage } from "@/types/case"
import Image from "next/image";

const stageStyle: Record<Stage, { label: string; className: string; icon?: React.ReactNode }> = {
 Phone: { label: "Phone", className: "text-blue-700 bg-blue-50", icon: <Phone className="mr-2 h-12 w-12" /> },
 Meet: { label: "Meet", className: "text-pink-700 bg-pink-50", icon: <Video className="mr-2 h-12 w-12" /> },
 "1st Review": { label: "1st Review", className: "text-warning-700 bg-warning-50", icon: <Image src={firstReviewIcon} alt="first review" className="mr-2" width={12} height={12} /> },
 "Final Review": { label: "Final Review", className: "text-purple-700 bg-purple-50", icon: <Image src={finalReview} alt="final review" className="mr-2" width={12} height={12} /> },
 Approved: { label: "Approved", className: "text-success-700", icon: <Check className="mr-2 h-12 w-12" /> },
 Rejected: { label: "Rejected", className: "text-error-700", icon: <XCircle className="mr-2 h-12 w-12" /> },
};

export const StageBadge: React.FC<{ stage: Stage }> = ({ stage }) => {
 const meta = stageStyle[stage];
 const base =
  stage === "Approved" ? "bg-success-50" : stage === "Rejected" ? "bg-error-50" : "bg-gray-50";
 return (
  <div className={`inline-flex items-center rounded-[6px] px-2 py-1 text-14 font-medium ${base} ${meta.className}`}>
   {meta.icon}
   {meta.label}
  </div>
 );
};  