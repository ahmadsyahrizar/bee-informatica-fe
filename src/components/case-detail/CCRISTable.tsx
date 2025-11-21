"use client";

import * as React from "react";
import { DataTable, DTColumn, DTHeaderCell } from "@/components/common/DataTable";
import type { Report } from "@/types/api/ccris.type";

type MonthKey = "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun" | "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec";

type CCRISRow = {
 no: number;
 date: string;
 facility: string;
 balance: number;
 limit: number;
 months: Record<MonthKey, number>;
};

const fmtRM = (n: number) =>
 n?.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// map numeric month -> short name
const monthNumToKey: Record<number, MonthKey> = {
 1: "Jan",
 2: "Feb",
 3: "Mar",
 4: "Apr",
 5: "May",
 6: "Jun",
 7: "Jul",
 8: "Aug",
 9: "Sep",
 10: "Oct",
 11: "Nov",
 12: "Dec",
};

const defaultMonths = (): Record<MonthKey, number> => ({
 Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
 Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0,
});

export function CCRISTable({ rows }: { rows?: Report[] | null }) {
 const monthKeys: MonthKey[] = ["Jul", "Jun", "May", "Apr", "Mar", "Feb", "Jan", "Dec"];

 const mappedRows: CCRISRow[] =
  (rows ?? []).map((r, idx) => {
   const months = defaultMonths();
   if (Array.isArray(r.conduct_of_account)) {
    r.conduct_of_account.forEach((c) => {
     const key = monthNumToKey[c.month];
     if (key) months[key] = typeof c.count === "number" ? c.count : 0;
    });
   }
   let dateStr: string;
   try {
    const dt = new Date(r.date);
    dateStr = isNaN(dt.getTime()) ? r.date : dt.toLocaleDateString();
   } catch {
    dateStr = r.date;
   }

   return {
    no: idx + 1,
    date: dateStr,
    facility: r.facility,
    balance: r.outstanding,
    limit: r.limit,
    months,
   };
  }) ?? [];

 const columns: DTColumn<CCRISRow>[] = [
  { key: "no", header: "No", width: "64px", align: "left", className: "pl-12", cell: r => r.no },
  { key: "date", header: "Date", width: "103px", align: 'left', cell: r => r.date },
  { key: "facility", header: "Facility", width: "137px", cell: r => r.facility },
  { key: "balance", header: <>Total Outstanding<br />Balance (RM)</>, width: "137px", align: "left", cell: r => fmtRM(r.balance) },
  { key: "limit", header: <>Limit / Installment<br />Amount (RM)</>, width: "151px", align: "left", cell: r => fmtRM(r.limit) },
  ...monthKeys.map((m) => ({
   key: `m-${m}`,
   header: m,
   width: "54px",
   align: "left" as const,
   className: "text-gray-600",
   cell: (r: CCRISRow) => r.months[m],
  })),
 ];

 const hdrRow1: DTHeaderCell[] = [
  { title: "No", rowSpan: 2, className: "pl-12" },
  { title: "Date", rowSpan: 2 },
  { title: "Facility", rowSpan: 2 },
  { title: <>Total Outstanding<br />Balance (RM)</>, rowSpan: 2, align: "left" },
  { title: <>Limit / Installment<br />Amount (RM)</>, rowSpan: 2, align: "left" },
  { title: "Conduct of Account for last 12 months", colSpan: monthKeys.length, align: "left" },
 ];

 const hdrRow2: DTHeaderCell[] = monthKeys.map((m) => ({ title: m, align: "left" }));

 return (
  <DataTable
   columns={columns}
   rows={mappedRows}
   zebra
   dense
   complexHeader={[hdrRow1, hdrRow2]}
   className="mt-12"
  />
 );
}
