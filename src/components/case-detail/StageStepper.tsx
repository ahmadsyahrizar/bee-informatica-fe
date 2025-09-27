"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Phone, Video, FileSearch, CheckSquare, ChevronRight } from "lucide-react";
import VideoCallLogDrawer from "./drawerLog";
import PhoneLogDrawer from "./drawerPhonelog";

type Stage = {
  id: "phone" | "meet" | "review1" | "final";
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  hasLog: boolean;
};

const stages: Stage[] = [
  { id: "phone", label: "Phone", icon: Phone, hasLog: true },
  { id: "meet", label: "Meet", icon: Video, hasLog: true }, // URL `stage=video` maps here
  { id: "review1", label: "1st Review", icon: FileSearch, hasLog: false },
  { id: "final", label: "Final Review", icon: CheckSquare, hasLog: false },
];

export function StageStepper({
  current, // optional: if omitted we read from ?stage=
  className = "",
}: {
  current?: string;
  className?: string;
}) {
  const params = useSearchParams();
  const stageParam = (current ?? params.get("stage") ?? "phone").toLowerCase();
  console.log({ stageParam })

  const activeId: Stage["id"] =
    stageParam === "meet"
      ? "meet"
      : (["phone", "meet", "review1", "final"].includes(stageParam)
        ? (stageParam as Stage["id"])
        : "phone");

  const cols = "grid grid-cols-[repeat(7,minmax(0,1fr))]";
  const [openVideoDrawer, setOpenVideoDrawer] = React.useState(false);
  const [openPhoneDrawer, setOpenPhoneDrawer] = React.useState(false);

  const handleLog = (which?: string | boolean) => {
    if (typeof which === "boolean") {
      if (!which) {
        setOpenVideoDrawer(false);
        setOpenPhoneDrawer(false);
      }
      return;
    }

    if (which === "phone") {
      setOpenPhoneDrawer((p) => !p);
      setOpenVideoDrawer(false);
      return;
    }
    if (which === "meet") {
      setOpenVideoDrawer((p) => !p);
      setOpenPhoneDrawer(false);
      return;
    }

    // default close
    setOpenVideoDrawer(false);
    setOpenPhoneDrawer(false);
  };

  const top: React.ReactNode[] = [];
  const bottom: React.ReactNode[] = [];

  stages.forEach((s, i) => {
    const Icon = s.icon;
    const isActive = activeId === s.id;
    const showLogPill = isActive && s.hasLog;

    top.push(
      <div key={`c-${s.id}`} className="flex items-center justify-center">
        <div
          className={[
            "grid h-[28px] w-[28px] place-items-center rounded-full border",
            isActive
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
          isActive ? "text-blue-600 font-medium" : "text-gray-500 font-medium",
        ].join(" ")}
      >
        {s.label}
        {showLogPill && (
          <button
            type="button"
            onClick={() => handleLog(s.id)}
            className="ml-2 flex flex-row items-center bg-gray-100 rounded-sm px-1 text-12 text-gray-600 hover:bg-gray-200"
          >
            <span>Log</span>
            <ChevronRight className="size-3" />
          </button>
        )}
      </div>
    );
    if (i < stages.length - 1) bottom.push(<div key={`sp-${s.id}`} />);
  });

  return (
    <>
      <div className={["w-full max-w-[584px] ml-0", className].join(" ")}>
        <div className={`${cols} items-center`}>{top}</div>
        <div className={`mt-4 ${cols}`}>{bottom}</div>
      </div>

      {/* Drawers respect active stage */}
      <VideoCallLogDrawer onOpenChange={handleLog} open={openVideoDrawer} />
      <PhoneLogDrawer onOpenChange={handleLog} open={openPhoneDrawer} />
    </>
  );
}
