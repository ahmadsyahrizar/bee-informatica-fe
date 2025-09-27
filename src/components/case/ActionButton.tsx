import * as React from "react";
import { Button } from "@/components/ui/button";
import iconGmeet from "../../../public/icons/video-recorder.svg"
import iconSearchDoc from "../../../public/icons/searchDocIcon.svg"
import iconUpload from "../../../public/icons/iconUpload.svg"
import iconNext from "../../../public/icons/icon-next.svg"
import Image from "next/image";
import { CheckCircle, XCircle } from "lucide-react";

export const ActionButton: React.FC<{
 intent: "submit" | "start-call" | "join-meet" | "check-score" | "check-application" | "view-decision" | "next-stage" | "reject" | "approve";
 onClick?: () => void;
 className?: string;
 disabled?: false;
 type?: string;
}> = ({ intent, onClick, className, disabled, type }) => {
 const isConfirmationStatus = type === 'confirmation'
 const labelUpload = isConfirmationStatus ? "Re-upload Transcription" : "Upload Transcription"

 const map: Record<string, { label: string; icon: React.ReactNode; borderColor: string, textColor: string, variant: "outline" | "default" }> = {
  "start-call": { label: labelUpload, borderColor: "border-brand-500", textColor: "text-brand-500", icon: <Image src={iconUpload} alt="icon" width={"20"} height={"20"} className="text-brand-500 stroke-brand-500 p-1" />, variant: "outline" },
  "join-meet": { label: "Join Meet", borderColor: "border-brand-500", textColor: "text-brand-500", icon: <Image src={iconGmeet} width={20} height={20} alt="video" className="h-20 w-20 stroke-brand-500 border-brand-500" />, variant: "outline" },
  "check-score": { label: "Review Scoring", borderColor: "border-brand-500", textColor: "text-brand-500", icon: <Image src={iconSearchDoc} alt="check-score" className="h-20 w-20" />, variant: "outline" },
  "check-application": { label: "Check Application", borderColor: "border-brand-500", textColor: "text-brand-500", icon: "", variant: "outline" },
  "view-decision": { label: "View Decision Details", borderColor: "border-gray-300", textColor: "text-gray-700", icon: "", variant: "outline" },
  "next-stage": { label: "Next Stage", borderColor: "border-gray-300", textColor: "text-gray-700", icon: <Image src={iconNext} alt="check-score" className="h-20 w-20" />, variant: "outline" },
  "submit": { label: "Submit", borderColor: "border-brand-500", textColor: "text-brand-500", icon: '', variant: "outline" },
  "approve": { label: "Approve", borderColor: "border-[#17B26A]", textColor: "text-[#17B26A]", icon: <CheckCircle className="size-20 text-[#17B26A]" />, variant: "outline" },
  "reject": { label: "Reject", borderColor: "border-gray-300", textColor: "text-gray-700", icon: <XCircle className="size-20" />, variant: "outline" },

 };

 const { label, icon, variant, borderColor, textColor } = map[intent];

 return (
  <Button disabled={disabled} variant={variant} onClick={onClick} className={`flex items-center h-[36px] my-[12px] mx-[18px] ${borderColor}  rounded-[8px] text-14 font-semibold ${className}`}>
   {icon}
   <span className={textColor}>{label}</span>
  </Button>
 );
};   