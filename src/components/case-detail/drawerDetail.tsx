"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, DTColumn } from "@/components/common/DataTable";
import {
  FileBadge2,
  ShieldCheck,
  ClipboardList,
  Banknote,
  ChevronRight,
  Pencil,
  Check,
} from "lucide-react";
import { Button } from "../ui/button";

/* ---------------- Types ---------------- */
export type RatioRow = {
  label: string;
  ratio?: string | number;
  fullRate?: number | string;
  rateScore?: number | string | React.ReactNode;  // ← allow React nodes for render
  score?: number | string | React.ReactNode;      // ← allow React nodes for render
  isGroup?: boolean;
};

export type Section = {
  title: string;
  icon?: React.ReactNode;
  columns: string[];
  rows: RatioRow[];
  footer?: RatioRow;
};

export type CreditScoreData = {
  overview: Section;
  preScreening: Section;
  cashflow: Section;
  qualitative: Section;
};

/* ---------------- Demo ---------------- */
const demoData: CreditScoreData = {
  overview: {
    title: "Overview",
    icon: <FileBadge2 className="size-16" />,
    columns: ["Category", "Ratio Allocation", "Ratio Score"],
    rows: [
      { label: "Part A: Pre Screening", ratio: "10%", score: 7.6 },
      { label: "Part B: Cashflow Analysis", ratio: "70%", score: 84.4 },
      { label: "Part C: Qualitative", ratio: "20%", score: "-" },
    ],
    footer: { label: "Total", ratio: "100%", score: "-" },
  },
  preScreening: {
    title: "Part A: Pre Screening",
    icon: <ShieldCheck className="size-16" />,
    columns: ["Compliance", "Ratio Allocation", "Full Rate", "Rate Score", "Score"],
    rows: [
      { label: "SSM", ratio: "24%", fullRate: 5, rateScore: 4, score: 19.2 },
      { label: "License", ratio: "24%", fullRate: 5, rateScore: 5, score: 24 },
      { label: "KYC (ID, Utility, off add)", ratio: "24%", fullRate: 5, rateScore: 4, score: 19.2 },
      { label: "Signboard (Pss)", ratio: "24%", fullRate: 5, rateScore: 5, score: 24 },
      { label: "Identity check for directors/partners", ratio: "4%", fullRate: 5, rateScore: 5, score: 4 },
    ],
    footer: { label: "Total", fullRate: 50, rateScore: 23, score: 90.4 },
  },
  cashflow: {
    title: "Part B: Cashflow Analysis",
    icon: <Banknote className="size-16" />,
    columns: ["Compliance", "Ratio Allocation", "Full Rate", "Rate Score", "Score / 100"],
    rows: [
      { isGroup: true, label: "Balance of income and repayment amount (3 times)" },
      { label: "Avg balance of bank statement", ratio: "35%", fullRate: 5, rateScore: 0, score: "-" },
      { label: "Repayment amount a month A/B>3", ratio: "10%", fullRate: 5, rateScore: 0, score: "-" },
      { label: "Transition 6 mo balance stable", ratio: "10%", fullRate: 5, rateScore: 0, score: "-" },
      { label: "Sudden inc/dec reason", ratio: "5%", fullRate: 5, rateScore: 0, score: "-" },
      { isGroup: true, label: "Cash flow coming from main business (>70%)" },
      { label: "Cash flow from main business", ratio: "15%", fullRate: 5, rateScore: 0, score: "-" },
      { label: "Other revenue stream", ratio: "5%", fullRate: 5, rateScore: 0, score: "-" },
      { label: "Cash flow (C) = (A) - (B)", ratio: "15%", fullRate: 5, rateScore: 0, score: "-" },
    ],
    footer: { label: "Total", fullRate: 80, score: "-" },
  },
  qualitative: {
    title: "Part C: Qualitative",
    icon: <ClipboardList className="size-16" />,
    columns: ["Category", "Score"],
    rows: [
      { label: "1", score: "-" },
      { label: "2", score: "-" },
      { label: "3", score: "-" },
    ],
    footer: { label: "Total", score: "-" },
  },
};

/* ---------------- Utils ---------------- */
function cloneModel(m: CreditScoreData): CreditScoreData {
  const copySection = (s: Section): Section => ({
    // keep icon (React node) by reference — do NOT deep clone it
    ...s,
    rows: s.rows.map(r => ({ ...r })),                     // primitive copy
    footer: s.footer ? { ...s.footer } : undefined,
  });

  return {
    overview: copySection(m.overview),
    preScreening: copySection(m.preScreening),
    cashflow: copySection(m.cashflow),
    qualitative: copySection(m.qualitative),
  };
}

const toNumber = (v: number | string | undefined) =>
  typeof v === "number" ? v : v ? Number(String(v).replace(/[^\d.-]/g, "")) : NaN;

const toPercent = (v: number | string | undefined) => {
  if (v == null) return NaN;
  if (typeof v === "number") return v;
  const s = String(v).trim();
  return s.endsWith("%") ? parseFloat(s.slice(0, -1)) : parseFloat(s);
};

const calcRowScore = (row: RatioRow) => {
  const p = toPercent(row.ratio); // e.g. 24
  const full = toNumber(row.fullRate); // e.g. 5   
  const rate = toNumber(Number(row.rateScore)); // e.g. 4
  if (Number.isFinite(p) && Number.isFinite(full) && Number.isFinite(rate) && full > 0) {
    // Score out of 100 = ratio% * (rate/full)
    return +((p * (rate / full))).toFixed(2);
  }
  return "-";
};

const sumNumeric = (arr: (number | string | undefined)[]) =>
  // @ts-expect-error rija
  +(arr.reduce((acc, v) => (Number.isFinite(Number(v)) ? acc + Number(v) : acc), 0).toFixed(2));

/* ---------------- Inline editor ---------------- */
function EditableNumber({
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

/* ---------------- Main ---------------- */
export default function CreditScoreDrawer({
  open,
  onOpenChange,
  data = demoData,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: CreditScoreData;
}) {
  const [tab, setTab] = React.useState("overview");
  const [model, setModel] = React.useState<CreditScoreData>(data);
  const params = useSearchParams();
  const canEdit = (params.get("stage") ?? "").toLowerCase() === "review1";

  const overviewRef = React.useRef<HTMLDivElement | null>(null);
  const preRef = React.useRef<HTMLDivElement | null>(null);
  const cashRef = React.useRef<HTMLDivElement | null>(null);
  const qualRef = React.useRef<HTMLDivElement | null>(null);

  const onTabChange = (v: string) => {
    setTab(v);
    const map: Record<string, React.RefObject<HTMLDivElement | null>> = {
      overview: overviewRef,
      pre: preRef,
      cash: cashRef,
      qual: qualRef,
    };
    map[v]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ---------- update helpers (mutate safely + recalc) ---------- */
  const updateRateScore = (sectionKey: "preScreening" | "cashflow", rowIdx: number, next: number) => {
    setModel(prev => {
      const nextModel = cloneModel(prev);   // ← instead of structuredClone
      const rows = nextModel[sectionKey].rows;

      rows[rowIdx].rateScore = next;
      rows[rowIdx].score = calcRowScore(rows[rowIdx]);

      const numericRows = rows.filter(r => !r.isGroup);
      const sumRate = sumNumeric(numericRows.map(r => typeof r.rateScore === "number" ? r.rateScore : NaN));
      const sumScore = sumNumeric(numericRows.map(r => typeof r.score === "number" ? r.score : NaN));

      nextModel[sectionKey].footer ??= { label: "Total" };
      nextModel[sectionKey].footer!.rateScore = Number.isFinite(sumRate) ? sumRate : "-";
      nextModel[sectionKey].footer!.score = Number.isFinite(sumScore) ? sumScore : "-";
      return nextModel;
    });
  };

  const updateQualScore = (rowIdx: number, next: number) => {
    setModel(prev => {
      const nextModel = cloneModel(prev);   // ← instead of structuredClone
      nextModel.qualitative.rows[rowIdx].score = next;

      const nums = nextModel.qualitative.rows
        .map(r => Number(r.score))
        .filter(n => Number.isFinite(n)) as number[];

      nextModel.qualitative.footer ??= { label: "Total" };
      nextModel.qualitative.footer!.score = nums.length ? +nums.reduce((a, b) => a + b, 0).toFixed(2) : "-";
      return nextModel;
    });
  };
  /* ---------------- tables (with inline editors) ---------------- */
  function RatioTable({
    section,
    editableKind, // "rateScore" | "qualScore" | "none"
    onEdit,
  }: {
    section: Section;
    editableKind: "rateScore" | "qualScore" | "none";
    onEdit?: (rowIdx: number, value: number) => void;
  }) {
    // Build visible rows (DataTable will render whatever ReactNode we pass)
    const rowsForRender = section.rows.map((r, idx) => {
      if (r.isGroup) return r; // untouched

      if (editableKind === "rateScore") {
        const max = Number.isFinite(Number(r.fullRate)) ? Number(r.fullRate) : undefined;
        return {
          ...r,
          rateScore: (
            <EditableNumber
              // @ts-expect-error rija
              value={r.rateScore}
              min={0}
              max={max}
              step={1}
              canEdit={canEdit}
              onSave={(n) => onEdit?.(idx, n)}
            />
          ),
          score: <span>{calcRowScore(r)}</span>,
        } as RatioRow;
      }

      if (editableKind === "qualScore") {
        return {
          ...r,
          score: (
            <EditableNumber
              // @ts-expect-error rija
              value={r.score}
              min={0}
              max={100}
              step={1}
              canEdit={canEdit}
              onSave={(n) => onEdit?.(idx, n)}
            />
          ),
        } as RatioRow;
      }

      return r;
    });

    const columns: DTColumn<RatioRow>[] = [
      { key: "label", header: section.columns[0], width: "40%", className: "p-6" },
      { key: "ratio", header: section.columns[1] ?? "", align: "left" },
      { key: "fullRate", header: section.columns[2] ?? "", align: "left" },
      { key: "rateScore", header: section.columns[3] ?? "", align: "left" },
      { key: "score", header: section.columns[4] ?? "", align: "left" },
    ];

    // footer: if we edited, ensure computed values visible
    const footer =
      section.footer && editableKind !== "none"
        ? {
          ...section.footer,
          // leave footer.fullRate as provided by your model (often a target like 50 / 80)
        }
        : section.footer;

    return (
      <div>
        <div className="py-3 mt-[16px] flex items-center gap-2">
          <div className="font-medium text-sm">{section.title}</div>
        </div>
        <div className="p-0">
          <DataTable
            columns={columns}
            rows={[...rowsForRender, ...(footer ? [footer] : [])]}
            zebra
            dense
          />
        </div>
      </div>
    );
  }

  const handleConfirmScore = () => {
    // will hit api later 
    //  now we close it     
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-white max-h-full p-0 w-[1080px] sm:w-[1080px] max-w-none sm:max-w-none">
        <SheetHeader className="border-b ml-24 p-16">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center mr-6">
              <ChevronRight className="size-16" />
              <ChevronRight className="size-16 ml-[-11px]" />
              <div>
                <SheetTitle className="leading-tight">Credit Score</SheetTitle>
              </div>
            </div>

            {canEdit && <Button onClick={handleConfirmScore} className="m-12 p-16 text-white">Confirm Scoring</Button>}
          </div>
        </SheetHeader>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 px-24">
          <div className="xl:col-span-12 space-y-6">
            <Tabs value={tab} onValueChange={onTabChange} className="w-full">
              <TabsList className="w-full justify-start align-top overflow-x-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="pre">Part A: Pre-Screening</TabsTrigger>
                <TabsTrigger value="cash">Part B: Cashflow Analysis</TabsTrigger>
                <TabsTrigger value="qual">Part C: Psychometric/Qualitative</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-6 pr-2 overflow-y-auto max-h-[calc(92vh-100px)]">
              <div ref={overviewRef} id="section-overview">
                <RatioTable section={model.overview} editableKind="none" />
              </div>

              <div ref={preRef} id="section-pre">
                <RatioTable
                  section={model.preScreening}
                  editableKind="rateScore"
                  onEdit={(rowIdx, val) => updateRateScore("preScreening", rowIdx, val)}
                />
              </div>

              <div ref={cashRef} id="section-cash">
                <RatioTable
                  section={model.cashflow}
                  editableKind="rateScore"
                  onEdit={(rowIdx, val) => updateRateScore("cashflow", rowIdx, val)}
                />
              </div>

              <div ref={qualRef} id="section-qual">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <RatioTable
                    section={model.qualitative}
                    editableKind="qualScore"
                    onEdit={(rowIdx, val) => updateQualScore(rowIdx, val)}
                  />
                  {/* Radar placeholder */}
                  <div className="mt-[60px]">
                    <div className="aspect-square w-full rounded-xl border grid place-items-center text-xs text-muted-foreground">
                      Add your radar chart here
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
