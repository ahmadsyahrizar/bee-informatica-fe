"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import KV from "./KV";
import { AiGradientHeading } from "./GradientHeading";
import type { FinancialSummary, MetaData } from "@/types/api/ai-highlight.type";
import formatCurrency from "@/lib/utils/formatCurrencyRM";

interface DataInsight {
 title: string;
 desc: string;
 bgColor: string;
}

/**
 * Converts MetaData API response to UI-friendly dataInsights array.
 */
export function mapMetaToInsights(meta?: MetaData): DataInsight[] {
 const getBgColor = (identifier: string): string => {
  switch (identifier) {
   case "positive":
    return "bg-success-50";
   case "neutral":
    return "bg-gray-50";
   case "negative":
    return "bg-error-50";
   default:
    return "bg-gray-50";
  }
 };

 return [
  {
   title: "Cash Flow Health",
   desc: meta?.cash_flow_health || "",
   bgColor: getBgColor(meta?.cash_flow_health_identifier || ""),
  },
  {
   title: "Ending Balance Consistency",
   desc: meta?.ending_balance_consistency || "",
   bgColor: getBgColor(meta?.ending_balance_consistency_identifier || ""),
  },
  {
   title: "Cash In Consistency",
   desc: meta?.cash_in_consistency || "",
   bgColor: getBgColor(meta?.cash_in_consistency_identifier || ""),
  },
  {
   title: "High Inflow Month",
   desc: meta?.high_inflow_month || "",
   bgColor: getBgColor(meta?.high_inflow_month_identifier || ""),
  },
  {
   title: "Low Inflow Month",
   desc: meta?.low_inflow_month || "",
   bgColor: getBgColor(meta?.low_inflow_month_identifier || ""),
  },
  {
   title: "Net Cashflow",
   desc: meta?.net_cashflow || "",
   bgColor: getBgColor(meta?.net_cashflow_identifier || ""),
  },
 ];
}


export function FinancialSummary({ data, insight }: { insight?: MetaData, data: FinancialSummary[] }) {

 const dataInsights = mapMetaToInsights(insight)

 return (
  <section className="mt-24 scroll-mt-28 lg:scroll-mt-32" id="ai-financial-summary">
   <AiGradientHeading id="ai-highlight">AI Financial Summary</AiGradientHeading>
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
      {data?.map((row, i) => (
       <TableRow className="h-64" key={i}>
        <TableCell className=" pl-12 whitespace-nowrap">{row.month}</TableCell>
        <TableCell className="pl-12 text-14">{formatCurrency(row.cash_in)} <span className="text-gray-500">RM</span></TableCell>
        <TableCell className="pl-12 text-14">{formatCurrency(row.cash_out)} <span className="text-gray-500">RM</span></TableCell>
        <TableCell className="pl-12 text-14">{formatCurrency(row.net_cash)} <span className="text-gray-500">RM</span></TableCell>
        <TableCell className="pl-12 text-14">{formatCurrency(row.balance)} <span className="text-gray-500">RM</span></TableCell>
        <TableCell className="pl-12 text-14">{formatCurrency(row.buffer)}</TableCell>
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