import { CheckIcon, Loader2, Pencil } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

function EditableValueCell({
 value,
 canEdit,
 onSave,
 className = "",
}: {
 value?: string | ReactNode;
 canEdit: boolean;
 onSave: (next: string) => Promise<void> | void;
 className?: string;
}) {
 const stringMode = typeof value === "string" || value === undefined || value === null;
 const display = (value ?? "-") as ReactNode;

 const [editing, setEditing] = useState(false);
 const [draft, setDraft] = useState<string>(stringMode ? (value ?? "") : "");
 const [isSaving, setIsSaving] = useState(false);

 useEffect(() => {
  if (stringMode) setDraft(value ?? "");
 }, [value, stringMode]);

 const start = () => {
  if (canEdit && stringMode) setEditing(true);
 };
 const cancel = () => {
  setDraft(stringMode ? (value ?? "") : "");
  setEditing(false);
 };
 const save = async () => {
  const next = draft.trim();
  try {
   setIsSaving(true);
   await Promise.resolve(onSave(next));
   setEditing(false);
  } catch (err) {
   console.error("Save failed", err);
  } finally {
   setIsSaving(false);
  }
 };

 if (!canEdit || !stringMode) {
  return (
   <div className={"relative " + className}>
    <div>{display}</div>
   </div>
  );
 }

 return editing ? (
  <div className="w-full relative">
   <textarea
    rows={1}
    value={draft}
    placeholder=""
    onChange={(e) => setDraft(e.target.value)}
    className="w-full p-3 border-gray-300 text-[14px] text-gray-600 font-normal outline-none focus:border-b focus:border-brand-500 bg-gray-100"
    onKeyDown={(e) => {
     if ((e.metaKey || e.ctrlKey) && e.key === "Enter") save();
     if (e.key === "Escape") cancel();
    }}
   />

   <div className="absolute right-3 top-3 flex items-center gap-2">
    <button
     onClick={cancel}
     disabled={isSaving}
     aria-label="Cancel"
     className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
    >
     Cancel
    </button>

    <button
     aria-label="Save"
     onClick={save}
     className="rounded px-2 py-1"
     disabled={isSaving}
     title="Save"
    >
     {isSaving ? <Loader2 className="animate-spin" size={16} /> : <CheckIcon size={16} className="text-green-600" />}
    </button>
   </div>
  </div>
 ) : (
  <div className={"relative flex items-start justify-between gap-3 " + className}>
   <div className="whitespace-pre-wrap text-14 text-gray-600 font-normal">{display}</div>
   <button onClick={start} aria-label="Edit" className="p-1">
    <Pencil size={16} />
   </button>
  </div>
 );
}

export default EditableValueCell
