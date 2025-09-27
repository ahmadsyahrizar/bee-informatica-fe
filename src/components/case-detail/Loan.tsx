"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Check } from "lucide-react";

function formatRM(n?: number | null) {
 if (typeof n !== "number" || Number.isNaN(n)) return "";
 return `${n.toLocaleString("en-MY")} RM`;
}

function parseAmount(input: string): number | null {
 const n = Number(input.replace(/[^\d.-]/g, ""));
 return Number.isFinite(n) ? n : null;
}

function CardShell({
 label,
 children,
 className = "",
}: {
 label: string;
 children: React.ReactNode;
 className?: string;
}) {
 return (
  <div
   className={[
    "rounded-[10px] bg-gray-50 px-4 py-3 border",
    className,
   ].join(" ")}
  >
   <div className="text-[12px] text-gray-500 mb-1 pl-16">{label}</div>
   {children}
  </div>
 );
}

/** Read-only applied amount card */
export function AppliedAmountCard({ amount }: { amount?: number | null }) {
 return (
  <CardShell label="Applied Loan Amount p-16">
   <div className="text-[20px] font-semibold text-gray-900 pl-16">
    {amount != null ? formatRM(amount) : "-"}
   </div>
  </CardShell>
 );
}

/** Editable (in final stage) approved amount card */
export function ApprovedAmountCard({
 amount,
 onSaveApproved,
 className = "",
}: {
 amount?: number | null;
 onSaveApproved?: (nextAmount: number) => Promise<void> | void;
 className?: string;
}) {
 const params = useSearchParams();
 const isFinalStage = (params.get("stage") ?? "").toLowerCase() === "final";

 const [editing, setEditing] = React.useState(false);
 const [draft, setDraft] = React.useState<string>(
  amount != null ? String(amount) : ""
 );
 const [saving, setSaving] = React.useState(false);
 const [localAmount, setLocalAmount] = React.useState<number | null>(
  amount ?? null
 );

 React.useEffect(() => {
  setLocalAmount(amount ?? null);
  setDraft(amount != null ? String(amount) : "");
 }, [amount]);

 const startEdit = () => {
  if (!isFinalStage) return;
  setEditing(true);
  setDraft(localAmount != null ? String(localAmount) : "");
 };

 const confirm = async () => {
  const parsed = parseAmount(draft);
  if (parsed == null) return;
  try {
   setSaving(true);
   await onSaveApproved?.(parsed);
   setLocalAmount(parsed);
   setEditing(false);
  } finally {
   setSaving(false);
  }
 };

 const showEmptyState = localAmount == null || Number.isNaN(localAmount);
 const brandState = isFinalStage && showEmptyState;

 return (
  <CardShell
   label="Approved Loan Amount"
   className={[
    className,
    brandState ? "border-brand-500" : "border-gray-200",
   ].join(" ")}
  >
   {/* Read or edit */}
   {!editing ? (
    <button
     type="button"
     onClick={startEdit}
     className="w-full text-left"
     disabled={!isFinalStage}
    >
     {showEmptyState ? (
      <div
       className={[
        "text-[20px] font-semibold pl-16",
        brandState ? "text-brand-500" : "text-gray-400",
       ].join(" ")}
      >
       Enter Amount
      </div>
     ) : (
      <div className="text-[20px] font-semibold text-gray-900 pl-16">
       {formatRM(localAmount!)}
      </div>
     )}
    </button>
   ) : (
    <div className="relative">
     <input
      autoFocus
      inputMode="numeric"
      className="w-[300px] h-[38px] rounded-md border border-gray-300 bg-white mx-16 px-3 pr-10 text-[18px] font-semibold tracking-wide outline-none focus:ring-2 focus:ring-emerald-500"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onKeyDown={(e) => {
       if (e.key === "Enter") confirm();
       if (e.key === "Escape") setEditing(false);
      }}
      placeholder="900,000"
     />
     <button
      type="button"
      onClick={confirm}
      disabled={saving}
      className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-7 w-7 items-center justify-center text-emerald-700"
      aria-label="Save approved amount"
      title="Save"
     >
      <Check className="h-20 w-20" />
     </button>
    </div>
   )}
  </CardShell>
 );
}

/** Optional: a small wrapper to show both cards side-by-side */
export function LoanAmountsRow({
 applied,
 approved,
 onSaveApproved,
}: {
 applied?: number | null;
 approved?: number | null;
 onSaveApproved?: (nextAmount: number) => Promise<void> | void;
}) {

 const params = useSearchParams()
 const statusLoan = params.get("status");
 const isApproved = statusLoan === 'approved'

 return (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mt-32">
   <AppliedAmountCard amount={applied} />
   <ApprovedAmountCard className={isApproved ? 'bg-success-50 border-[#079455] text-gray-900' : 'border-[#DC6803] bg-warning-50 text-gray-900'} amount={approved} onSaveApproved={onSaveApproved} />
  </div>
 );
}
