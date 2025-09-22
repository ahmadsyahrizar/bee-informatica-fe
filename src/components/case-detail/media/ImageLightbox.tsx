"use client";

import * as React from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Trash2, X } from "lucide-react";

export type LightboxItem = { id: string | number; url: string; title?: string };

export function ImageLightbox({
 items,
 index,
 open,
 onOpenChange,
 onIndexChange,
 onDelete, // optional
 title = "Photos",
}: {
 items: LightboxItem[];
 index: number;                       // current index
 open: boolean;
 onOpenChange: (open: boolean) => void;
 onIndexChange: (nextIndex: number) => void;
 onDelete?: (item: LightboxItem) => void;
 title?: string;
}) {
 const total = items.length;
 const item = items[index];

 const prev = () => onIndexChange((index - 1 + total) % total);
 const next = () => onIndexChange((index + 1) % total);

 return (
  <Dialog open={open} onOpenChange={onOpenChange}>
   <DialogContent className="max-w-[1100px] p-0 overflow-hidden border-0 bg-transparent">
    {/* top bar */}
    <div className="flex items-center justify-between px-6 pt-4 text-white">
     <div className="text-sm">{title}</div>
     <div className="text-xs opacity-80">{total ? `${index + 1} / ${total}` : ""}</div>
     <div className="flex items-center gap-3">
      {onDelete && item ? (
       <Button
        variant="ghost"
        size="sm"
        className="text-red-300 hover:text-red-400 hover:bg-white/10"
        onClick={() => onDelete(item)}
       >
        <Trash2 className="h-4 w-4 mr-1" /> Delete
       </Button>
      ) : null}
      <Button
       variant="ghost"
       size="icon"
       className="text-white hover:bg-white/10"
       onClick={() => onOpenChange(false)}
      >
       <X className="h-5 w-5" />
      </Button>
     </div>
    </div>

    {/* stage */}
    <div className="relative mx-auto my-4 aspect-[4/3] w-[92vw] max-w-[1000px] rounded-xl bg-[#0f172a]">
     {item ? (
      <Image
       src={item.url}
       alt={item.title || "preview"}
       fill
       className="object-contain"
       sizes="100vw"
       priority
      />
     ) : null}

     {/* nav buttons */}
     {total > 1 ? (
      <>
       <button
        className="absolute left-4 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        onClick={prev}
       >
        <ChevronLeft className="h-5 w-5" />
       </button>
       <button
        className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
        onClick={next}
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