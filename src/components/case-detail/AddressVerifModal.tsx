"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";

export default function AddressVerificationModal({
 open,
 onOpenChange,
}: {
 open: boolean;
 onOpenChange: (v: boolean) => void;
}) {
 return (
  <Dialog open={open} onOpenChange={onOpenChange}>
   <DialogContent className="max-w-[1080px] md:max-w-[1120px] bg-white p-24">
    <DialogHeader>
     <div className="flex items-center gap-3 mb-20">
      <DialogTitle>Address Verification</DialogTitle>
     </div>
    </DialogHeader>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
     {/* Utility Bills */}
     <Card className="p-16 border-gray-200 bg-gray-50 shadow-none">
      <div className="text-16 font-semibold text-gray-900 mb-3">Utility Bills Address</div>
      <div className="rounded-lg border bg-white p-16 text-sm text-gray-900 h-[160px] overflow-auto">
       ALAMAT POS<br />
       IFFAT RESOURCES SDN. BHD.<br />
       G-9, JALAN DAGANG B/3A<br />
       TAMAN DAGANG<br />
       68000 AMPANG<br />
       SELANGOR
      </div>
     </Card>

     {/* SSM */}
     <Card className="p-16 border-gray-200 bg-gray-50 shadow-none">
      <div className="text-16 font-semibold text-gray-900 mb-3">SSM</div>
      <div className="rounded-lg border bg-white p-16 text-sm text-gray-900 h-[160px] overflow-auto">
       <div>Address</div>
       LOT G-9, JALAN DAGANG B/3A,<br />
       TAMAN DAGANG,<br />
       AMPANG<br />
       68000
      </div>
     </Card>

     {/* License */}
     <Card className="p-16 border-gray-200 bg-gray-50 shadow-none">
      <div className="text-16 font-semibold text-gray-900 mb-3">License</div>
      <div className="rounded-lg border bg-white p-16 text-sm text-gray-900 h-[160px] overflow-auto">
       NAMA PEMILIK : IFFAT RESOURCES SDN. BHD. (1380254-A)<br />
       ALAMAT : G9, JALAN DAGANG B/3A, TAMAN DAGANG<br />
       68000 AMPANG, SELANGOR DARUL EHSAN<br />
       TARIKH TAMAT : 31 DISEMBER
      </div>
     </Card>

     {/* CTOS */}
     <Card className="p-16 border-gray-200 bg-gray-50 shadow-none">
      <div className="text-16 font-semibold text-gray-900 mb-3">CTOS</div>
      <div className="rounded-lg border bg-white p-16 text-sm text-gray-900 h-[160px] overflow-auto">
       <div className="font-medium">Business Address</div>
       LOT G-9, JALAN DAGANG B/3A, TAMAN DAGANG, AMPANG 68000 SELANGOR
      </div>
     </Card>
    </div>
   </DialogContent>
  </Dialog>
 );
}
