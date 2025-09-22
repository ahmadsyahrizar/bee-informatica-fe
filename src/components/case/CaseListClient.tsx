"use client";
import * as React from "react";
import { Table, TableBody } from "@/components/ui/table";
import { CaseRowType } from "@/types/case";
import { CaseRow } from "./CaseRow";
import { CaseTableHeader } from "./CaseTableHeader";
import { PageHeader } from "./PageHeader";
import { PaginationBar } from "./PaginationBar";
import { useRouter } from "next/navigation";

export const CaseListClient: React.FC<{ rows: CaseRowType[] }> = ({ rows }) => {
 const [page, setPage] = React.useState(1);
 const { push } = useRouter()

 const handleRedirect = (param: string | number) => {
  push(`/cases/${param}`)
 }

 return (
  <>
   <PageHeader total={rows.length} />
   <div className="mt-[32px] rounded-xl border border-gray-200 bg-white overflow-hidden">
    <div className="overflow-x-auto">
     <Table className="w-full max-w-[1216px]">
      <CaseTableHeader />
      <TableBody>
       {rows.map((r) => (
        <CaseRow row={r} key={r.id} onRedirect={() => handleRedirect(r.id)} />
       ))}
      </TableBody>
     </Table>
    </div>

    <div className="px-20 pb-16">
     <PaginationBar
      page={page}
      totalPages={10}
      onPrev={() => setPage((p) => Math.max(1, p - 1))}
      onNext={() => setPage((p) => Math.min(10, p + 1))}
     />
    </div>
   </div>
  </>
 );
};