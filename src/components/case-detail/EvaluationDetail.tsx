"use client";

import * as React from "react";
import { Info, Pencil, CheckIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";

/* ---------------- Types ---------------- */
type Criterion = {
 label: string;
 value?: string | React.ReactNode;
 hint?: string;
};

type Section = {
 id: number;
 title: string;
 criteria: Criterion[];
};

type Props = {
 sections: Section[];
 editable?: boolean;
 onChange?: (next: Section[]) => void;
};

/* ------------- Small helpers ------------- */
function isStringValue(v: string | React.ReactNode | undefined): v is string {
 return typeof v === "string" || typeof v === "undefined";
}

/* ------------- Editable cell ------------- */
function EditableValueCell({
 value,
 canEdit,
 onSave,
 className = "",
}: {
 value?: string | React.ReactNode;
 canEdit: boolean;
 onSave: (next: string) => void;
 className?: string;
}) {
 const stringMode = isStringValue(value);
 const display = (value ?? "-") as React.ReactNode;

 const [editing, setEditing] = React.useState(false);
 const [draft, setDraft] = React.useState<string>(stringMode ? (value ?? "") : "");

 React.useEffect(() => {
  if (stringMode) setDraft(value ?? "");
 }, [value, stringMode]);

 const start = () => {
  if (canEdit && stringMode) setEditing(true);
 };
 const cancel = () => {
  setDraft(stringMode ? (value ?? "") : "");
  setEditing(false);
 };
 const save = () => {
  onSave(draft.trim());
  setEditing(false);
 };

 if (!canEdit || !stringMode) {
  // read-only (or non-string values)
  return (
   <div className={"relative " + className}>
    <div>{display}</div>
    {canEdit && !stringMode ? null : null}
   </div>
  );
 }

 return editing ? (
  <div className="w-full relative">
   <textarea
    value={draft}
    onChange={(e) => setDraft(e.target.value)}
    rows={1}
    className="w-full p-3 border-gray-300  text-[14px] text-gray-600 font-normal outline-none focus:border-b focus:border-brand-500 bg-gray-100"
    placeholder=""
    onKeyDown={(e) => {
     if ((e.metaKey || e.ctrlKey) && e.key === "Enter") save();
     if (e.key === "Escape") cancel();
    }}
   />

   <CheckIcon onClick={save} className="absolute right-8 top-16 size-16 text-[#079455]" />
  </div>
 ) : (
  <div className={"relative flex items-start justify-between gap-3 " + className}>
   <div className="whitespace-pre-wrap text-14 text-gray-600 font-normal">{display}</div>
   <Pencil onClick={start} className="size-16" />
  </div>
 );
}

/* ------------- Main component ------------- */
export default function EvaluationDetails({ sections, editable, onChange }: Props) {
 const params = useSearchParams();
 const stageParam = (params.get("stage") ?? "phone").toLowerCase();
 const canEdit = editable ?? stageParam === "review1";

 // local copy so we can edit inline
 const [data, setData] = React.useState<Section[]>(
  sections.map((s) => ({
   ...s,
   criteria: s.criteria.map((c) => ({ ...c })),
  }))
 );

 React.useEffect(() => {
  // if parent updates `sections`, sync
  setData(sections.map((s) => ({ ...s, criteria: s.criteria.map((c) => ({ ...c })) })));
 }, [sections]);

 const updateValue = (secIdx: number, critIdx: number, val: string) => {
  setData((prev) => {
   const next = prev.map((s) => ({ ...s, criteria: s.criteria.map((c) => ({ ...c })) }));
   next[secIdx].criteria[critIdx].value = val.length ? val : "-";
   onChange?.(next);
   return next;
  });
 };

 return (
  <section className="space-y-10 mt-[32px]">
   <h3 className="text-20 font-semibold text-gray-900">Evaluation Details</h3>

   {data.map((sec, secIdx) => (
    <div key={sec.id} className="space-y-8">
     {/* Section Header */}
     <div className="flex items-center gap-3">
      <span className="flex h-24 w-24 items-center justify-center rounded-full text-brand-500 bg-brand-50 text-16 font-semibold">
       {sec.id}
      </span>
      <h4 className="text-16 font-semibold text-gray-900">{sec.title}</h4>
     </div>

     {/* Criteria rows */}
     <div>
      {sec.criteria.map((c, i) => (
       <div
        key={i}
        className={`flex py-16 items-start justify-start text-14 text-gray-700 ${i !== sec.criteria.length - 1 ? "border-b" : ""
         } border-gray-200 bg-white`}
       >
        <div className="flex flex-1 text-gray-600 text-14 items-center gap-2 pr-6">
         {c.label}
         {c.hint && (
          <span title={c.hint}>
           <Info className="h-18 w-18 text-gray-400" />
          </span>
         )}
        </div>

        <div className="flex-1">
         <EditableValueCell
          value={c.value}
          canEdit={canEdit}
          onSave={(val) => updateValue(secIdx, i, val)}
          className="text-gray-900 font-bold text-18"
         />
        </div>
       </div>
      ))}
     </div>
    </div>
   ))}
  </section>
 );
}
