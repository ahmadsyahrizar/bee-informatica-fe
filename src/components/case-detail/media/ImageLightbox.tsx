"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Trash2, X } from "lucide-react";
import { Photo } from "@/types/api/social-media.type";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import GetSignedUrl from "@/services/GetSignedUrl";
import DeletePhotoMetaData from "@/services/DeletePhotoMetaData";
import { toast } from "sonner";

export function ImageLightbox({
 items,
 index,
 open,
 onOpenChange,
 onIndexChange,
 title = "Photos",
 caseId,
 accessToken,
}: {
 items: Photo[];
 index: number;
 open: boolean;
 onOpenChange: (open: boolean) => void;
 onIndexChange: (nextIndex: number) => void;
 title?: string;
 caseId: string;
 accessToken: string;
}) {
 const queryClient = useQueryClient();
 const [localItems, setLocalItems] = useState<Photo[]>(items ?? []);
 const [localIndex, setLocalIndex] = useState<number>(index ?? 0);

 useEffect(() => {
  setLocalItems(items ?? []);
 }, [items]);

 useEffect(() => {
  setLocalIndex(index);
 }, [index]);

 const total = localItems.length;
 const item = localItems[localIndex];

 const goPrev = () => {
  if (total <= 1) return;
  const nextIndex = (localIndex - 1 + total) % total;
  setLocalIndex(nextIndex);
  onIndexChange(nextIndex);
 };

 const goNext = () => {
  if (total <= 1) return;
  const nextIndex = (localIndex + 1) % total;
  setLocalIndex(nextIndex);
  onIndexChange(nextIndex);
 };

 const { data: signedUrlQuery, isPending, isError } = useQuery({
  queryKey: ["photoGetUrl", caseId, item?.key],
  queryFn: async () => {
   if (!item?.key) throw new Error("no key");
   const res = await GetSignedUrl({
    accessToken,
    caseId,
    body: { key: item.key },
   });
   if (res && (res as any).data) {
    return (res as any).data as string;
   }
   if ((res as any).url && typeof (res as any).url === "string") return (res as any).url;
   throw new Error("GetSignedUrl returned unexpected shape");
  },
  enabled: !!item?.key,
 });

 const deleteMutation = useMutation({
  mutationFn: async (body: { key: string }) => {
   return DeletePhotoMetaData({ accessToken, caseId, body });
  },
  // optimistic update
  onMutate: async (variables) => {
   const { key } = variables;
   await queryClient.cancelQueries({ queryKey: ["caseDetail", "social_media", caseId] });
   const previous = queryClient.getQueryData<any>(["caseDetail", "social_media", caseId]);
   queryClient.setQueryData(["caseDetail", "social_media", caseId], (old: any) => {
    if (!old) return old;
    const clone = JSON.parse(JSON.stringify(old));
    if (clone.data && Array.isArray(clone.data.photos)) {
     clone.data.photos = clone.data.photos.filter((p: any) => p.key !== key);
    } else if (Array.isArray(clone.photos)) {
     clone.photos = clone.photos.filter((p: any) => p.key !== key);
    }
    return clone;
   });

   const newLocal = localItems.filter((p) => p.key !== key);
   const prevLocal = localItems;
   setLocalItems(newLocal);

   // adjust localIndex so it points to a valid item
   if (newLocal.length === 0) {
    setLocalIndex(0);
   } else if (localIndex >= newLocal.length) {
    const nextIdx = newLocal.length - 1;
    setLocalIndex(nextIdx);
    onIndexChange(nextIdx);
   } else {
    onIndexChange(localIndex);
   }

   return { previous, prevLocal, removedKey: key };
  },
  onError: (err, variables, context: any | undefined) => {
   if (context?.previous) {
    queryClient.setQueryData(["caseDetail", "social_media", caseId], context.previous);
   }
   if (context?.prevLocal) {
    setLocalItems(context.prevLocal);
   }
   toast?.error?.("Failed to delete photo");
   console.error("delete error", err);
  },
  onSettled: async () => {
   await queryClient.invalidateQueries({ queryKey: ["caseDetail", "social_media", caseId] });
  },
  onSuccess: () => {
   toast?.success?.("Photo deleted");
   if (localItems.length <= 1) {
    onOpenChange(false);
   }
  },
 });

 const onDelete = async () => {
  if (!item?.key) {
   toast?.error?.("No photo selected");
   return;
  }

  try {
   await deleteMutation.mutateAsync({ key: item.key });
  } catch (e) {
   // handled in onError
  }
 };

 const signedUrl = signedUrlQuery?.data ?? null;
 React.useEffect(() => {
  onIndexChange(localIndex);
 }, [localIndex]);

 return (
  <Dialog open={open} onOpenChange={onOpenChange}>
   <DialogContent className="max-w-[1100px] p-0 overflow-hidden border-0 bg-transparent">
    {/* top bar */}
    <div className="flex items-center justify-between px-6 pt-4 text-white">
     <div className="text-sm">{title}</div>
     <div className="text-xs opacity-80">{total ? `${localIndex + 1} / ${total}` : ""}</div>
     <div className="flex items-center gap-3">
      {item ? (
       <Button
        variant="ghost"
        size="sm"
        className="p-16 text-red-300 hover:text-red-400 hover:bg-white/10"
        onClick={onDelete}
        disabled={deleteMutation.isPending}
       >
        <Trash2 className="size-20 mr-1" /> {deleteMutation.isPending ? "Deleting..." : "Delete"}
       </Button>
      ) : null}
      <Button
       variant="ghost"
       size="icon"
       className="text-white hover:bg-white/10"
       onClick={() => onOpenChange(false)}
      >
       <X className="size-20" />
      </Button>
     </div>
    </div>

    {/* image area */}
    <div className="relative mx-auto my-4 aspect-[4/3] w-[92vw] max-w-[1000px] rounded-xl bg-[#0f172a]">
     {isPending ? (
      <div className="flex h-full w-full items-center justify-center text-white">Loading…</div>
     ) : isError ? (
      <div className="flex h-full w-full items-center justify-center text-white">Failed to load image</div>
     ) : signedUrl ? (
      <Image
       src={signedUrl}
       alt={item?.filename || "preview"}
       fill
       className="object-contain"
       sizes="100vw"
       priority
      />
     ) : (
      <div className="flex h-full w-full items-center justify-center text-white">No image</div>
     )}

     {/* nav buttons */}
     {total > 1 ? (
      <>
       <button
        className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        onClick={goPrev}
        aria-label="previous"
        type="button"
       >
        <ChevronLeft className="h-5 w-5" />
       </button>
       <button
        className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        onClick={goNext}
        aria-label="next"
        type="button"
       >
        <ChevronRight className="h-5 w-5" />
       </button>
      </>
     ) : null}
    </div>
   </DialogContent>
  </Dialog>
 );
}
