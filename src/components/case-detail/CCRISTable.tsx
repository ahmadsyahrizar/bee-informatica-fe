// components/case-detail/CCRISTable.tsx
"use client";

import * as React from "react";
import { DataTable, DTColumn, DTHeaderCell } from "@/components/common/DataTable";

type CCRISRow = {
 no: number;
 date: string;
 facility: string;
 balance: number;
 limit: number;
 months: Record<"Jul" | "Jun" | "May" | "Apr" | "Mar" | "Feb" | "Jan" | "Dec", number>;
};

const fmtRM = (n: number) =>
 n.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function CCRISTable({ rows }: { rows: CCRISRow[] }) {
 const monthKeys: Array<keyof CCRISRow["months"]> = ["Jul", "Jun", "May", "Apr", "Mar", "Feb", "Jan", "Dec"];

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

 // Second header row: months only
 const hdrRow2: DTHeaderCell[] = monthKeys.map((m) => ({ title: m, align: "left" }));

 return (
  <DataTable
   columns={columns}
   rows={rows}
   zebra
   dense
   complexHeader={[hdrRow1, hdrRow2]}   // 👈 use the complex header
   className="mt-12"
  />
 );
}