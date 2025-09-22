"use client";

import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Expand } from "lucide-react";
import { ImageLightbox, LightboxItem } from "./ImageLightbox";

export type DocumentItem = LightboxItem & {
 label: string;           // e.g. "Business License"
 thumbUrl: string;        // card preview (can be same as url)
 actions?: React.ReactNode;
};

export function OtherDocumentsSection({
 title = "Other Documents",
 documents,
 className = "",
 onDeleteDocument, // optional
}: {
 title?: string;
 documents: DocumentItem[];
 className?: string;
 onDeleteDocument?: (doc: DocumentItem) => void;
}) {
 const [open, setOpen] = React.useState(false);
 const [index, setIndex] = React.useState(0);

 const items: LightboxItem[] = documents.map(({ id, url, label }) => ({ id, url, title: label }));

 const openAt = (i: number) => {
  setIndex(i);
  setOpen(true);
 };

 return (
  <section className={className + " mt-[32px]"} >
   <h3 className="text-[18px] font-semibold mb-4">{title}</h3>

   <div className="grid grid-cols-1 lg:grid-cols-2  gap-8">
    {documents.map((doc, i) => (
     <Card key={doc.id} className="rounded-2xl shadow-sm p-16">
      <CardContent>
       {/* header */}
       <div className="flex items-center justify-between px-6 py-4">
        <div className="text-[16px] font-semibold">{doc.label}</div>

        <div className="flex items-center gap-2">
         {doc.actions}
         <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => openAt(i)}
          title="Preview"
         >
          <Expand className="size-20" />
         </Button>
        </div>
       </div>

       {/* image */}
       <div className="flex justify-center mt-12 pb-6 px-6">
        <button
         className="relative h-[175px] w-[460px] rounded-xl overflow-hidden ring-1 ring-slate-200"
         onClick={() => openAt(i)}
        >
         <Image
          src={doc.thumbUrl || doc.url}
          alt={doc.label}
          fill
          className="object-cover m-0"
          sizes="50vw"
         />
        </button>
       </div>
      </CardContent>
     </Card>
    ))}
   </div>

   <ImageLightbox
    title="Documents"
    items={items}
    index={index}
    open={open}
    onOpenChange={setOpen}
    onIndexChange={setIndex}
    onDelete={onDeleteDocument}
   />
  </section >
 );
}       