import { useMutation } from "@tanstack/react-query";
import PutSignedTranscriptionUrl from "@/services/PutSignedUrlTranscription";
import SaveTranscriptionMetaData from "@/services/SaveTranscriptionMetadata";
import { uploadToS3WithProgress } from "@/lib/utils/uploadToS3";
import { PutSignedUrlResponseData } from "@/types/api/put-signed-url.type";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Stage } from "@/types/case";

type UseTranscriptionUploadParams = {
 accessToken: string;
 caseId: string | number;
 stage: Stage;
};

type UploadOptions = {
 reupload?: boolean;
};

export function useTranscriptionUpload({
 accessToken,
 caseId,
 stage,
}: UseTranscriptionUploadParams) {
 const [progress, setProgress] = useState(0);
 const [serverKey, setServerKey] = useState("");
 const [currentFile, setCurrentFile] = useState<File | null>(null);
 const abortRef = useRef<() => void>(() => { });

 const mutation = useMutation({
  mutationFn: async ({ file, reupload = false }: { file: File; reupload?: boolean }) => {
   setCurrentFile(file);
   setProgress(0);

   // 1) get presigned URL
   const request = await PutSignedTranscriptionUrl<{ data: PutSignedUrlResponseData }>({
    accessToken,
    caseId: String(caseId),
    body: {
     filename: file.name,
     mime: file.type || "application/octet-stream",
     type: stage,
    },
   });

   const { url = "", key = "" } = request.data?.data || {};
   if (!url) throw new Error("No presigned URL returned");
   if (key) setServerKey(key);

   // 2) Upload with progress
   const { promise, abort } = uploadToS3WithProgress(url, file, setProgress);
   abortRef.current = abort;
   await promise;

   // 3) Save metadata (include reupload flag if requested)
   const metaRes = await SaveTranscriptionMetaData({
    accessToken,
    caseId: String(caseId),
    body: {
     filename: file.name,
     mime: file.type || "application/octet-stream",
     type: stage,
     key,
     reupload,
    },
   });

   return metaRes;
  },
  onSuccess: () => {
   toast.success("Success upload file");
  },
  onError: (err) => {
   toast.error(`error upload file, reason: ${err?.message || err}`);
  },
  onSettled: () => {
   setProgress(0);
   setCurrentFile(null);
   abortRef.current = () => { };
  },
 });

 const cancel = () => {
  abortRef.current?.();
 };

 return {
  // uploadFile now accepts options
  uploadFile: (file: File, options?: UploadOptions) =>
   mutation.mutateAsync({ file, reupload: options?.reupload }),
  isUploading: mutation.isPending,
  progress,
  currentFile,
  serverKey,
  cancel,
  error: mutation.error as Error | null,
  data: mutation.data,
  reset: mutation.reset,
 };
}
