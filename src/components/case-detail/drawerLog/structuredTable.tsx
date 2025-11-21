import { DataTable, DTColumn } from "@/components/common/DataTable";
import { Badge } from "@/components/ui/badge";
import { KeyValueField } from "@/types/app-log";
import { Sparkles } from "lucide-react";

export default function StructuredTable({ rows }: { rows: KeyValueField[] }) {
 type Row = KeyValueField;
 const columns: DTColumn<Row>[] = [
  { key: "label", header: "", width: "40%", className: "p-6 text-muted-foreground" },
  { key: "value", header: "", width: "60%", className: "p-6" },
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