"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import iconUploadMP3 from "@/assets/icons/icon-upload-mp3.svg"
import iconUploadMP4 from "@/assets/icons/icon-upload-mp4.svg"
import iconUpload from "@/assets/icons/icon-upload.svg"
import Image from "next/image";

export default function UploadingDialog({
 open,
 file,
 stage,
 progress,
 onCancel,
}: {
 open: boolean;
 file: File | null;
 stage: "phone" | "video";
 progress: number;
 onCancel: () => void;
}) {
 if (!open) return null;
 const Icon = stage === "video" ? iconUploadMP4 : iconUploadMP3;
 const badge = stage === "video" ? "MP4" : "MP3";
 const sizeLabel = file?.size ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "—";

 return (
  <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/30">
   <div className="w-[420px] rounded-2xl bg-white p-[24px] shadow-xl">
    <div className="flex items-center justify-between">
     <h2 className="text-lg font-semibold">Uploading File</h2>
     <button className="rounded-md p-1 text-gray-500 hover:bg-gray-100" aria-label="Close" onClick={onCancel}>
      <X size={18} />
     </button>
    </div>

    <div className="my-[20px] rounded-xl border border-gray-200 p-[16px]">
     <div className="flex items-center gap-3">
      <Image src={Icon} alt={"upload"} width={40} height={40} />
      <div className="min-w-0 flex-1">
       <p className="truncate font-medium text-gray-900">{file?.name ?? "—"}</p>
       <p className="text-sm text-gray-500 flex gap-2">{sizeLabel} &nbsp;|&nbsp; <Image alt="upload" src={iconUpload} width={16} height={16} /> Uploading…</p>
      </div>
     </div>

     <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
      <div className="h-2 rounded-full bg-brand-500 transition-all" style={{ width: `${progress}%` }} />
     </div>

     <div className="mt-2 text-right text-sm text-gray-600">{progress}%</div>
    </div>

    <div className="mt-5 flex justify-end">
     <Button variant="outline" className="border-gray-300 w-full" onClick={onCancel}>
      Cancel
     </Button>
    </div>
   </div>
  </div>
 );
}
