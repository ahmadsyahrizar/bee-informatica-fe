"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import useCaseDetail from "@/hooks/useCaseDetail";
import { useParams } from "next/navigation";
import { SalesReportResponse } from "@/types/api/evaluation.type";
import { mapFinancialDataToStats } from "@/lib/utils/mapSalesReport";

export default function SalesReport({
 className,
}: {
 className?: string;
}) {
 const { id } = useParams()
 const { data } = useCaseDetail<SalesReportResponse>({ caseId: id as string, type: "sales" })
 const stats = data ? mapFinancialDataToStats(data) : []


 return (
  <section id="sales-report" className={cn("space-y-12 scroll-mt-28 lg:scroll-mt-32", className)}>
   <h3 className="text-20 font-semibold text-gray-900">Sales Report</h3>

   <div className="rounded-xl border border-gray-200 bg-white/70 p-16">
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-7">
     {stats.map((s, i) => (
      <div
       key={i}
      >
       <div className="text-14 text-gray-500">{s.label}</div>
       <div className="mt-4 text-16 font-semibold text-gray-900">
        {s.value}
       </div>
      </div>
     ))}
    </div>
   </div>
  </section>
 );
}
