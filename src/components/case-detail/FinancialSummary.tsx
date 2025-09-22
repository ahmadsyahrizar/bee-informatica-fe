"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import KV from "./KV";

const dataInsights =
 [
  {
   title: "Cash Flow Health",
   desc: "Total net cash flow = –18,179 RM, with 2 months strongly negative (Jan, Mar)",
   bgColor: 'bg-success-50'
  },
  {
   title: "Cash Flow Health",
   desc: "Total net cash flow = –18,179 RM, with 2 months strongly negative (Jan, Mar)",
   bgColor: 'bg-success-50'
  },
  {
   title: "Cash Flow Health",
   desc: "Total net cash flow = –18,179 RM, with 2 months strongly negative (Jan, Mar)",
   bgColor: 'bg-error-50'
  },
  {
   title: "Cash Flow Health",
   desc: "Total net cash flow = –18,179 RM, with 2 months strongly negative (Jan, Mar)",
   bgColor: 'bg-error-50'
  },
  {
   title: "Cash Flow Health",
   desc: "Total net cash flow = –18,179 RM, with 2 months strongly negative (Jan, Mar)",
   bgColor: 'bg-gray-50'
  },
  {
   title: "Cash Flow Health",
   desc: "Total net cash flow = –18,179 RM, with 2 months strongly negative (Jan, Mar)",
   bgColor: 'bg-gray-50'
  }
 ]

export function FinancialSummary() {
 const rows = [
  { m: "December 2024", a: "118,902.03", b: "112,056.89", c: "6,845.14", d: "29,486.35", e: "19.03" },
  { m: "January 2025", a: "127,000.00", b: "142,058.09", c: "-14,587.55", d: "14,908.80", e: "9.62" },
  { m: "February 2025", a: "102,880.77", b: "102,447.98", c: "432.79", d: "15,341.59", e: "9.90" },
 ];
 return (
  <section className="mt-24">
   <div className="mb-12 text-14 font-semibold text-gray-900">AI Financial Summary ✨</div>
   <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
    <Table>
     <TableHeader>
      <TableRow className="bg-gray-50 h-[42px] text-gray-500 text-12">
       <TableHead className="pl-12">Month</TableHead>
       <TableHead className="pl-12">Cash in (A)</TableHead>
       <TableHead className="pl-12">Cash Out (B)</TableHead>
       <TableHead className="pl-12">Net (C) (A-B)</TableHead>
       <TableHead className="pl-12">Balance (D)</TableHead>
       <TableHead className="pl-12">Buffer</TableHead>
      </TableRow>
     </TableHeader>
     <TableBody >
      {rows.map((r, i) => (
       <TableRow className="h-64" key={i}>
        <TableCell className=" pl-12 whitespace-nowrap">{r.m}</TableCell>
        <TableCell className="pl-12 text-14">{r.a} <span className="text-gray-500">RM</span></TableCell>
        <TableCell className="pl-12 text-14">{r.b} <span className="text-gray-500">RM</span></TableCell>
        <TableCell className="pl-12 text-14">{r.c} <span className="text-gray-500">RM</span></TableCell>
        <TableCell className="pl-12 text-14">{r.d} <span className="text-gray-500">RM</span></TableCell>
        <TableCell className="pl-12 text-14">{r.e}</TableCell>
       </TableRow>
      ))}
     </TableBody>
    </Table>
   </div>

   {/* Insight tiles */}
   <div className="mt-16 grid grid-cols-12 gap-12">
    {dataInsights.map(({ bgColor, desc, title }, i) => (
     <div key={i} className="col-span-12 md:col-span-6 xl:col-span-4">
      <KV label={title} bgColor={bgColor} value={desc} />
     </div>
    ))}
   </div>
  </section>
 );
}