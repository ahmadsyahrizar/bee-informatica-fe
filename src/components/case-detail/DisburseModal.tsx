"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import PostDisburseLoan from "@/services/PostDisburse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Stage } from "@/types/case";
import { X } from "lucide-react";

type Props = {
 open: boolean;
 onClose: () => void;
 accessToken: string;
 caseId: string | number;
 stage: Stage;
};

export default function DisburseModal({ open, onClose, accessToken, caseId, stage }: Props) {
 const [memo, setMemo] = useState("");
 const queryClient = useQueryClient();

 const disburseMutation = useMutation({
  mutationFn: async (body: { memo?: string }) => PostDisburseLoan({ accessToken, caseId, body }),
  onSuccess: () => {
   toast.success("Marked as disbursed");
   setTimeout(() => {
    window.location.reload();
   }, 1000);
   onClose();
  },
  onError: (err: any) => {
   toast.error(err?.message || "Failed to disburse");
  },
 });

 if (!open) return null;

 const handleConfirm = () => {
  disburseMutation.mutate({ memo: memo || undefined });
 };

 return (
  <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-black/30">
   <div className="w-[620px] rounded-2xl bg-white p-[20px] shadow-xl relative">
    <button aria-label="Close" onClick={onClose} className="absolute right-10 top-10 p-2 rounded-full hover:bg-gray-100">
     <X />
    </button>

    <div className="mb-5">
     <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="48" height="48" rx="24" fill="#DCFAE6" />
      <rect x="4" y="4" width="48" height="48" rx="24" stroke="#ECFDF3" stroke-width="8" />
      <path d="M23.5 28L26.5 31L32.5 25M38 28C38 33.5228 33.5228 38 28 38C22.4772 38 18 33.5228 18 28C18 22.4772 22.4772 18 28 18C33.5228 18 38 22.4772 38 28Z" stroke="#079455" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
     </svg>
    </div>

    <h3 className="text-lg font-semibold mb-3">Mark as Disbursed</h3>
    <p className="text-sm text-gray-600 mb-4">
     Once you mark this loan as disbursed, the status will be updated and shown to the applicant. This action cannot be undone.
    </p>

    <div className="mb-5 mt-5">
     <label className="text-sm font-medium block mb-2">Memo *</label>
     <textarea
      value={memo}
      onChange={(e) => setMemo(e.target.value)}
      placeholder="Write your memo here"
      className="w-full rounded-md border p-4 min-h-[120px]"
     />
    </div>

    <div className="mt-6 flex justify-end gap-3 pt-4">
     <Button variant="outline" className="py-[10px] px-[18px] border-gray-300" onClick={onClose}>
      Cancel
     </Button>
     <Button
      className="py-[10px] px-[18px] bg-[#079455] !text-white font-semibold"
      onClick={handleConfirm}
      disabled={disburseMutation.isPending}
     >
      {disburseMutation.isPending ? "Processing..." : "Yes, Mark as Disbursed"}
     </Button>
    </div>
   </div>
  </div>
 );
}
