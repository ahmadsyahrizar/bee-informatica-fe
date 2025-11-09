"use client";
import * as React from "react";
import { Pencil, Check } from "lucide-react";

export default function EditableNumber({
 value,
 min = 0,
 max,
 step = 1,
 canEdit,
 onSave,
}: {
 value: number | string | undefined;
 min?: number;
 max?: number;
 step?: number;
 canEdit: boolean;
 onSave: (n: number) => void;
}) {
 const [editing, setEditing] = React.useState(false);
 const [draft, setDraft] = React.useState<number | "">(
  Number.isFinite(Number(value)) ? Number(value) : ""
 );

 React.useEffect(() => {
  setDraft(Number.isFinite(Number(value)) ? Number(value) : "");
 }, [value]);

 if (!canEdit) {
  return <span>{Number.isFinite(Number(value)) ? value : "-"}</span>;
 }

 if (!editing) {
  return (
   <button
    type="button"
    onClick={() => setEditing(true)}
    className="inline-flex items-center gap-2 hover:underline"
    title="Edit"
   >
    <span>{Number.isFinite(Number(value)) ? value : "-"}</span>
    <Pencil className="size-12 text-gray-500" />
   </button>
  );
 }

 return (
  <div className="flex items-center gap-2">
   <input
    type="number"
    className="h-20 w-[60px] rounded-0 border-b border-red-500 px-2 text-sm"
    value={draft as number | string}
    min={min}
    max={max}
    step={step}
    onChange={(e) => setDraft(e.target.value === "" ? "" : Number(e.target.value))}
    onKeyDown={(e) => {
     if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      if (draft !== "" && !Number.isNaN(Number(draft))) onSave(Number(draft));
      setEditing(false);
     }
     if (e.key === "Escape") setEditing(false);
    }}
   />
   <button
    onClick={() => {
     if (draft !== "" && !Number.isNaN(Number(draft))) onSave(Number(draft));
     setEditing(false);
    }}
    title="Save"
   >
    <Check className="size-12 text-success" />
   </button>
  </div>
 );
}
