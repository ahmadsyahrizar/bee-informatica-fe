"use client";

import { Badge } from "../ui/badge";
import React from "react";
import { StageStepper } from "./StageStepper";
import { ActionButton } from "../case/ActionButton";
import { useRouter } from "next/navigation";

export function DetailHeader({ caseId = "CS-1234" }: { caseId: string }) {
 const { push } = useRouter()

 return (
  <header className="flex flex-row justify-between">
   <Badge variant="default" className="h-[24px] rounded-sm text-gray-600 font-medium text-14">{caseId}</Badge>
   <StageStepper current="phone" />
   <ActionButton className="w-[119px] h-[40px] p-1 m-0" intent="start-call" onClick={() => push(`/cases/${caseId}/phone`)} />
  </header>
 );
}