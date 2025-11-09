// components/case-detail/UploadErrorDialog.tsx
"use client";

import { X, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import iconUploadMP3 from "@/assets/icons/icon-upload-mp3.svg";
import iconUploadMP4 from "@/assets/icons/icon-upload-mp4.svg";
import iconReject from "@/assets/icons/icon-upload-reject.svg"
import iconUpload from "@/assets/icons/icon-upload-button-black.svg";

import React from "react";

export default function UploadErrorDialog({
 open,
 file,
 stage,
 message,
 onRetry,
 onUploadOther,
 onClose,
}: {
 open: boolean;
 file: File | null;
 stage: "phone" | "video";
 message?: string;
 onRetry: () => void;
 onUploadOther: () => void;
 onClose: () => void;
}) {
 if (!open) return null;

 const Icon = stage === "video" ? iconUploadMP4 : iconUploadMP3;
 const sizeLabel = file?.size ? `${(file.size / 1024 / 1024).toFixed(0)} MB` : "—";

 return (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30">
   <div className="w-[420px] rounded-2xl bg-white p-[24px] shadow-xl">
    <div className="relative">
     <div className="flex flex-col items-center justify-center">
      <Image src={iconReject} alt="reject upload" width={70} height={70} />
      <h2 className="text-lg font-semibold">File Upload Failed</h2>
     </div>
     <button className="absolute right-0 top-0 rounded-md p-1 text-gray-500 hover:bg-gray-100" aria-label="Close" onClick={onClose}>
      <X size={18} />
     </button>
    </div>

    {!!message && <p className="mt-2 text-sm text-center  text-rose-600">{message}</p>}

    <div className="my-[20px] rounded-xl border border-gray-200 p-[16px]">
     <div className="flex items-center gap-3">
      <Image src={Icon} alt="failed" width={40} height={40} />
      <div className="min-w-0 flex-1">
       <p className="truncate font-medium text-gray-900">{file?.name ?? "—"}</p>
       <p className="text-sm text-gray-500">{sizeLabel}</p>
      </div>
     </div>
    </div>

    <div className="flex flex-col gap-3">
     <Button className="w-full bg-brand-500 !text-white text-16 font-semibold" onClick={onRetry}>
      Retry Upload
     </Button>
     <Button variant="outline" className="w-full border-gray-300" onClick={onUploadOther}>
      <Image src={iconUpload} alt="upload" width={24} height={24} />
      Upload Other File
     </Button>
    </div>
   </div>
  </div>
 );
}
