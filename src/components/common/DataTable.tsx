"use client";

import * as React from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

export type DTColumn<T> = {
  key: string;
  header: React.ReactNode;
  width?: string;
  cell?: (row: T) => React.ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
};

export type DTHeaderCell = {
  title: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;              // 👈 NEW
  align?: "left" | "right" | "center";
  className?: string;
};

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  dense = false,
  zebra = false,
  className,
  complexHeader,
}: {
  columns: DTColumn<T>[];
  rows: T[];
  dense?: boolean;
  zebra?: boolean;
  className?: string;
  complexHeader?: DTHeaderCell[][];   // 👈 NEW
}) {
  const rowH = dense ? "h-48" : "h-64";

  return (
    <div className={`overflow-x-auto overflow-hidden rounded-lg border border-gray-200 bg-white ${className ?? ""}`}>
      <Table>
        <TableHeader>
          {complexHeader
            ? complexHeader.map((row, i) => (
              <TableRow key={`hdr-${i}`} className="bg-gray-50">
                {row.map((cell, j) => (
                  <TableHead
                    key={`hdr-${i}-${j}`}
                    colSpan={cell.colSpan}
                    rowSpan={cell.rowSpan}
                    className={[
                      "text-12 text-gray-600 p-[6px]",
                      cell.align === "right"
                        ? "text-right"
                        : cell.align === "center"
                          ? "text-center"
                          : "text-left",
                      cell.className ?? "",
                    ].join(" ")}
                  >
                    {cell.title}
                  </TableHead>
                ))}
              </TableRow>
            ))
            : (
              <TableRow className="bg-gray-50 text-12 text-gray-500">
                {columns.map((c) => (
                  <TableHead
                    key={c.key}
                    style={c.width ? { minWidth: c.width } : undefined}
                    className={[
                      c.align === "right"
                        ? "text-right"
                        : c.align === "center"
                          ? "text-center"
                          : "",
                      c.className ?? "",
                    ].join(" ")}
                  >
                    {c.header}
                  </TableHead>
                ))}
              </TableRow>
            )}
        </TableHeader>

        <TableBody>
          {rows.map((r, i) => (
            <TableRow key={i} className={`${rowH} ${zebra && i % 2 === 1 ? "bg-gray-50/40" : ""}`}>
              {columns.map((c) => (
                <TableCell
                  key={c.key}
                  className={[
                    "text-14 p-12 h-[60px]",
                    c.align === "right"
                      ? "text-right"
                      : c.align === "center"
                        ? "text-center"
                        : "",
                  ].join(" ")}
                >
                  {c.cell ? c.cell(r) : (r)[c.key] as React.ReactNode}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}