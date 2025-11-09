"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { ImageLightbox } from "./ImageLightbox";
import { Photo } from "@/types/api/social-media.type";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import CreatePhotoMetaData from "@/services/CreatePhotoMetada";
import GetSignedUrl from "@/services/GetSignedUrl";
import { toast } from "sonner";

export function PhotosSection({
 title = "Photos",
 photos,
 caseId,
 onUploadClick,
}: {
 title?: string;
 photos: Photo[];
 caseId: string;
 onUploadClick?: () => void;
}) {
 const { data: sessionData } = useSession();
 const accessToken = (sessionData as any)?.accessToken ?? (sessionData as any)?.access_token ?? "";

 const queryClient = useQueryClient();

 // lightbox state
 const [open, setOpen] = React.useState(false);
 const [index, setIndex] = React.useState(0);
 const openAt = (i: number) => {
  setIndex(i);
  setOpen(true);
 };

 // file input
 const fileInputRef = React.useRef<HTMLInputElement | null>(null);
 const triggerFilePick = () => {
  if (onUploadClick) {
   onUploadClick();
   return;
  }
  fileInputRef.current?.click();
 };

 // metadata creation mutation
 const createPhotoMeta = useMutation({
  mutationFn: async (body: { filename: string; mime: string; key: string }) =>
   CreatePhotoMetaData({ accessToken, caseId, body }),
  onSuccess: () => {
   queryClient.invalidateQueries({ queryKey: ["caseDetail", "social_media", caseId] });
   toast?.success?.("Upload success");
  },
  onError: (err: any) => {
   console.error("create metadata failed", err);
   toast?.error?.("Failed to register photo metadata");
  },
 });

 // PUT signed url (same as before)
 async function getPutSignedUrl(file: File) {
  const endpoint = `https://afrvt5jbsq.ap-northeast-1.awsapprunner.com/api/applications/${caseId}/photo/put-signed-url`;
  const res = await fetch(endpoint, {
   method: "POST",
   headers: {
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
   },
   body: JSON.stringify({ filename: file.name, mime: file.type }),
  });
  if (!res.ok) {
   const text = await res.text();
   throw new Error(`Signed URL request failed: ${res.status} ${text}`);
  }
  const json = await res.json();
  return json.data; // { url, key }
 }

 async function uploadToSignedUrl(putUrl: string, file: File) {
  const res = await fetch(putUrl, {
   method: "PUT",
   headers: {
    "Content-Type": file.type,
   },
   body: file,
  });
  if (!res.ok) {
   const text = await res.text();
   throw new Error(`Upload to signed URL failed: ${res.status} ${text}`);
  }
  return res;
 }

 const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
   const { url: putUrl, key } = await getPutSignedUrl(file);
   await uploadToSignedUrl(putUrl, file);
   await createPhotoMeta.mutateAsync({ filename: file.name, mime: file.type, key });
   e.currentTarget.value = "";
  } catch (err: any) {
   console.error("upload error", err);
   toast?.error?.(err?.message || "Upload failed");
  }
 };

 // UI logic for thumbnails 
 const MAX_VISIBLE = 4;
 const visiblePhotos = photos?.slice(0, MAX_VISIBLE) ?? [];
 const remainingCount = Math.max(0, (photos?.length ?? 0) - MAX_VISIBLE);

 function Thumbnail({ p, i }: { p: Photo; i: number }) {
  const { data } = useQuery({
   queryKey: ["photoGetUrl", caseId, p.key],
   queryFn: async () => {
    const res = await GetSignedUrl({
     accessToken,
     caseId,
     body: { key: p.key },
    });

    if (res && (res as any).data) {
     return (res as any).data as string;
    }
    if ((res as any).url && typeof (res as any).url === "string") return (res as any).url;
    throw new Error("GetSignedUrl returned unexpected shape");
   },
   enabled: !!p.key, // important: only run when p.key exists
  }
  );

  const isLastVisible = i === MAX_VISIBLE - 1;
  const signedUrl = data?.data ?? null;

  return (
   <div key={p.key ?? `${i}`} className="relative aspect-[4/3] w-[220px] min-w-[220px] overflow-hidden rounded-2xl">
    <button onClick={() => openAt(i)} className="absolute inset-0" title="Preview" />

    {signedUrl && <Image src={signedUrl} alt={p.filename || `photo-${i}`} fill className="object-cover" sizes="33vw" priority={i === 0} />}

    {isLastVisible && remainingCount > 0 && (
     <button
      onClick={() => openAt(i)}
      className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xl font-semibold"
      aria-label={`Open gallery, plus ${remainingCount} more`}
     >
      +{remainingCount} More
     </button>
    )}
   </div>
  );
 }


 return (
  <section id="photos" className="mt-[32px] scroll-mt-28 lg:scroll-mt-32">
   <div className="mb-16 flex items-center justify-between">
    <h3 className="text-[18px] font-semibold">{title}</h3>
    <div>
     <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />

     {photos?.length ? <Button variant="outline" className="gap-2" onClick={triggerFilePick}>
      <Upload className="size-16" /> Upload
     </Button> : ''}
    </div>
   </div>

   {!photos || photos.length === 0 ? (
    <div className="rounded-2xl bg-slate-100 p-8">
     <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="text-slate-500">No photos yet</div>
      <Button variant="ghost" onClick={triggerFilePick} className="gap-2">
       <Upload className="size-16" /> Upload
      </Button>
     </div>
    </div>
   ) : (
    <div className="flex gap-3 overflow-x-auto rounded-2xl">
     {visiblePhotos.map((p, i) => (
      <Thumbnail key={p.key ?? `${i}`} p={p} i={i} />
     ))}
    </div>
   )}

   <ImageLightbox
    title="Photos"
    items={photos}
    index={index}
    open={open}
    onOpenChange={setOpen}
    onIndexChange={setIndex}
    caseId={caseId}
    accessToken={accessToken}
   />
  </section>
 );
}
