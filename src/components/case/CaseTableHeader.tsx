"use client";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const CaseTableHeader = () => (
 <TableHeader className="bg-gray-50 border-gray-200 h-[44px]">
  <TableRow>
   <TableHead className="text-[12px] text-gray-500 font-semibold w-[28%]">
    Application
   </TableHead>

   <TableHead className="text-[12px] text-gray-500 font-semibold w-[10%] text-left">
    Score
   </TableHead>

   <TableHead className="text-[12px] text-gray-500 font-semibold w-[14%]">
    Stage
   </TableHead>

   <TableHead className="text-[12px] text-gray-500 font-semibold w-[14%] text-left">
    Applied Loan Amount
   </TableHead>

   <TableHead className="text-[12px] text-gray-500 font-semibold w-[16%] text-left">
    Approved Loan Amount
   </TableHead>

   <TableHead className="text-[12px] text-gray-500 font-semibold w-[14%]">
    Registered at
   </TableHead>

   <TableHead className="text-[12px] text-left text-gray-500 font-semibold w-[14%]">
    {/* actions */}
   </TableHead>
  </TableRow>
 </TableHeader>
);
