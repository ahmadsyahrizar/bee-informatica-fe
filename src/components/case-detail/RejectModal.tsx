import React, { useEffect, useRef, useState } from "react";
import ModalLayout from "@/components/common/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
 Select,
 SelectItem,
 SelectValue,
 SelectContent,
 SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Reject from "@/services/Reject";
import type { PayloadRejectRequest } from "@/types/api/reject.type";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export type RejectReason = {
 id: string;
 label: string;
};

type Props = {
 open: boolean;
 onClose: () => void;
 reasons?: RejectReason[];
};

export default function RejectApplicationModal({
 open,
 onClose,
 reasons = [
  { id: "ctos", label: "CTOS" },
  { id: "insufficient_documents", label: "Insufficient Documents" },
  { id: "no_response", label: "No Response" },
  { id: "fraud", label: "Fraud" },
  { id: "other", label: "Other" },
 ],
}: Props) {
 const selectRef = useRef<HTMLButtonElement | null>(null);
 const memoRef = useRef<HTMLTextAreaElement | null>(null);
 const queryClient = useQueryClient();
 const { id } = useParams()
 // @ts-expect-error: rija
 const accessToken = useSession().data?.accessToken ?? ""
 const [reason, setReason] = useState<string>("");
 const [memo, setMemo] = useState<string>("");

 console.log({ memo, reason })

 useEffect(() => {
  if (open) {
   setReason("");
   setMemo("");
  }
 }, [open]);


 const { mutateAsync, isPending } = useMutation({
  mutationKey: ['rejectModal'],
  mutationFn: async (body: PayloadRejectRequest) => await Reject<{ success: boolean }>({
   accessToken,
   caseId: id as string,
   body,
  })
 }
 );

 const handleSubmit = async () => {
  if (!reason.trim() || !memo.trim()) return;

  const payload: PayloadRejectRequest = {
   reason: reason,
   memo,
  };

  try {
   await mutateAsync(payload, {
    onError: (err) => {
     toast.error(err.message)
    },
    onSuccess: () => {
     toast.success("Rejection success");
     queryClient.invalidateQueries({ queryKey: ['caseDetail', 'initial', id] });
     onClose();
    }
   })
  } catch {
  }
 };

 return (
  <ModalLayout
   open={open}
   onClose={() => {
    if (!isPending) onClose();
   }}
   title="Reject Application"
   initialFocusRef={memoRef as unknown as React.RefObject<HTMLElement>}
   footer={
    <div className="flex items-center justify-end gap-3 w-full">
     <Button
      variant="outline"
      onClick={() => onClose()}
      disabled={isPending}
      className="px-4 py-2"
     >
      Cancel
     </Button>

     <Button
      onClick={handleSubmit}
      disabled={isPending}
      className="bg-brand-500 hover:bg-brand-500 text-white px-5 py-2"
     >
      {isPending ? "Rejecting..." : "Yes, Reject Application"}
     </Button>
    </div>
   }
  >
   <form
    onSubmit={(e) => {
     e.preventDefault();
     handleSubmit();
    }}
    className="space-y-4"
   >
    {/* Reason */}
    <div>
     <Label className="mb-2">
      Reason <span className="text-destructive">*</span>
     </Label>

     <Select
      onValueChange={(val) => {
       setReason(val);
      }}
      value={reason}
     >
      <SelectTrigger
       ref={selectRef}
       aria-label="Select reason"
       className={`w-full bg-white`}
      >
       <SelectValue placeholder="Select Reason" />
      </SelectTrigger>

      <SelectContent className="bg-white">
       {reasons.map((r) => (
        <SelectItem key={r.id} value={r.id}>
         {r.label}
        </SelectItem>
       ))}
      </SelectContent>
     </Select>
    </div>

    {/* Memo */}
    <div>
     <Label className="mb-2">
      Memo <span className="text-destructive">*</span>
     </Label>

     <Textarea
      ref={memoRef}
      value={memo}
      placeholder="Enter reason of rejection"
      onChange={(e) => setMemo(e.target.value)}
      rows={6}
     />
    </div>
   </form>
  </ModalLayout>
 );
}
