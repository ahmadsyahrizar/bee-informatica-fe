"use client";

import React, { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { StageStepper } from "./StageStepper";
import { ActionButton } from "../case/ActionButton";
import {
 Dialog,
 DialogContent,
 DialogHeader,
 DialogTitle,
 DialogFooter,
 DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronRight, X } from "lucide-react";
import { DecisionStatus, DecisionStatusCard } from "./DecisionStatusCard";

/* helpers */
const fmtRM = (n?: number | null) =>
 typeof n === "number" && !Number.isNaN(n) ? `${n.toLocaleString("en-MY")} RM` : "-";

function AmountCard({
 label,
 value,
 tone = "neutral", // "neutral" | "success" | "warn"
}: {
 label: string;
 value: string;
 tone?: "neutral" | "success" | "warn";
}) {
 const toneCls =
  tone === "success"
   ? "bg-emerald-50 border-emerald-300"
   : tone === "warn"
    ? "bg-amber-50 border-amber-300"
    : "bg-gray-50 border-gray-200";
 return (
  <div className={`rounded-xl border px-16 py-16 ${toneCls}`}>
   <div className="text-[12px] text-gray-500 mb-1">{label}</div>
   <div className="text-[24px] font-semibold text-gray-900">{value}</div>
  </div>
 );
}

export function DetailHeader({
 caseId = "CS-1234",
 redirectTo,
 onUpload,
 nextStagePath,
 onConfirmNextStage,
 /* amounts for the final-stage modals */
 appliedAmount = 1_000_000,
 approvedAmount = 0,
 onApprove, // optional api call
 onReject,  // optional api call
}: {
 caseId?: string;
 redirectTo?: string;
 onUpload?: (file: File) => Promise<unknown>;
 nextStagePath?: string;
 onConfirmNextStage?: () => Promise<unknown>;
 appliedAmount?: number;
 approvedAmount?: number;
 onApprove?: (payload: { approvedAmount: number; reason: string }) => Promise<void> | void;
 onReject?: (payload: { reason: string }) => Promise<void> | void;
}) {
 /* proceed modal */
 const [openProceed, setOpenProceed] = useState(false);
 const [proceeding, setProceeding] = useState(false);
 const handleNextStage = () => setOpenProceed(true);
 const [openApprove, setOpenApprove] = useState(false);
 const [openReject, setOpenReject] = useState(false);
 const [approveReason, setApproveReason] = useState("");
 const [rejectReason, setRejectReason] = useState("");
 const [saving, setSaving] = useState(false);
 const { push } = useRouter();
 const params = useSearchParams();
 const inputRef = useRef<HTMLInputElement | null>(null);
 const [uploading, setUploading] = useState(false);
 const confirmProceed = async () => {
  try {
   setProceeding(true);
   if (onConfirmNextStage) await onConfirmNextStage();
   push(computedNextPath);
  } finally {
   setProceeding(false);
   setOpenProceed(false);
  }
 };

 const queryStatus = params.get("status");
 const currentStage = (params.get("stage") || "phone").toLowerCase();
 const isConfirmationStatus = queryStatus === "confirmation";
 const isPhoneStage = currentStage === "phone";
 const isMeetStage = currentStage === "meet";
 const isReviewStage = currentStage === "review1";
 const isFinalStage = currentStage === "final";
 const isDecisionStage = currentStage === "decision";

 console.log({ currentStage })


 /* derive next stage label/path */
 const nextStageLabel =
  currentStage === "phone"
   ? "Meet"
   : currentStage === "meet"
    ? "1st Review"
    : currentStage === "review1"
     ? "Final Review"
     : "Decision";

 const computedNextPath =
  nextStagePath ||
  (currentStage === "phone"
   ? `/cases/${caseId}?stage=meet`
   : currentStage === "meet"
    ? `/cases/${caseId}?stage=review1`
    : currentStage === "review1"
     ? `/cases/${caseId}?stage=final`
     : `/cases/${caseId}?stage=decision&status=${!!approveReason ? 'approved' : "rejected"}`);

 /* upload (start-call) */
 const triggerFilePicker = () => inputRef.current?.click();
 const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  setUploading(true);
  try {
   if (onUpload) await onUpload(file);
   else await new Promise((r) => setTimeout(r, 700));
   e.target.value = "";
   push(redirectTo ?? `/cases/${caseId}/confirmation?stage=${currentStage}`);
  } catch (err) {
   console.error("Upload failed:", err);
   e.target.value = "";
   setUploading(false);
  }
 };

 const submitApprove = async () => {
  try {
   setSaving(true);
   await onApprove?.({ approvedAmount, reason: approveReason.trim() });
   push(computedNextPath);
  } finally {
   setRejectReason('')
   setSaving(false);
   setOpenApprove(false);
  }
 };

 const submitReject = async () => {
  try {
   setSaving(true);
   await onReject?.({ reason: rejectReason.trim() });
   push(computedNextPath);
  } finally {
   setApproveReason('')
   setSaving(false);
   setOpenReject(false);
  }
 };

 return (
  <header className="flex flex-row justify-between">
   <StageStepper current={currentStage} />

   {/* hidden file input for upload */}
   <input
    ref={inputRef}
    type="file"
    accept="image/*"
    className="hidden"
    onChange={handleFileSelected}
   />

   {
    isDecisionStage && (
     <DecisionStatusCard
      status={queryStatus as DecisionStatus}
      reason={queryStatus === 'approved' ? approveReason : rejectReason}
      onAction={() => console.log("show timeline/log")}
     // actionIcon={<PhoneCall className="h-4 w-4" />} // optional
     />
    )
   }

   {/* Primary action (upload/submit) */}
   {(isPhoneStage || isMeetStage || isReviewStage) && (
    <ActionButton
     className="h-[40px] p-16 mr-0"
     intent={isReviewStage ? "submit" : "start-call"}
     onClick={isReviewStage ? () => push(computedNextPath) : triggerFilePicker}
     aria-busy={uploading}
     type={queryStatus || ""}
    />
   )}

   {/* Next stage action (visible on ?status=confirmation) */}
   {isConfirmationStatus && (
    <ActionButton className="h-[40px] p-16 ml-0" intent="next-stage" onClick={handleNextStage} />
   )}

   {/* Final-stage actions */}
   {isFinalStage && (
    <>
     <ActionButton
      className="h-[40px] ml-0 w-[150px] mr-0"
      intent="reject"
      onClick={() => setOpenReject(true)}
     />
     <ActionButton
      className="h-[40px] ml-2 w-[150px] mr-0"
      intent="approve"
      onClick={() => setOpenApprove(true)}
     />
    </>
   )}

   {/* Proceed confirmation modal */}
   <Dialog open={openProceed} onOpenChange={setOpenProceed}>
    <DialogContent className="max-w-[400px] bg-white p-24">
     <DialogHeader>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
       <ChevronRight className="h-5 w-5 text-emerald-600" />
       <ChevronRight className="h-5 w-5 text-emerald-600 ml-[-14px]" />
      </div>
      <DialogTitle className="text-[18px] mt-16">
       {`Proceed to ${nextStageLabel} stage?`}
      </DialogTitle>
     </DialogHeader>

     <p className="text-sm text-gray-600">
      Once you proceed, you cannot return to this stage. You will still be able
      to view the application details, but no further changes can be made.
      This action cannot be undone.
     </p>

     <DialogFooter className="gap-2 mt-32">
      <DialogClose asChild>
       <Button variant="outline" className="p-16">
        Cancel
       </Button>
      </DialogClose>
      <Button
       onClick={confirmProceed}
       disabled={proceeding}
       className="bg-[#E04B2E] hover:bg-[#CF442A] p-16 text-white"
      >
       {proceeding ? "Proceeding..." : "Yes, Proceed to Next Stage"}
      </Button>
     </DialogFooter>
    </DialogContent>
   </Dialog>

   {/* Approve modal */}
   <Dialog open={openApprove} onOpenChange={setOpenApprove}>
    <DialogContent className="max-w-[578px] bg-white p-24">
     <DialogHeader>
      <DialogTitle className="text-[18px] mb-20">Approve Application?</DialogTitle>
     </DialogHeader>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
      <AmountCard label="Applied Loan Amount" value={fmtRM(appliedAmount)} />
      <AmountCard
       label="Approved Loan Amount"
       value={fmtRM(approvedAmount)}
       tone="success"
      />
     </div>

     <div className="my-20">
      <label className="block text-[14px] text-gray-700 font-medium mb-1">
       Acceptance Reason <span className="text-red-500">*</span>
      </label>
      <textarea
       rows={5}
       placeholder="Enter reason of acceptance"
       className="w-full rounded-xl border border-gray-300 px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-emerald-500"
       value={approveReason}
       onChange={(e) => setApproveReason(e.target.value)}
      />
     </div>

     <DialogFooter className="gap-2 mt-4">
      <DialogClose asChild>
       <Button variant="outline" className="p-16">Cancel</Button>
      </DialogClose>
      <Button
       onClick={submitApprove}
       disabled={!approveReason.trim() || saving}
       className="bg-emerald-600 hover:bg-emerald-700 text-white p-16"
      >
       Yes, Approve
      </Button>
     </DialogFooter>
    </DialogContent>
   </Dialog>

   {/* Reject modal */}
   <Dialog open={openReject} onOpenChange={setOpenReject}>
    <DialogContent className="max-w-[578px] bg-white p-24">
     <DialogHeader>
      <DialogTitle className="text-[18px]">Reject Application</DialogTitle>
     </DialogHeader>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mt-20">
      <AmountCard label="Applied Loan Amount" value={fmtRM(appliedAmount)} />
      <AmountCard label="Approved Loan Amount" value={fmtRM(0)} tone="warn" />
     </div>

     <div className="mt-20 mb-20">
      <label className="block text-[14px] text-gray-700 font-medium mb-1">
       Rejection Reason <span className="text-red-500">*</span>
      </label>
      <textarea
       rows={6}
       placeholder="Enter reason of rejection"
       className="w-full rounded-xl border-2 border-dashed border-violet-400 px-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-violet-500"
       value={rejectReason}
       onChange={(e) => setRejectReason(e.target.value)}
      />
     </div>

     <DialogFooter className="gap-2 mt-4">
      <DialogClose asChild>
       <Button variant="outline" className="p-16">Cancel</Button>
      </DialogClose>
      <Button
       onClick={submitReject}
       disabled={!rejectReason.trim() || saving}
       className="bg-[#D92D20] hover:bg-[#C21A11] text-white p-16"
      >
       Yes, Reject
      </Button>
     </DialogFooter>
    </DialogContent>
   </Dialog>
  </header>
 );
}
