import * as React from "react";
import { Button } from "@/components/ui/button";
import iconGmeet from "../../../public/icons/video-recorder.svg"
import iconPhone from "../../../public/icons/startCallIcon.svg"
import iconSearchDoc from "../../../public/icons/searchDocIcon.svg"
import Image from "next/image";

export const ActionButton: React.FC<{
 intent: "start-call" | "join-meet" | "check-score" | "check-application" | "view-decision";
 onClick?: () => void;
}> = ({ intent, onClick }) => {
 const map: Record<string, { label: string; icon: React.ReactNode; borderColor: string, textColor: string, variant: "outline" | "default" }> = {
  "start-call": { label: "Start Call", borderColor: "border-brand-500", textColor: "text-brand-500", icon: <Image src={iconPhone} alt="icon" width={"20"} height={"20"} className="text-brand-500 stroke-brand-500" />, variant: "outline" },
  "join-meet": { label: "Join Meet", borderColor: "border-brand-500", textColor: "text-brand-500", icon: <Image src={iconGmeet} width={20} height={20} alt="video" className="h-20 w-20 stroke-brand-500 border-brand-500" />, variant: "outline" },
  "check-score": { label: "Check Score", borderColor: "border-brand-500", textColor: "text-brand-500", icon: <Image src={iconSearchDoc} alt="check-score" className="h-20 w-20" />, variant: "outline" },
  "check-application": { label: "Check Application", borderColor: "border-brand-500", textColor: "text-brand-500", icon: "", variant: "outline" },
  "view-decision": { label: "View Decision Details", borderColor: "border-gray-300", textColor: "text-gray-700", icon: "", variant: "outline" },
 };
 const { label, icon, variant, borderColor, textColor } = map[intent];
 return (
  <Button variant={variant} onClick={onClick} className={`h-[36px] my-[12px] mx-[18px] ${borderColor}  rounded-[8px] text-14 font-semibold w-[175px]`}>
   {icon}
   <span className={textColor}>{label}</span>
  </Button>
 );
};   