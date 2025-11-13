import * as React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Expand } from "lucide-react";
import { OtherDoc } from "@/types/api/social-media.type";
import dynamic from "next/dynamic";
import iconPDFdefault from "@/assets/icons/icon-pdf.png"

const PdfModal = dynamic(() => import("@/components/common/ModalPdf"), { ssr: false });

export function OtherDocumentsSection({
 title = "Other Documents",
 documents,
}: {
 title?: string;
 documents: OtherDoc[];
 className?: string;
}) {
 const [open, setOpen] = React.useState(false);
 const [index, setIndex] = React.useState(0);

 const openAt = (i: number) => {
  setIndex(i);
  setOpen(true);
 };

 const buildPdfApiUrl = (i: number) => {
  const doc = documents[i];
  return `/api/generate-pdf?url=${encodeURIComponent(doc?.url)}`;
 };


 return (
  <section id="documents" className="mb-[32px] mt-[32px] scroll-mt-28 lg:scroll-mt-32">
   <h3 className="text-[18px] font-semibold mb-12">{title}</h3>

   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
    {documents?.map(({ description, type, url }, id) => (
     <Card key={id} className="rounded-2xl shadow-sm p-16">
      <CardContent>
       <div className="flex items-center justify-between px-6 py-4">
        <div className="text-[16px] font-semibold">{description}</div>

        <div className="flex items-center gap-2">
         <div
          className="h-[20px] w-[20px]"
          onClick={() => openAt(id)}
          title="Preview"
         >
          <Expand className="w-[20px] h-[20px]" />
         </div>
        </div>
       </div>

       <div className="flex justify-center mt-12 pb-6 px-6">
        <button
         className="relative h-[175px] w-[460px] rounded-xl overflow-hidden ring-1 ring-slate-200 flex justify-center items-center"
         onClick={() => openAt(id)}
        >
         {url ? (
          <Image
           src={iconPDFdefault}
           alt={type || "document preview"}
           width={70}
           height={70}
           className="object-cover m-0"
          // sizes="50vw"
          />
         ) : (
          <div className="flex items-center justify-center h-full w-full">No preview</div>
         )}
        </button>
       </div>
      </CardContent>
     </Card>
    ))}
   </div>

   <PdfModal
    isOpen={open}
    onClose={() => setOpen(false)}
    pdfUrl={buildPdfApiUrl(index)}
    pdfFilename={documents?.[index]?.type ? `${documents[index].type}.pdf` : "document.pdf"}
   />
  </section>
 );
}
