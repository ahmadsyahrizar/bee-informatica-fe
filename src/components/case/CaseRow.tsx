import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { CaseRowType } from "@/types/case";
import { ScoreBubble } from "./atoms/ScoreBubble";
import { StageBadge } from "./atoms/StageBadge";
import dayjs from "dayjs"
import { Button } from "../ui/button";
import formatRM from "@/lib/utils/formatRM";

/* ---------------------- subcells ------------------------- */
const PersonCell: React.FC<CaseRowType> = ({ applicant_name, application_code, company_name }) => {
     return (
          <div className="flex items-center px-[12px] py-[16px]">
               <div className="min-w-0">
                    <div className="truncate text-[14px] font-medium text-gray-900">{applicant_name}</div>
                    <div className="truncate text-[12px] text-gray-500">
                         {application_code} · {company_name}
                    </div>
               </div>
          </div>
     );
};

/* ---------------------- main row ------------------------- */
export const CaseRow: React.FC<{ row: CaseRowType; onRedirect: () => void }> = ({
     row,
     onRedirect,
}) => {
     return (
          <TableRow className="hover:bg-white">
               <TableCell className="cursor-pointer" onClick={onRedirect}>
                    <PersonCell {...row} />
               </TableCell>

               <TableCell>
                    <div className="w-6">
                         {typeof row.score === "number" && <ScoreBubble score={row.score} />}
                    </div>
                    {row.attentionRequired && (
                         <div className="mt-2 flex items-center text-[14px] text-warning-700 font-bold">
                              <AlertTriangle className="h-3.5 w-3.5 mr-2 text-warning-700" />
                              Attention Required
                         </div>
                    )}
               </TableCell>

               <TableCell>
                    {/* @ts-expect-error: rija */}
                    <StageBadge stage={row.stage} />
               </TableCell>

               <TableCell className="text-left px-[12px] py-[16px]">
                    <span className="text-gray-900">{formatRM(row.applied_loan_amount)}</span>
               </TableCell>

               <TableCell className="text-left px-[12px] py-[16px]">
                    <span className="text-gray-900">{formatRM(row.approved_loan_amount)}</span>
               </TableCell>

               <TableCell>
                    <span className="text-gray-900">{dayjs(row.registered_at).format("MMM DD, YYYY")}</span>
               </TableCell>

               <TableCell className="text-left pr-3">
                    <Button className="bg-white border border-gray-300 py-2 px-[14px] shadow-gray-300 hover:bg-white">Detail</Button>
               </TableCell>
          </TableRow>
     );
};
