import { useState } from "react";
import { DataTable, DTColumn } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { KeyValueField } from "@/types/app-log";
import { Sparkles } from "lucide-react";

export default function StructuredTable({ rows }: { rows: KeyValueField[] }) {
 type Row = KeyValueField;

 function ExpandableText({ text }: { text?: string | null }) {
  const t = text ?? "-";
  const [open, setOpen] = useState(false);

  const isLong = String(t).length > 240;

  return (
   <div>
    <div
     className={[
      "text-14 text-gray-900 font-semibold leading-6 break-words whitespace-pre-wrap",
     ].join(" ")}
     style={{
      maxHeight: !open && isLong ? 96 : undefined,
      overflow: !open && isLong ? "hidden" : undefined,
     }}
    >
     : {t}
    </div>

    {isLong ? (
     <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className="mt-2 text-xs text-primary-600 hover:underline"
     >
      {open ? "Show less" : "Show more"}
     </button>
    ) : null}
   </div>
  );
 }

 const columns: DTColumn<Row>[] = [
  {
   key: "label",
   header: "",
   width: "10%",
   className: "p-6 text-muted-foreground",
   cell: (r) => {
    return (
     <div className="flex flex-col">
      <div className="text-14 font-medium text-gray-700">{r.label}</div>
     </div>
    );
   },
  },
  {
   key: "value",
   header: "",
   width: "90%",
   className: "p-6",
   cell: (r) => {
    return (
     <div className="flex flex-col">
      <ExpandableText text={r.value as string | undefined} />
     </div>
    );
   },
  },
 ];

 return (
  <div className="mt-24">
   <div className="flex items-center gap-2 mb-2">
    <div className="text-18 font-semibold text-gray-900">Structured Notes</div>
    <Badge className="ml-2 flex items-center gap-1 text-[10px] font-medium">
     <Sparkles className="size-16" /> AI
    </Badge>
   </div>

   <div className="pt-1">
    {rows.length === 0 ? (
     <div className="p-6 text-sm text-muted-foreground">No structured notes available.</div>
    ) : (
     <DataTable<Row> columns={columns} rows={rows} />
    )}
   </div>
  </div>
 );
}
