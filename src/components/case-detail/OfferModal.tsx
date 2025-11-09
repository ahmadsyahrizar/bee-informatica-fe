"use client";

import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import PostGiveOffer from "@/services/GiveOffer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Stage } from "@/types/case";
import type { PostGiveOfferRequest } from "@/types/api/post-give-offer.type";

// shadcn components (adjust import paths if different in your repo)
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, Check, X, X as XIcon } from "lucide-react";

type Props = {
 open: boolean;
 onClose: () => void;
 accessToken: string;
 caseId: string | number;
 stage: Stage;
 appliedAmount?: string;
};

export default function OfferModal({
 open,
 onClose,
 accessToken,
 caseId,
 stage,
 appliedAmount = "1,000,000 RM",
}: Props) {
 const queryClient = useQueryClient();
 const [approvedAmountRaw, setApprovedAmountRaw] = useState<string>("");
 const [approvedConfirmed, setApprovedConfirmed] = useState(false);
 const [repaymentDate, setRepaymentDate] = useState<Date | undefined>(undefined);
 const [memo, setMemo] = useState<string>("");

 const formattedApproved = useMemo(() => {
  const n = Number(approvedAmountRaw.replace(/[^0-9.-]+/g, ""));
  if (!isFinite(n) || n <= 0) return "";
  return new Intl.NumberFormat("en-US").format(n) + " RM";
 }, [approvedAmountRaw]);

 // formatted repayment date for display
 const formattedRepayment = useMemo(() => {
  if (!repaymentDate) return "";
  return repaymentDate.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
 }, [repaymentDate]);

 const giveOfferMutation = useMutation({
  mutationFn: async (body: PostGiveOfferRequest) => PostGiveOffer({ accessToken, caseId, body }),
  onSuccess: () => {
   toast.success("Offer submitted");
   setTimeout(() => {
    window.location.reload();
   }, 1000);
   onClose();
  },
  onError: (err: any) => {
   toast.error(err?.message || "Failed to give offer");
  },
 });

 if (!open) return null;

 const handleConfirmApproved = () => {
  const num = Number(approvedAmountRaw.replace(/[^0-9.-]+/g, ""));
  if (!isFinite(num) || num <= 0) {
   toast.error("Enter a valid approved amount");
   return;
  }
  setApprovedConfirmed(true);
 };

 const handleSubmit = () => {
  if (!approvedConfirmed) {
   toast.error("Please confirm approved amount first");
   return;
  }
  if (!repaymentDate) {
   toast.error("Please select repayment deadline");
   return;
  }

  const payload: PostGiveOfferRequest = {
   approved_loan_amount: Number(approvedAmountRaw.replace(/[^0-9.-]+/g, "")),
   memo: memo || undefined,
   repayment_deadline: new Date(repaymentDate.getFullYear(), repaymentDate.getMonth(), repaymentDate.getDate()).toISOString(),
  };

  giveOfferMutation.mutate(payload);
 };

 return (
  <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/30">
   <div className="w-[720px] rounded-2xl bg-white p-[24px] shadow-xl relative">
    <button
     aria-label="Close"
     onClick={onClose}
     className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100"
    >
     <X />
    </button>

    <h3 className="text-lg font-semibold mb-4">Loan Offer</h3>

    <div className="grid grid-cols-2 gap-5 mb-5 mt-5">
     <div className="rounded-xl border border-gray-200 p-[16px] bg-gray-50">
      <div className="text-sm text-gray-500">Applied Loan Amount</div>
      <div className="text-2xl font-semibold mt-2">{appliedAmount}</div>
     </div>

     <div
      className={cn(
       "rounded-xl border p-[16px] flex items-center justify-between",
       approvedConfirmed ? "border-green-300 bg-green-50" : "border-brand-500 bg-white"
      )}
     >
      <div className="w-full">
       <div className="text-sm text-gray-500">Approved Loan Amount</div>
       <div className="flex items-center gap-3 mt-2">
        <input
         value={approvedAmountRaw}
         inputMode="numeric"
         onChange={(e) => {
          const raw = e.target.value;
          setApprovedAmountRaw(raw);
          setApprovedConfirmed(false);
         }}
         placeholder="Enter Amount"
         className="w-full text-2xl font-semibold outline-none bg-transparent placeholder:text-brand-500"
        />
        <button
         onClick={handleConfirmApproved}
         className="ml-2 p-1 rounded-md disabled:opacity-50"
         title="Confirm approved amount"
        >
         <Check />
        </button>
       </div>
       {approvedConfirmed && (
        <div className="text-sm text-gray-600 mt-2">{formattedApproved}</div>
       )}
      </div>
     </div>
    </div>

    <div className="mb-5 mt-5">
     <label className="text-sm font-medium block mb-2">Repayment deadline *</label>

     <Popover>
      <PopoverTrigger asChild>
       <button
        className={`w-full border  text-left rounded-lg px-3 py-3 flex items-center gap-3 ${repaymentDate ? "border-orange-500" : "border-gray-200"}`}
       >
        <CalendarIcon className="text-gray-600" />
        <span className={repaymentDate ? "text-gray-800" : "text-gray-400"}>
         {repaymentDate ? formattedRepayment : "Select a date"}
        </span>
       </button>
      </PopoverTrigger>

      <PopoverContent className="w-[350px] p-0 z-[9999] bg-white">
       <Calendar
        mode="single"
        className="bg-white w-full"
        selected={repaymentDate}
        onSelect={(d) => setRepaymentDate(d ?? undefined)}
        initialFocus
       />
      </PopoverContent>
     </Popover>
    </div>

    <div className="mb-4">
     <label className="text-sm font-medium block mb-2">Memo *</label>
     <textarea
      value={memo}
      onChange={(e) => setMemo(e.target.value)}
      placeholder="Enter reason of acceptance"
      className="w-full rounded-md border p-[16px] min-h-[140px]"
     />
    </div>

    <div className="mt-6 flex justify-end gap-3 pt-4">
     <Button variant="outline" className="px-6 py-3 border-gray-300" onClick={onClose}>
      Cancel
     </Button>

     <Button
      className="px-6 py-3 bg-green-600 !text-white"
      onClick={handleSubmit}
      disabled={!approvedConfirmed || !repaymentDate || giveOfferMutation.isPending}
     >
      {giveOfferMutation.isPending ? "Submitting..." : "Yes, Offer Loan"}
     </Button>
    </div>
   </div>
  </div>
 );
}
