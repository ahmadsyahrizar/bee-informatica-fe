"use client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import KV from "./KV";
import { AiGradientHeading } from "./GradientHeading";
import type { FinancialSummary, MetaData } from "@/types/api/ai-highlight.type";
import formatCurrency from "@/lib/utils/formatCurrencyRM";

interface DataInsight {
   title: string;
   desc: string;
   bgColor: string;
}

interface FinancialMeta {
   installment_period?: number;
   total_cash_in_a?: number;
   total_cash_out_b?: number;
   average_net_c?: number;
   total_balance_d?: number;
   average_cash_in_a?: number;
   average_cash_out_b?: number;
   net_c?: number;
   balance_d?: number;
   buffer?: number;
   limitation_of_loan_size?: number;
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

export function FinancialSummary({
   data,
   insight,
   financialMeta,
}: {
   insight?: MetaData;
   data: FinancialSummary[];
   financialMeta?: FinancialMeta;
}) {
   // helper to safely compute numeric aggregates
   const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
   const numericArr = (field: keyof FinancialSummary) =>
      data?.map((d) => Number(d[field] ?? 0)).filter((v) => !Number.isNaN(v));

   // computed totals from data
   const totalCashIn = numericArr("cash_in").length > 0 ? sum(numericArr("cash_in")) : undefined;
   const totalCashOut = numericArr("cash_out").length > 0 ? sum(numericArr("cash_out")) : undefined;
   const totalNet = numericArr("net_cash").length > 0 ? sum(numericArr("net_cash")) : undefined;
   const totalBalance = numericArr("balance").length > 0 ? sum(numericArr("balance")) : undefined;

   // computed averages from data
   const avgCashIn =
      numericArr("cash_in").length > 0 ? totalCashIn! / numericArr("cash_in").length : undefined;
   const avgCashOut =
      numericArr("cash_out").length > 0 ? totalCashOut! / numericArr("cash_out").length : undefined;
   const avgNet =
      numericArr("net_cash").length > 0 ? totalNet! / numericArr("net_cash").length : undefined;
   const avgBalance =
      numericArr("balance").length > 0 ? totalBalance! / numericArr("balance").length : undefined;

   // fallback to financialMeta values if provided and non-zero (or defined)
   const displayTotalCashIn =
      typeof financialMeta?.total_cash_in_a === "number" && !Number.isNaN(financialMeta.total_cash_in_a)
         ? financialMeta.total_cash_in_a
         : totalCashIn;
   const displayTotalCashOut =
      typeof financialMeta?.total_cash_out_b === "number" && !Number.isNaN(financialMeta.total_cash_out_b)
         ? financialMeta.total_cash_out_b
         : totalCashOut;
   const displayTotalNet =
      typeof financialMeta?.net_c === "number" && !Number.isNaN(financialMeta.net_c)
         ? financialMeta.net_c
         : totalNet;
   const displayTotalBalance =
      typeof financialMeta?.total_balance_d === "number" && !Number.isNaN(financialMeta.total_balance_d)
         ? financialMeta.total_balance_d
         : totalBalance;

   const displayAvgCashIn =
      typeof financialMeta?.average_cash_in_a === "number" && !Number.isNaN(financialMeta.average_cash_in_a)
         ? financialMeta.average_cash_in_a
         : avgCashIn;
   const displayAvgCashOut =
      typeof financialMeta?.average_cash_out_b === "number" && !Number.isNaN(financialMeta.average_cash_out_b)
         ? financialMeta.average_cash_out_b
         : avgCashOut;
   const displayAvgNet =
      typeof financialMeta?.average_net_c === "number" && !Number.isNaN(financialMeta.average_net_c)
         ? financialMeta.average_net_c
         : avgNet;
   const displayAvgBalance =
      typeof financialMeta?.balance_d === "number" && !Number.isNaN(financialMeta.balance_d)
         ? financialMeta.balance_d
         : avgBalance;

   const displayBuffer =
      typeof financialMeta?.buffer === "number" && !Number.isNaN(financialMeta.buffer)
         ? financialMeta.buffer
         : undefined;

   const displayLimitation =
      typeof financialMeta?.limitation_of_loan_size === "number" && !Number.isNaN(financialMeta.limitation_of_loan_size)
         ? financialMeta.limitation_of_loan_size
         : undefined;

   const formatOrDash = (val: number | undefined | null) => (val === undefined || val === null ? "-" : formatCurrency(val));

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
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {data?.map((row, i) => (
                     <TableRow className="h-64" key={i}>
                        <TableCell className=" pl-12 whitespace-nowrap">{row.month}</TableCell>
                        <TableCell className="pl-12 text-14">{formatCurrency(row.cash_in)}</TableCell>
                        <TableCell className="pl-12 text-14">{formatCurrency(row.cash_out)}</TableCell>
                        <TableCell className="pl-12 text-14">{formatCurrency(row.net_cash)}</TableCell>
                        <TableCell className="pl-12 text-14">{formatCurrency(row.balance)}</TableCell>
                     </TableRow>
                  ))}

                  {/* Total row (bg like Average) */}
                  <TableRow className="h-64 bg-gray-50">
                     <TableCell className="pl-12 font-bold">TOTAL</TableCell>
                     <TableCell className="pl-12 text-14 font-bold">{formatOrDash(displayTotalCashIn as number | undefined)}</TableCell>
                     <TableCell className="pl-12 text-14 font-bold">{formatOrDash(displayTotalCashOut as number | undefined)}</TableCell>
                     <TableCell className="pl-12 text-14 font-bold">{formatOrDash(displayTotalNet as number | undefined)}</TableCell>
                     <TableCell className="pl-12 text-14 font-bold">{formatOrDash(displayTotalBalance as number | undefined)}</TableCell>
                  </TableRow>

                  {/* Average row (bg) */}
                  <TableRow className="h-64 bg-gray-50">
                     <TableCell className="pl-12 font-bold">Average</TableCell>
                     <TableCell className="pl-12 text-14 font-bold">
                        {displayAvgCashIn !== null && displayAvgCashIn !== undefined ? formatCurrency(displayAvgCashIn) : "-"}
                     </TableCell>
                     <TableCell className="pl-12 text-14 font-bold">
                        {displayAvgCashOut !== null && displayAvgCashOut !== undefined ? formatCurrency(displayAvgCashOut) : "-"}
                     </TableCell>
                     <TableCell className="pl-12 text-14 font-bold">
                        {displayAvgNet !== null && displayAvgNet !== undefined ? formatCurrency(displayAvgNet) : "-"}
                     </TableCell>
                     <TableCell className="pl-12 text-14 font-bold">
                        {displayAvgBalance !== null && displayAvgBalance !== undefined ? formatCurrency(displayAvgBalance) : "-"}
                     </TableCell>
                  </TableRow>

                  {/* Buffer row (bg; only balance column filled) */}
                  <TableRow className="h-64 bg-gray-50">
                     <TableCell className="pl-12 font-bold">Buffer</TableCell>
                     <TableCell className="pl-12 text-14">-</TableCell>
                     <TableCell className="pl-12 text-14">-</TableCell>
                     <TableCell className="pl-12 text-14">-</TableCell>
                     <TableCell className="pl-12 text-14 font-bold">{displayBuffer !== undefined ? formatCurrency(displayBuffer) : "-"}</TableCell>
                  </TableRow>

                  {/* Limitation of Loan Size row (bg; only balance column filled) */}
                  <TableRow className="h-64 bg-gray-50">
                     <TableCell className="pl-12 font-bold">Limitation of Loan size</TableCell>
                     <TableCell className="pl-12 text-14">-</TableCell>
                     <TableCell className="pl-12 text-14">-</TableCell>
                     <TableCell className="pl-12 text-14">-</TableCell>
                     <TableCell className="pl-12 text-14 font-bold">
                        {displayLimitation !== undefined ? formatCurrency(displayLimitation) : "-"}
                     </TableCell>
                  </TableRow>
               </TableBody>
            </Table>
         </div>

         {/* DSIABLED FOR NOW */}
         {/* Insight tiles */}
         {/* <div className="mt-16 grid grid-cols-12 gap-12">
    {dataInsights.map(({ bgColor, desc, title }, i) => (
     <div key={i} className="col-span-12 md:col-span-6 xl:col-span-4">
      <KV label={title} bgColor={bgColor} value={desc} />
     </div>
    ))}
   </div> */}
      </section>
   );
}
