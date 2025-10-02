"use client";

import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { ImageLightbox, LightboxItem } from "./ImageLightbox";

export type PhotoItem = LightboxItem;

export function PhotosSection({
 title = "Photos",
 photos,
 onUploadClick,
 onDeletePhoto, // optional  
}: {
 title?: string;
 photos: PhotoItem[];
 onUploadClick?: () => void;
 onDeletePhoto?: (photo: PhotoItem) => void;
 className?: string;
}) {
 const [open, setOpen] = React.useState(false);
 const [index, setIndex] = React.useState(0);

 const openAt = (i: number) => {
  setIndex(i);
  setOpen(true);
 };

 return (
  <section id="photos" className="mt-[32px] scroll-mt-28 lg:scroll-mt-32">
   <div className="mb-16 flex items-center justify-between">
    <h3 className="text-[18px] font-semibold">{title}</h3>
    <Button variant="outline" className="gap-2" onClick={onUploadClick}>
     <Upload className="size-16" /> Upload
    </Button>
   </div>

   {/* horizontal strip */}
   <div className="flex gap-3 overflow-x-auto rounded-2xl">
    {photos.map((p, i) => (
     <button
      key={p.id}
      onClick={() => openAt(i)}
      className="relative aspect-square w-[200px] overflow-hidden rounded-2xl"
      title="Preview"
     >
      <Image src={p.url} alt={p.title || "photo"} fill className="object-cover" sizes="40vw" />
     </button>
    ))}
   </div>

   <ImageLightbox
    title="Photos"
    items={photos}
    index={index}
    open={open}
    onOpenChange={setOpen}
    onIndexChange={setIndex}
    onDelete={onDeletePhoto}
   />
  </section>
 );
}
