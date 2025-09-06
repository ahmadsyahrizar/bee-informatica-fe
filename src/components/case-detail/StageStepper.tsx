"use client";

import * as React from "react";
import { Phone, Video, FileSearch, CheckSquare } from "lucide-react";

type Stage = { id: string; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> };

const stages: Stage[] = [
 { id: "phone", label: "Phone", icon: Phone },
 { id: "meet", label: "Meet", icon: Video },
 { id: "review1", label: "1st Review", icon: FileSearch },
 { id: "final", label: "Final Review", icon: CheckSquare },
];

export function StageStepper({ current, className = "" }: { current: string; className?: string }) {
 const cols = "grid grid-cols-[repeat(7,minmax(0,1fr))]"; // circle,line,circle,line,...

 const top: React.ReactNode[] = [];
 const bottom: React.ReactNode[] = [];

 stages.forEach((s, i) => {
  const Icon = s.icon;
  const active = current === s.id;

  top.push(
   <div key={`c-${s.id}`} className="flex items-center justify-center">
    <div
     className={[
      "grid h-[28px] w-[28px] place-items-center rounded-full border",
      active
       ? "border-blue-200 bg-blue-50 text-blue-500"
       : "border-gray-200 bg-gray-50 text-gray-400",
     ].join(" ")}
    >
     <Icon className="h-[14px] w-[14px] text-gray-500" />
    </div>
   </div>
  );
  if (i < stages.length - 1) {
   top.push(<div key={`l-${s.id}`} className="h-[1px] w-full bg-gray-200" />);
  }

  bottom.push(
   <div
    key={`t-${s.id}`}
    className={[
     "text-center text-14 whitespace-nowrap",
     active ? "text-blue-600 font-medium" : "text-gray-500 font-medium",
    ].join(" ")}
   >
    {s.label}
   </div>
  );
  if (i < stages.length - 1) bottom.push(<div key={`sp-${s.id}`} />);
 });

 return (
  <div className={["w-full max-w-[584px] mx-auto", className].join(" ")}>
   <div className={`${cols} items-center`}>{top}</div>
   <div className={`mt-4 ${cols}`}>{bottom}</div>
  </div>
 );
}
