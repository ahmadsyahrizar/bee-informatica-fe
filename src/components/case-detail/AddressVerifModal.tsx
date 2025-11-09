import * as React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/skeletons/Skeleton";
import GetAppVerificationDocs from "@/services/GetAppVerificationDocs";
import { useSession } from "next-auth/react";
import { DocumentListResponse } from "@/types/api/get-app-verification-doc.type";

export default function AddressVerificationModal({
 open,
 onOpenChange,
}: {
 open: boolean;
 onOpenChange: (v: boolean) => void;
}) {
 const { id } = useParams();
 const caseId = id as string;
 // @ts-expect-error rija
 const accessToken = useSession()?.data?.accessToken ?? ""
 const { data: docList, isPending } = useQuery<{ data: DocumentListResponse[] }>({
  queryKey: ["addressVerificationDocs", caseId],
  enabled: open && !!caseId && !!accessToken,
  queryFn: async () => {
   const res = await GetAppVerificationDocs<{ data: DocumentListResponse[] }>({
    accessToken,
    caseId,
   });
   return (res as any).data ?? [];
  },
  staleTime: 1000 * 60 * 2,
 });

 const SkeletonBlock = () => (
  <div className="flex flex-col gap-2">
   <Skeleton className="h-3 w-3/4" />
   <Skeleton className="h-3 w-5/6" />
   <Skeleton className="h-3 w-4/5" />
   <Skeleton className="h-3 w-2/3" />
  </div>
 );

 const renderDocOrFallback = (data: DocumentListResponse) => {

  if (isPending) {
   return <SkeletonBlock />
  }

  return (
   <Card className="p-16 border-gray-200 bg-gray-50 shadow-none">
    <div className="text-16 font-semibold text-gray-900 mb-3">{data.description}</div>
    <div className="rounded-lg border bg-white p-16 text-sm text-gray-900 h-[160px] overflow-auto">
     <div className="animate-fade-in">
      <div className="text-sm break-words">
       <a
        href={data.url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-blue-600"
       >
        Open document
       </a>
      </div>
     </div>
    </div>
   </Card>
  );
 };

 return (
  <Dialog open={open} onOpenChange={onOpenChange}>
   <DialogContent className="max-w-[1080px] md:max-w-[1120px] bg-white p-24">
    <DialogHeader>
     <div className="flex items-center gap-3 mb-20">
      <DialogTitle>Address Verification</DialogTitle>
     </div>
    </DialogHeader>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
     {docList?.data?.map((data, idx) => <div key={idx}> {renderDocOrFallback(data)}</div>)}
    </div>
   </DialogContent>
  </Dialog >
 );
} 
