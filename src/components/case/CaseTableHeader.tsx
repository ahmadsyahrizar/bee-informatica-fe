"use client";

import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const CaseTableHeader = () => (
 <TableHeader className="bg-gray-50 border-gray-200 h-[44px]">
  <TableRow>
   <TableHead className="text-[12px] w-[25%] text-gray-500 font-semibold">Case</TableHead>
   <TableHead className="text-[12px] w-[25%] text-gray-500 font-semibold">Score</TableHead>
   <TableHead className="text-[12px] w-[25%] text-gray-500 font-semibold">Stage</TableHead>
   <TableHead className="text-[12px] w-[25%] text-gray-500 font-semibold">Schedule</TableHead>
   <TableHead className="text-[12px] w-[25%] text-right text-gray-500 font-semibold"></TableHead>
  </TableRow>
 </TableHeader>
);   
