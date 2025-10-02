// components/case-detail/SalesReport.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils"; // if you have it; otherwise remove cn & className prop

type Stat = {
 label: string;
 value: React.ReactNode;
 hint?: string; // optional small helper text
};

export default function SalesReport({
 stats,
 className,
}: {
 stats: Stat[];
 className?: string;
}) {
 return (
  <section id="sales-report" className={cn("space-y-12 scroll-mt-28 lg:scroll-mt-32", className)}>
   <h3 className="text-20 font-semibold text-gray-900">Sales Report</h3>

   <div className="rounded-xl border border-gray-200 bg-white/70 p-16">
    {/* equal columns, responsive wrap */}
    <div className="grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-7">
     {stats.map((s, i) => (
      <div
       key={i}
      // className="min-w-0 rounded-lg"
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
