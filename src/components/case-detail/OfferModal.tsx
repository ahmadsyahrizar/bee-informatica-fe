"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PostGiveOffer from "@/services/GiveOffer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Stage } from "@/types/case";
import type { PostGiveOfferRequest } from "@/types/api/post-give-offer.type";

import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Check, X } from "lucide-react";

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

 // ---------- hooks: always at top ----------
 const [approvedAmountRaw, setApprovedAmountRaw] = useState<string>("");
 const [approvedConfirmed, setApprovedConfirmed] = useState(false);
 const [repaymentDate, setRepaymentDate] = useState<Date | undefined>(undefined);

 // control displayed month of the calendar grid
 const [displayMonth, setDisplayMonth] = useState<Date | undefined>(repaymentDate ?? new Date());

 const [memo, setMemo] = useState<string>("");

 // caption input text (editable). kept separate so user can type freely before parsing
 const [captionInput, setCaptionInput] = useState<string>("");

 useEffect(() => {
  // keep captionInput in sync when repaymentDate changes externally
  setCaptionInput(
   repaymentDate
    ? repaymentDate.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
    : ""
  );
 }, [repaymentDate]);

 const formattedApproved = useMemo(() => {
  const n = Number(approvedAmountRaw.replace(/[^0-9.-]+/g, ""));
  if (!isFinite(n) || n <= 0) return "";
  return new Intl.NumberFormat("en-US").format(n) + " RM";
 }, [approvedAmountRaw]);

 const formattedRepayment = useMemo(() => {
  if (!repaymentDate) return "";
  return repaymentDate.toLocaleDateString(undefined, {
   year: "numeric",
   month: "short",
   day: "numeric",
  });
 }, [repaymentDate]);

 const monthLabel = useMemo(() => {
  const m = displayMonth ?? new Date();
  return m.toLocaleString(undefined, { month: "long", year: "numeric" });
 }, [displayMonth]);

 const giveOfferMutation = useMutation({
  mutationFn: async (body: PostGiveOfferRequest) => PostGiveOffer({ accessToken, caseId, body }),
  onSuccess: () => {
   toast.success("Offer submitted");
   setTimeout(() => window.location.reload(), 800);
   onClose();
  },
  onError: (err: any) => toast.error(err?.message || "Failed to give offer"),
 });
 // ---------- end hooks ----------

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

 const moveMonth = (delta: number) => {
  setDisplayMonth((m) => {
   const base = m ?? new Date();
   return new Date(base.getFullYear(), base.getMonth() + delta, 1);
  });
 };

 const handleSetToday = () => {
  const today = new Date();
  setRepaymentDate(today);
  setDisplayMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  setCaptionInput(
   today.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
  );
 };

 const onSelectDate = (d?: Date | undefined) => {
  setRepaymentDate(d ?? undefined);
  if (d) setDisplayMonth(new Date(d.getFullYear(), d.getMonth(), 1));
 };

 const handleCaptionEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key !== "Enter") return;
  e.preventDefault();

  if (!captionInput) {
   setRepaymentDate(undefined);
   return;
  }

  const parsed = Date.parse(captionInput);
  if (!isNaN(parsed)) {
   const d = new Date(parsed);
   onSelectDate(d);
   return;
  }

  const isoMatch = captionInput.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
   const [_, y, m, day] = isoMatch;
   const d = new Date(Number(y), Number(m) - 1, Number(day));
   if (!isNaN(d.getTime())) {
    onSelectDate(d);
    return;
   }
  }

  toast.error("Could not parse date. Try 'Jan 1, 2025' or '2025-01-01'.");
 };


 // When input loses focus, attempt to parse user's typed date
 const handleCaptionBlur = () => {
  if (!captionInput) {
   setRepaymentDate(undefined);
   return;
  }

  // Try parsing a few simple formats. Date.parse accepts many formats but is implementation-dependent.
  // First try direct Date.parse, then try MMM d, yyyy with locale fallback (new Date(captionInput)).
  const parsed = Date.parse(captionInput);
  if (!isNaN(parsed)) {
   const d = new Date(parsed);
   onSelectDate(d);
   return;
  }

  const isoMatch = captionInput.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
   const [_, y, m, day] = isoMatch;
   const d = new Date(Number(y), Number(m) - 1, Number(day));
   if (!isNaN(d.getTime())) {
    onSelectDate(d);
    return;
   }
  }

  toast.error("Could not parse date. Try 'Jan 1, 2025' or '2025-01-01'.");
 };

 return (
  <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/30">
   <div className="w-[720px] rounded-2xl bg-white p-[24px] shadow-xl relative">
    <button aria-label="Close" onClick={onClose} className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100">
     <X />
    </button>

    <h3 className="text-lg font-semibold mb-4">Loan Offer</h3>

    <div className="grid grid-cols-2 gap-5 mb-5 mt-5">
     <div className="rounded-xl border border-gray-200 p-[16px] bg-gray-50">
      <div className="text-sm text-gray-500">Applied Loan Amount</div>
      <div className="text-2xl font-semibold mt-2">{appliedAmount}</div>
     </div>

     <div className={cn("rounded-xl border p-[16px] flex items-center justify-between", approvedConfirmed ? "border-[#079455] bg-green-50" : "border-brand-500 bg-white")}>
      <div className="w-full">
       <div className="text-sm text-gray-500">Approved Loan Amount</div>
       <div className="flex items-center gap-3 mt-2">
        <input
         value={approvedAmountRaw}
         inputMode="numeric"
         onChange={(e) => {
          setApprovedAmountRaw(e.target.value);
          setApprovedConfirmed(false);
         }}
         placeholder="Enter Amount"
         className="w-full text-2xl font-semibold outline-none bg-transparent placeholder:text-brand-500"
        />
        <button onClick={handleConfirmApproved} className="ml-2 p-1 rounded-md disabled:opacity-50" title="Confirm approved amount">
         {!approvedConfirmed && <Check color="#079455" />}
        </button>
       </div>
      </div>
     </div>
    </div>

    <div className="mb-5 mt-5">
     <label className="text-sm font-medium block mb-2">Repayment deadline *</label>

     <Popover>
      <PopoverTrigger asChild>
       <button className={cn("w-full border text-left rounded-lg px-3 py-3 flex items-center gap-3", repaymentDate ? "border-orange-500" : "border-gray-200")}>
        <CalendarIcon className="text-gray-600" />
        <span className={repaymentDate ? "text-gray-800" : "text-gray-400"}>{repaymentDate ? formattedRepayment : "Select a date"}</span>
       </button>
      </PopoverTrigger>

      <PopoverContent className="w-[530px] p-24 z-[9999] bg-white transform -translate-y-24">
       <div className="flex items-center justify-between mb-3 h-12">
        <button type="button" onClick={() => moveMonth(-1)} className="rounded-full hover:bg-gray-100" aria-label="Previous month">
         <ChevronLeft className="w-5 h-5 text-gray-400" />
        </button>

        <div className="text-center text-base font-medium select-none">{monthLabel}</div>

        <button type="button" onClick={() => moveMonth(1)} className="rounded-full hover:bg-gray-100" aria-label="Next month">
         <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
       </div>

       <div className="flex items-center gap-3 mb-[-16px] mt-[26px]">
        <input
         value={captionInput}
         onChange={(e) => setCaptionInput(e.target.value)}
         onBlur={handleCaptionBlur}
         onKeyDown={handleCaptionEnter}
         placeholder="Select a date (e.g. Oct 12, 2025 or 2025-10-12)"
         aria-label="Selected date"
         className="flex-1 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400"
        />
        <button type="button" onClick={handleSetToday} className="rounded-md border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50">
         Today
        </button>
       </div>

       {/* calendar grid WITHOUT internal navigation */}
       <div>
        <Calendar mode="single" className="bg-white w-full" selected={repaymentDate} onSelect={(d) => onSelectDate(d ?? undefined)} hideNavigation={true} month={displayMonth ?? undefined} />
       </div>
      </PopoverContent>
     </Popover>
    </div>

    <div className="mb-4">
     <label className="text-sm font-medium block mb-2">Memo *</label>
     <textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="Enter reason of acceptance" className="w-full rounded-md border p-[16px] min-h-[140px]" />
    </div>

    <div className="mt-6 flex justify-end gap-3 pt-4">
     <Button variant="outline" className="px-[10px] py-3 border-gray-300" onClick={onClose}>
      Cancel
     </Button>

     <Button className="px-[10px] py-3 bg-green-600 !text-white" onClick={handleSubmit} disabled={!approvedConfirmed || !repaymentDate || giveOfferMutation.isPending}>
      {giveOfferMutation.isPending ? "Submitting..." : "Yes, Offer Loan"}
     </Button>
    </div>
   </div>
  </div>
 );
}
