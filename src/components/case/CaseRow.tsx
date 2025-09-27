import * as React from "react";
import { AlertTriangle } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { CaseRowType } from "@/types/case";
import { ScoreBubble } from "./atoms/ScoreBubble";
import { StageBadge } from "./atoms/StageBadge";
import { ActionButton } from "./ActionButton";

/* ------------------------ helpers ------------------------ */
const formatRM = (n?: number) =>
     typeof n === "number" ? `${n.toLocaleString("en-MY")} RM` : "—";

/* ---------------------- subcells ------------------------- */
const PersonCell: React.FC<{
     name: string;
     caseId: string;
     company: string;
     avatars?: { src?: string; name: string }[];
}> = ({ name, caseId, company }) => {
     return (
          <div className="flex items-center px-[12px] py-[16px]">
               <div className="min-w-0">
                    <div className="truncate text-[14px] font-medium text-gray-900">{name}</div>
                    <div className="truncate text-[12px] text-gray-500">
                         {caseId} · {company}
                    </div>
               </div>
          </div>
     );
};

// const ScheduleCell: React.FC<{ value?: string }> = ({ value }) => {
//      if (!value) {
//           return (
//                <Button
//                     variant="ghost"
//                     className="h-8 rounded-xl px-[12px] py-[26px] text-[14px] text-gray-700 underline"
//                >
//                     <Image src={iconCalendar} width={20} height={20} alt="add" /> Add
//                </Button>
//           );
//      }
//      return (
//           <div className="text-[14px] font-medium text-gray-900 px-[12px]">{value}</div>
//      );
// };

/* ---------------------- main row ------------------------- */
export const CaseRow: React.FC<{ row: CaseRowType; onRedirect: () => void }> = ({
     row,
     onRedirect,
}) => {
     return (
          <TableRow className="hover:bg-white">
               {/* Person */}
               <TableCell className="cursor-pointer" onClick={onRedirect}>
                    <PersonCell
                         name={row.clientName}
                         company={row.company}
                         caseId={row.caseId}
                         avatars={row.avatars}
                    />
               </TableCell>

               {/* Score */}
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

               {/* Stage */}
               <TableCell>
                    {/* @ts-expect-error: rija */}
                    <StageBadge stage={row.stage} />
               </TableCell>

               {/* Applied Loan */}
               <TableCell className="text-right px-[12px] py-[16px]">
                    <span className="text-gray-900">{formatRM(row.appliedLoanAmount)}</span>
               </TableCell>

               {/* Approved Loan */}
               <TableCell className="text-right px-[12px] py-[16px]">
                    <span className="text-gray-900">{formatRM(row.approvedLoanAmount)}</span>
               </TableCell>

               {/* Schedule */}
               {/* <TableCell>
                    <ScheduleCell value={row.schedule} />
               </TableCell> */}

               {/* Action */}
               <TableCell className="text-right">
                    <ActionButton
                         className="p-3"
                         intent={
                              row.stage === "Phone"
                                   ? "start-call"
                                   : row.stage === "Meet"
                                        ? "join-meet"
                                        : row.stage === "1st Review"
                                             ? "check-score"
                                             : row.stage === "Final Review"
                                                  ? "check-application"
                                                  : "view-decision"
                         }
                    />
               </TableCell>
          </TableRow>
     );
};
