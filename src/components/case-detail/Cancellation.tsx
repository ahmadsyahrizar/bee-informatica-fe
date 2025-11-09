import { useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Ban } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useParams, useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import CancelApplication from "@/services/CancelApplication";
import { useSession } from "next-auth/react";
import { PayloadCancelApplicationRequest } from "@/types/api/cancel-application.type";
import { toast } from "sonner";

const Cancellation = () => {
 const [openCancel, setOpenCancel] = useState(false);
 const [reason, setReason] = useState("");
 const [memo, setMemo] = useState("");
 const { push } = useRouter();
 // @ts-expect-error rija 
 const accessToken = useSession()?.data?.accessToken ?? "";
 const { id } = useParams()
 const { mutate, isPending } = useMutation({
  mutationKey: ["cancelApplication", id],
  mutationFn: (body: PayloadCancelApplicationRequest) => CancelApplication({ accessToken, caseId: id as string, body })
 })

 const handleConfirm = async () => {
  if (!reason || !memo.trim()) return;
  mutate({ reason, memo }, {
   onSuccess: () => {
    toast.success('Application cancelled, redirecting to case list');
    push("/cases")
   },
   onError: (err) => {
    toast.error(`Failed to cancel application, reason: ${err.message}`)
   }
  })
 };
 return (
  <>
   <button
    type="button"
    onClick={() => setOpenCancel(true)}
    className="fixed bottom-40 text-[#D92D20] text-12 font-semibold underline cursor-pointer"
   >
    Cancel Application
   </button>

   {/* dialog */}
   <Dialog open={openCancel} onOpenChange={setOpenCancel}>
    <DialogContent className="max-w-[460px] bg-white p-[24px]">
     <DialogHeader>
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFECE8]">
       <Ban className="h-5 w-5 text-[#D92D20]" />
      </div>
      <DialogTitle className="text-[18px] mt-4 font-semibold text-gray-900">
       Cancel This Application?
      </DialogTitle>
     </DialogHeader>

     <p className="text-sm text-gray-600 mt-2">
      This will cancel the application. You will still be able to view its details,
      but no further changes can be made. This action cannot be undone.
     </p>

     {/* Reason (shadcn Select) */}
     <div className="mt-5">
      <label htmlFor="reason" className="text-sm font-medium text-gray-700 mb-1 block">
       Reason <span className="text-red-500">*</span>
      </label>

      <Select
       onValueChange={(val) => setReason(val)}
       value={reason}
      >
       <SelectTrigger id="reason" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm">
        <SelectValue placeholder="Select Reason" />
       </SelectTrigger>
       <SelectContent className="bg-white">
        <SelectItem value="High process fee">High process fee</SelectItem>
        <SelectItem value="High interest">High interest</SelectItem>
        <SelectItem value="Competitor’s offer">Competitor’s offer</SelectItem>
        <SelectItem value="Others">Others</SelectItem>
       </SelectContent>
      </Select>
     </div>

     {/* Memo (shadcn Textarea) */}
     <div className="mt-4">
      <label htmlFor="memo" className="text-sm font-medium text-gray-700 mb-1 block">
       Memo <span className="text-red-500">*</span>
      </label>
      <Textarea
       id="memo"
       placeholder="Write your memo here"
       value={memo}
       onChange={(e) => setMemo((e.target as HTMLTextAreaElement).value)}
       rows={4}
       className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm resize-none"
      />
     </div>

     <DialogFooter className="mt-6 gap-2">
      <DialogClose asChild>
       <Button variant="outline" className="p-3">Cancel</Button>
      </DialogClose>
      <Button
       variant="destructive"
       onClick={handleConfirm}
       disabled={!reason || !memo.trim()}
       className="bg-[#E04B2E] text-white hover:bg-[#CF442A] p-3"
      >
       {isPending ? "Cancelling..." : "Yes, Cancel Application"}
      </Button>
     </DialogFooter>
    </DialogContent>
   </Dialog>
  </>
 )
}

export default Cancellation;