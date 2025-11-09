import React from "react";
import Image from "next/image";
import { Phone, Video, XCircle } from "lucide-react";
import firstReviewIcon from "@/assets/icons/firstReview.svg";
import camReview from "@/assets/icons/finalReview.svg";
import approvedIcon from "@/assets/icons/approvedIcon.svg";
import iconRejected from "@/assets/icons/icon-rejected.svg";
import offeredIcon from "@/assets/icons/icon-offered.svg";
import { Stage } from "@/types/case";

const iconCircleClass = (color: string) =>
 `flex items-center justify-center rounded-full h-[30px] w-[30px] ${color}`;

const stageStyle: Record<
 Stage,
 { label: string; className: string; icon: React.ReactNode }
> = {
 phone: {
  label: "Phone",
  className: "text-blue-700 font-medium",
  icon: (
   <div className={iconCircleClass("bg-blue-50")}>
    <Phone className="text-blue-700 h-[12px] w-[12px]" />
   </div>
  ),
 },
 video: {
  label: "Video",
  className: "text-pink-700 font-medium",
  icon: (
   <div className={iconCircleClass("bg-pink-50")}>
    <Video className="text-pink-700 h-12 w-12" />
   </div>
  ),
 },
 "1st_review": {
  label: "1st Review",
  className: "text-warning-700 font-medium",
  icon: (
   <div className={iconCircleClass("bg-warning-50")}>
    <Image src={firstReviewIcon} alt="first review" width={16} height={16} />
   </div>
  ),
 },
 cam_review: {
  label: "CAM Review",
  className: "text-purple-700 font-medium",
  icon: (
   <div className={iconCircleClass("bg-purple-50")}>
    <Image src={camReview} alt="cam review" width={16} height={16} />
   </div>
  ),
 },
 offer: {
  label: "Offered (Pending Acceptance)",
  className: "text-orange-700 font-medium",
  icon: (
   <div className={iconCircleClass("bg-orange-50")}>
    <Image src={offeredIcon} alt="offered" width={16} height={16} />
   </div>
  ),
 },
 completed: {
  label: "Completed",
  className: "text-success-700 font-medium",
  icon: (
   <div className={iconCircleClass("bg-success-50")}>
    <Image src={approvedIcon} alt="approved" width={16} height={16} />
   </div>
  ),
 },
 rejected: {
  label: "Rejected",
  className: "text-error-700 font-medium",
  icon: (
   <div className={iconCircleClass("bg-error-50")}>
    <Image src={iconRejected} alt="approved" width={16} height={16} />
   </div>
  ),
 },
 cancelled: {
  label: "Cancelled",
  className: "text-error-700 font-medium",
  icon: (
   <div className={iconCircleClass("bg-error-50")}>
    <Image src={iconRejected} alt="approved" width={16} height={16} />
   </div>
  ),
 },
};

type StageDisplayProps = {
 stage?: Stage;
};

export const StageDisplay = ({ stage }: StageDisplayProps) => {
 if (!stage) return null;
 const stageData = stageStyle[stage];
 if (!stageData) return null;

 return (
  <div className={`flex items-center gap-2 px-3 py-1 ${stageData.className}`}>
   {stageData.icon}
   <span>{stageData.label}</span>
  </div>
 );
};
