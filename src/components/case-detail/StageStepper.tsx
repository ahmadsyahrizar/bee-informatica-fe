"use client";

import * as React from "react";
import { Phone, Video, FileSearch, CheckSquare, ChevronRight } from "lucide-react";
import VideoCallLogDrawer from "./drawerLog";
import PhoneLogDrawer from "./drawerPhonelog";

type Stage = { id: string; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>>, hasLog: boolean };

const stages: Stage[] = [
  { id: "phone", label: "Phone", icon: Phone, hasLog: true },
  { id: "meet", label: "Meet", icon: Video, hasLog: true },
  { id: "review1", label: "1st Review", icon: FileSearch, hasLog: false },
  { id: "final", label: "Final Review", icon: CheckSquare, hasLog: false },
];

export function StageStepper({ current, className = "" }: { current: string; className?: string }) {
  const cols = "grid grid-cols-[repeat(7,minmax(0,1fr))]";
  const [openDrawer, setDrawer] = React.useState(false)
  const [openPhoneDrawer, setPhoneDrawer] = React.useState(false)

  const top: React.ReactNode[] = [];
  const bottom: React.ReactNode[] = [];

  const handleLog = (param?: string) => {
    if (param === 'phone') {
      setPhoneDrawer(prev => !prev);
      return;
    }
    if (param === 'meet') {
      setDrawer(prev => !prev);
      return;
    }

    setDrawer(false)
    setPhoneDrawer(false)
    return;
  }

  stages.forEach((s, i) => {
    const Icon = s.icon;
    const active = current === s.id;
    const hasLog = s.hasLog

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
          "flex justify-center items-center text-center text-14 whitespace-nowrap",
          active ? "text-blue-600 font-medium" : "text-gray-500 font-medium",
        ].join(" ")}
      >
        {s.label} {hasLog && (
          <div onClick={() => handleLog(s.id)} className="ml-2 flex flex-row justify-center items-center bg-gray-100 rounded-sm px-1 text-12 text-gray-600">
            <div>Log</div>
            <ChevronRight className="size-3" />
          </div>)}
      </div>
    );
    if (i < stages.length - 1) bottom.push(<div key={`sp-${s.id}`} />);
  });

  return (
    <>
      <div className={["w-full max-w-[584px] mx-auto", className].join(" ")}>
        <div className={`${cols} items-center`}>{top}</div>
        <div className={`mt-4 ${cols}`}>{bottom}</div>
      </div>

      <VideoCallLogDrawer onOpenChange={handleLog} open={openDrawer} />
      <PhoneLogDrawer onOpenChange={handleLog} open={openPhoneDrawer} />
    </>
  );
}       