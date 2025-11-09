"use client";

import React, { useRef, useEffect } from "react";
import { Loader } from "lucide-react";
import ModalLayout from "@/components/common/Modal";

type MemoModalProps = {
 open: boolean;
 value?: string;
 onClose: () => void;
 isLoading?: boolean;
 onSave: (value: string) => void;
};

export default function MemoModal({
 open,
 value = "",
 onClose,
 onSave,
 isLoading = false,
}: MemoModalProps) {
 const textareaRef = useRef<HTMLTextAreaElement | null>(null);
 const [localValue, setLocalValue] = React.useState<string>(value);

 useEffect(() => {
  setLocalValue(value);
 }, [value]);

 const footer = (
  <>
   <button
    onClick={onClose}
    className="rounded-md border border-gray-200 px-[16px] py-[10px] text-sm bg-white hover:bg-gray-50"
   >
    Cancel
   </button>

   <button
    disabled={!!isLoading}
    onClick={() => {
     onSave(localValue);
     onClose();
    }}
    className="rounded-md px-[16px] py-[10px] text-sm bg-[#f05a2b] text-white shadow hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
   >
    {isLoading ? <Loader className="animate-spin" /> : "Save"}
   </button>
  </>
 );

 return (
  <ModalLayout
   open={open}
   title="Phone Memo"
   onClose={onClose}
   initialFocusRef={textareaRef}
   footer={footer}
   className="w-[720px] max-w-[95%]"
  >
   <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
     Memo
    </label>

    <textarea
     ref={textareaRef}
     value={localValue}
     onChange={(e) => setLocalValue(e.target.value)}
     placeholder="Enter your memo"
     rows={8}
     className="w-full rounded-md border border-gray-200 p-3 resize-none placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
    />
   </div>
  </ModalLayout>
 );
}
