import * as React from "react";
import { Phone, Video, XCircle, Check } from "lucide-react";
import firstReviewIcon from "@/assets/icons/firstReview.svg"
import camReview from "@/assets/icons/finalReview.svg"
import approvedIcon from "@/assets/icons/approvedIcon.svg"
import offeredIcon from "@/assets/icons/icon-offered.svg"
import { Stage } from "@/types/case"
import Image from "next/image";

const stageStyle: Record<Stage, { label: string; className: string; icon?: React.ReactNode }> = {
 phone: { label: "Phone", className: "text-blue-700 bg-blue-50 font-medium", icon: <Phone className="mr-2 h-12 w-12" /> },
 video: { label: "Video", className: "text-pink-700 bg-pink-50 font-medium", icon: <Video className="mr-2 h-12 w-12" /> },
 "1st_review": { label: "1st Review", className: "text-warning-700 bg-warning-50 font-medium", icon: <Image src={firstReviewIcon} alt="first review" className="mr-2" width={12} height={12} /> },
 "cam_review": { label: "Cam Review", className: "text-purple-700 bg-purple-50 font-medium", icon: <Image src={camReview} alt="final review" className="mr-2" width={12} height={12} /> },
 offer: { label: "Offered", className: "text-orange-700 bg-orange-50 font-medium", icon: <Image src={offeredIcon} alt="final review" className="mr-2" width={12} height={12} /> },
 completed: { label: "Completed", className: "text-success-700 font-medium", icon: <Image src={approvedIcon} alt="approved" className="mr-2" width={12} height={12} /> },
 rejected: { label: "Rejected", className: "text-error-700 bg-error-50 font-medium", icon: <XCircle className="mr-2 h-12 w-12" /> },
 cancelled: { label: "Cancelled", className: "text-error-700 bg-error-50 font-medium", icon: <XCircle className="mr-2 h-12 w-12" /> },
};

export const StageBadge = ({ stage }: { stage: Stage }) => {
 const meta = stageStyle[stage];
 const base =
  stage === "completed" ? "bg-success-50" : stage === "rejected" ? "bg-error-50" : "bg-gray-50";
 return (
  <div className={`inline-flex items-center rounded-[6px] px-2 py-1 text-14 font-medium ${base} ${meta?.className}`}>
   {meta?.icon}
   {meta?.label}
  </div>
 );
};  