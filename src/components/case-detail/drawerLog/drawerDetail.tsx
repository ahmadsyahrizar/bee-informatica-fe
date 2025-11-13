"use client";

import * as React from "react";
import { useParams, useSearchParams } from "next/navigation";
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
import { Button } from "@/components/ui/button";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useCreditScoreTemplate } from "@/hooks/useCreditScoreTemplate";
import { useCreditScore } from "@/hooks/useCreditScore";
import PostCreditScore from "@/services/UpsertCreditScore";
import { CreditScoreData, RatioRow, Section } from "@/types/credit-score";
import type { PostCreditScoreRequest } from "@/types/api/upsert-cred-score.type";
import { useCaseDetailContext } from "@/context/InitCaseDetailContext";

/* ---------------- Demo (unchanged icons/content) ---------------- */
const demoData: CreditScoreData = {
  overview: {
    title: "Overview",
    icon: <FileBadge2 className="size-16" />,
    columns: ["Category", "Ratio Allocation", "Ratio Score"],
    rows: [
      { label: "Part A: Pre Screening", ratio: "10%", score: "-" },
      { label: "Part B: Cashflow Analysis", ratio: "70%", score: "-" },
      { label: "Part C: Qualitative", ratio: "20%", score: "-" },
    ],
    footer: { label: "Total", ratio: "100%", score: "-" },
  },
  preScreening: {
    title: "Part A: Pre Screening",
    icon: <ShieldCheck className="size-16" />,
    columns: ["Compliance", "Ratio Allocation", "Full Rate", "Rate Score", "Score"],
    rows: [],
    footer: { label: "Total", fullRate: 0, rateScore: "-", score: "-" },
  },
  cashflow: {
    title: "Part B: Cashflow Analysis",
    icon: <Banknote className="size-16" />,
    columns: ["Compliance", "Ratio Allocation", "Full Rate", "Rate Score", "Score / 100"],
    rows: [],
    footer: { label: "Total", fullRate: 0, rateScore: "-", score: "-" },
  },
  qualitative: {
    title: "Part C: Qualitative",
    icon: <ClipboardList className="size-16" />,
    columns: ["Category", "AI Score", "Final Score"],
    rows: [],
    footer: { label: "Total", aiScore: "-", finalScore: "-" } as any,
  },
};

/* ---------------- Utilities ---------------- */
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

/* ---------------- Merge template + score logic (keeps grouping) ---------------- */
const PRE_SCREENING_LABELS: Record<string, string> = {
  ssm: "SSM",
  license: "License",
  kyc: "KYC (ID, Utility, off add)",
  signboard: "Signboard (Pics)",
  identity_check: "Identity check for directors/partners",
};

function mergeTemplateAndScore(templateData: any, scoreData: any): CreditScoreData {
  // templateData may be wrapper { data: ... } depending on your API; normalize
  const tpl = templateData?.data ?? templateData ?? {};
  const sc = scoreData?.data ?? scoreData ?? {};

  const overviewRows: RatioRow[] = [
    { label: "Part A: Pre Screening", ratio: `${tpl?.pre_screening?.ratio_allocation ?? 0}%`, score: "-" },
    { label: "Part B: Cashflow Analysis", ratio: `${tpl?.cashflow_analysis?.ratio_allocation ?? 0}%`, score: "-" },
    { label: "Part C: Qualitative", ratio: `${tpl?.qualitative_score?.ratio_allocation ?? 0}%`, score: "-" },
  ];

  // CASHFLOW: group by header_key
  const raw = (tpl?.cashflow_analysis?.credit_score_data ?? []).slice().sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));
  const groups = new Map<string, { header_value?: string; items: any[] }>();
  raw.forEach((it: any) => {
    const hk = it.header_key ?? "default";
    if (!groups.has(hk)) groups.set(hk, { header_value: it.header_value, items: [] });
    groups.get(hk)!.items.push(it);
  });

  const cashflowRows: RatioRow[] = [];
  groups.forEach((g) => {
    // header row
    cashflowRows.push({ isGroup: true, label: g.header_value ?? "", key: `grp-${g.header_value}` });
    g.items.forEach((it) => {
      cashflowRows.push({
        key: it.key,
        label: it.value,
        ratio: typeof it.ratio === "number" ? `${it.ratio}%` : it.ratio,
        fullRate: it.full_rate ?? 5,
        rateScore: "-",
        score: "-",
      });
    });
  });

  // PRE: use template order; fallback to PRE_SCREENING_LABELS if template absent
  const preRaw = tpl?.pre_screening?.credit_score_data ?? [];
  const preKeys = preRaw.length ? preRaw : Object.keys(PRE_SCREENING_LABELS).map((k, i) => ({
    key: k,
    value: PRE_SCREENING_LABELS[k],
    ratio: (i === 4 ? 4 : 24), // fallback
    full_rate: 5,
    order: i + 1,
  }));

  const preRows: RatioRow[] = preKeys
    .slice()
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
    .map((it: any) => ({
      key: it.key,
      label: it.value,
      ratio: typeof it.ratio === "number" ? `${it.ratio}%` : it.ratio,
      fullRate: it.full_rate ?? 5,
      rateScore: "-",
      score: "-",
    }));

  // QUAL - read possible ai_score from template items, and final_score from scoreData
  const qualRaw = tpl?.qualitative_score?.qualitative_score_data ?? [];
  const qualRows: RatioRow[] = qualRaw
    .slice()
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
    .map((q: any) => {
      // flexible ai score field names
      const ai = q.ai_score ?? q.aiScore ?? q.ai ?? undefined;
      const aiVal = typeof ai === "number" ? Number(ai.toFixed?.(2) ?? ai) : (ai ?? "-");
      return {
        key: String(q.category_id),
        label: `Category ${q.category_id}`,
        aiScore: aiVal,
        finalScore: "-", // default, overwritten below from score data if present
      };
    });

  // build maps from scoreData
  const scoreMap = new Map<string, number>();
  (sc?.cashflow_analysis?.credit_score_data ?? []).forEach((s: any) => scoreMap.set(s.key, s.score));
  (sc?.pre_screening?.credit_score_data ?? []).forEach((s: any) => scoreMap.set(s.key, s.score));

  const qualMap = new Map<number, number>();
  (sc?.qualitative_score?.qualitative_score_data ?? []).forEach((q: any) => qualMap.set(Number(q.category_id), q.final_score ?? q.score));

  // apply scores for pre/cashflow rows
  const applyScores = (rows: RatioRow[]) =>
    rows.map((r) => {
      if (r.isGroup) return r;
      const s = typeof r.key === "string" ? scoreMap.get(r.key) : undefined;
      if (typeof s === "number") {
        r.rateScore = s;
        r.score = calcRowScore(r);
      } else {
        r.rateScore = "-";
        r.score = "-";
      }
      return r;
    });

  const preRowsApplied = applyScores(preRows);
  const cashflowApplied = applyScores(cashflowRows);

  // apply final scores from scoreData into qualRows
  const qualApplied: RatioRow[] = qualRows.map((r) => {
    const cid = Number(r.key);
    const final = qualMap.get(cid);
    return {
      ...r,
      finalScore: typeof final === "number" ? final : r.finalScore ?? "-",
    };
  });

  // footers
  const preFooter = {
    label: "Total",
    fullRate: 5 * preRowsApplied.length,
    rateScore: (() => {
      const s = preRowsApplied.map((r) => (typeof r.rateScore === "number" ? r.rateScore : NaN));
      const sum = sumNumeric(s);
      return Number.isFinite(sum) ? sum : "-";
    })(),
    score: "-",
  };

  const cashNumeric = cashflowApplied.filter((r) => !r.isGroup);
  const cashFooter = {
    label: "Total",
    rateScore: (() => {
      const s = cashNumeric.map((r) => (typeof r.rateScore === "number" ? r.rateScore : NaN));
      const sum = sumNumeric(s);
      return Number.isFinite(sum) ? sum : "-";
    })(),
    score: (() => {
      const s = cashNumeric.map((r) => (typeof r.score === "number" ? r.score : NaN));
      const sum = sumNumeric(s);
      return Number.isFinite(sum) ? sum : "-";
    })(),
  };

  // qualitative footer totals
  const qualFooter = {
    label: "Total",
    aiScore: (() => {
      const s = qualApplied.map((r) => (typeof r.aiScore === "number" ? r.aiScore : NaN));
      const sum = sumNumeric(s);
      return Number.isFinite(sum) ? sum : "-";
    })(),
    finalScore: (() => {
      const s = qualApplied.map((r) => (typeof r.finalScore === "number" ? r.finalScore : NaN));
      const sum = sumNumeric(s);
      return Number.isFinite(sum) ? sum : "-";
    })(),
  };

  return {
    overview: {
      title: "Overview",
      columns: ["Category", "Ratio Allocation", "Ratio Score"],
      rows: overviewRows,
      footer: { label: "Total", ratio: "100%", score: "-" },
      icon: demoData.overview.icon,
    },
    preScreening: {
      title: "Part A: Pre Screening",
      columns: ["Compliance", "Ratio Allocation", "Full Rate", "Rate Score", "Score"],
      rows: preRowsApplied,
      footer: preFooter,
      icon: demoData.preScreening.icon,
    },
    cashflow: {
      title: "Part B: Cashflow Analysis",
      columns: ["Compliance", "Ratio Allocation", "Full Rate", "Rate Score", "Score / 100"],
      rows: cashflowApplied,
      footer: cashFooter,
      icon: demoData.cashflow.icon,
    },
    qualitative: {
      title: "Part C: Qualitative",
      columns: ["Category", "AI Score", "Final Score"],
      rows: qualApplied,
      footer: {
        label: "Total",
        aiScore: qualFooter.aiScore,
        finalScore: qualFooter.finalScore,
      } as any,
      icon: demoData.qualitative.icon,
    },
  } as CreditScoreData;
}

/* ---------------- Editable controls ---------------- */

function EditableRate({
  value,
  canEdit,
  onSave,
}: {
  value: number | string | undefined;
  canEdit: boolean;
  onSave: (n: number) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const display = Number.isFinite(Number(value)) ? String(value) : "-";

  const options: { value: number; label: string }[] = [
    { value: 5, label: "5 (Latest SSM)" },
    { value: 4, label: "4 (Printed < 6 months)" },
    { value: 3, label: "3 (Printed > 6 months)" },
    { value: 2, label: "2 (Printed > 1 year)" },
    { value: 1, label: "1 (No SSM)" },
  ];

  if (!canEdit) return <span>{display}</span>;

  return (
    <div className="relative inline-block">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 hover:underline"
          title="Edit"
        >
          <span>{display}</span>
          <Pencil className="size-12 text-gray-500" />
        </button>
      ) : (
        <div className="absolute z-30 mt-2 bg-white border rounded shadow min-w-[220px] p-2">
          <ul className="text-sm">
            {options.map((o) => (
              <li key={o.value}>
                <button
                  type="button"
                  onClick={() => {
                    onSave(o.value);
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded"
                >
                  <span className="block">{o.label}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="text-right mt-1">
            <button className="text-xs text-gray-500" onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

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
    return <span>{Number.isFinite(Number(value)) ? value : (value ?? "-")}</span>;
  }

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="inline-flex items-center gap-2 hover:underline"
        title="Edit"
      >
        <span>{Number.isFinite(Number(value)) ? value : (value ?? "-")}</span>
        <Pencil className="size-12 text-gray-500" />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        className="h-5 w-[60px] rounded border pl-2 text-sm"
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

/* ---------------- Main drawer component ---------------- */
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
  const { id } = useParams();
  const session = useSession();
  const { data: dataInit } = useCaseDetailContext()
  // @ts-expect-error rija
  const accessToken = session.data?.accessToken ?? "";
  const canEdit = dataInit?.stage === '1st_review'

  /* refs for tabs */
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

  /* ---------- fetch template + score using hooks ---------- */
  const { data: templateData } = useCreditScoreTemplate(accessToken ?? "");
  const { data: scoreData } = useCreditScore(accessToken ?? "", id as string ?? "");

  // Merge when template (and optionally score) available
  React.useEffect(() => {
    if (!templateData) return;
    const merged = mergeTemplateAndScore(templateData, scoreData ?? {});
    // keep icons from demo / data param
    merged.overview.icon = data?.overview?.icon ?? demoData.overview.icon;
    merged.preScreening.icon = data?.preScreening?.icon ?? demoData.preScreening.icon;
    merged.cashflow.icon = data?.cashflow?.icon ?? demoData.cashflow.icon;
    merged.qualitative.icon = data?.qualitative?.icon ?? demoData.qualitative.icon;
    setModel(merged);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateData, scoreData]);

  /* ---------- update helpers (mutate safely + recalc) ---------- */
  function cloneModel(m: CreditScoreData): CreditScoreData {
    const copySection = (s: Section): Section => ({
      ...s,
      rows: s.rows.map(r => ({ ...r })),
      footer: s.footer ? { ...s.footer } : undefined,
    });

    return {
      overview: copySection(m.overview),
      preScreening: copySection(m.preScreening),
      cashflow: copySection(m.cashflow),
      qualitative: copySection(m.qualitative),
    };
  }

  const updateRateScore = (sectionKey: "preScreening" | "cashflow", rowIdx: number, next: number) => {
    // Guard: only allow when canEdit (stage === "1st_review")
    if (!canEdit) return;
    setModel(prev => {
      const nextModel = cloneModel(prev);
      const rows = nextModel[sectionKey].rows;

      // find the target index among non-group rows (matching the editableCounter indexing)
      let targetIdx = -1;
      let count = -1;
      for (let i = 0; i < rows.length; i++) {
        if (!rows[i].isGroup) {
          count++;
          if (count === rowIdx) {
            targetIdx = i;
            break;
          }
        }
      }
      if (targetIdx === -1) targetIdx = rowIdx;

      const target = rows[targetIdx];
      if (!target || target.isGroup) return prev;

      target.rateScore = next;
      target.score = calcRowScore(target);

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
    // Guard: only allow when canEdit (stage === "1st_review")
    if (!canEdit) return;
    setModel(prev => {
      const nextModel = cloneModel(prev);
      const rows = nextModel.qualitative.rows;

      if (!rows[rowIdx]) return prev;
      rows[rowIdx].finalScore = next;

      const aiNums = rows.map(r => Number(r.aiScore)).filter(n => Number.isFinite(n)) as number[];
      const finalNums = rows.map(r => Number(r.finalScore)).filter(n => Number.isFinite(n)) as number[];

      nextModel.qualitative.footer ??= { label: "Total" };
      (nextModel.qualitative.footer as any).aiScore = aiNums.length ? +aiNums.reduce((a, b) => a + b, 0).toFixed(2) : "-";
      (nextModel.qualitative.footer as any).finalScore = finalNums.length ? +finalNums.reduce((a, b) => a + b, 0).toFixed(2) : "-";

      return nextModel;
    });
  };

  /* ---------------- DataTable renderer (inline editing) ---------------- */
  function RatioTable({
    section,
    editableKind, // "rateScore" | "qualScore" | "none"
    onEdit,
  }: {
    section: Section;
    editableKind: "rateScore" | "qualScore" | "none";
    onEdit?: (rowIdx: number, value: number) => void;
  }) {
    // Build rows for render — for rateScore we use inline controls
    let editableCounter = 0;
    const rowsForRender = section.rows.map((r) => {
      if (r.isGroup) return r;

      // Part C (qualitative) case
      if (editableKind === "qualScore") {
        const idx = editableCounter++;
        return {
          ...r,
          aiScore: <span>{Number.isFinite(Number(r.aiScore)) ? Number(r.aiScore).toFixed(2) : (r.aiScore ?? "-")}</span>,
          finalScore: (
            <EditableNumber
              // @ts-expect-error rija
              value={r.finalScore}
              min={0}
              max={100}
              step={1}
              canEdit={canEdit}
              onSave={(n) => onEdit?.(idx, n)}
            />
          ),
        } as RatioRow;
      }

      // Part A/B case
      if (editableKind === "rateScore") {
        const idx = editableCounter++;
        return {
          ...r,
          rateScore: (
            <EditableRate
              // @ts-expect-error rija
              value={r.rateScore}
              canEdit={canEdit}
              onSave={(n) => onEdit?.(idx, n)}
            />
          ),
          score: <span>{calcRowScore(r)}</span>,
        } as RatioRow;
      }

      // non-editable simple case
      return r;
    });

    // Choose columns based on whether it's qualitative or not
    const columns: DTColumn<RatioRow>[] =
      editableKind === "qualScore"
        ? [
          { key: "label", header: section.columns[0], width: "40%", className: "p-6" },
          { key: "aiScore", header: section.columns[1] ?? "AI Score", align: "left" },
          { key: "finalScore", header: section.columns[2] ?? "Final Score", align: "left" },
        ]
        : [
          { key: "label", header: section.columns[0], width: "40%", className: "p-6" },
          { key: "ratio", header: section.columns[1] ?? "", align: "left" },
          { key: "fullRate", header: section.columns[2] ?? "", align: "left" },
          { key: "rateScore", header: section.columns[3] ?? "", align: "left" },
          { key: "score", header: section.columns[4] ?? "", align: "left" },
        ];

    const footer =
      section.footer && editableKind !== "none"
        ? {
          ...section.footer,
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

  /* ----------------- Confirm Scoring mutation ----------------- */
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (payload: PostCreditScoreRequest) => {
      if (!accessToken || !id) throw new Error("Missing params");
      const res = await PostCreditScore({ accessToken, caseId: id as string, body: payload });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credit-score-template"] });
      queryClient.invalidateQueries({ queryKey: ["credit-score", id] });
      onOpenChange(false);
    },
  });

  /* Build payload from current model */
  const buildPayload = (): PostCreditScoreRequest => {
    const pre = model.preScreening.rows
      .filter(r => !r.isGroup)
      .map(r => ({ key: r.key as any, score: Number(r.rateScore) })) as any[];

    const cash = model.cashflow.rows
      .filter(r => !r.isGroup)
      .map(r => ({ key: r.key as any, score: Number(r.rateScore) })) as any[];

    const qual = model.qualitative.rows
      .map(r => ({ category_id: Number(r.key), score: Number(r.finalScore) })) as any[];

    return {
      pre_screening: pre,
      cashflow_analysis: cash,
      qualitative_score: qual,
    };
  };

  /* Validation: enable confirm only when all editable fields are numbers */
  const allEditableFieldsFilled = React.useMemo(() => {
    if (!canEdit) return false;

    const preOk = model.preScreening.rows
      .filter(r => !r.isGroup)
      .every(r => Number.isFinite(Number(r.rateScore)));

    const cashOk = model.cashflow.rows
      .filter(r => !r.isGroup)
      .every(r => Number.isFinite(Number(r.rateScore)));

    const qualOk = model.qualitative.rows
      .every(r => Number.isFinite(Number(r.finalScore)));

    return preOk && cashOk && qualOk;
  }, [model, canEdit]);

  const handleConfirmScore = () => {
    const payload = buildPayload();
    mutation.mutate(payload as PostCreditScoreRequest);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-white max-h-full p-0 w-[1080px] sm:w-[1080px] max-w-none sm:max-w-none">
        <SheetHeader className="border-b ml-24 p-16">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center mr-6 gap-3">
              <div onClick={() => onOpenChange(false)} className="border p-3 rounded-md flex items-center cursor-pointer">
                <ChevronRight className="size-16" />
                <ChevronRight className="size-16 ml-[-22px]" />
              </div>
              <div>
                <SheetTitle className="leading-tight">Credit Score</SheetTitle>
              </div>
            </div>

            {canEdit && (
              <div>
                <Button
                  onClick={handleConfirmScore}
                  disabled={!allEditableFieldsFilled || mutation.isPending}
                  className={`m-12 p-16 text-white rounded-md shadow ${allEditableFieldsFilled && !mutation.isPending
                    ? "bg-[#EA5C2B] hover:brightness-95"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  {mutation.isPending ? "Saving..." : "Confirm Scoring"}
                </Button>
              </div>
            )}

          </div>
        </SheetHeader>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 px-24">
          <div className="xl:col-span-12 space-y-6">
            <Tabs value={tab} onValueChange={onTabChange} className="w-full">
              <TabsList className="w-full justify-start align-top overflow-x-auto border-b rounded-none gap-3 border-gray-200 p-16">
                <TabsTrigger
                  value="overview"
                  className="relative px-4 py-3 text-[15px] font-semibold text-gray-500
                 data-[state=active]:text-[#FF4700]
                 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[#FF4700]
                 data-[state=active]:after:w-full
                 transition-all duration-300 ease-in-out"
                >
                  Overview
                </TabsTrigger>

                <TabsTrigger
                  value="pre"
                  className="relative px-4 py-3 text-[15px] font-semibold text-gray-500
                 data-[state=active]:text-[#FF4700]
                 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[#FF4700]
                 data-[state=active]:after:w-full
                 transition-all duration-300 ease-in-out"
                >
                  Part A: Pre-Screening
                </TabsTrigger>

                <TabsTrigger
                  value="cash"
                  className="relative px-4 py-3 text-[15px] font-semibold text-gray-500
                 data-[state=active]:text-[#FF4700]
                 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[#FF4700]
                 data-[state=active]:after:w-full
                 transition-all duration-300 ease-in-out"
                >
                  Part B: Cashflow Analysis
                </TabsTrigger>

                <TabsTrigger
                  value="qual"
                  className="relative px-4 py-3 text-[15px] font-semibold text-gray-500
                 data-[state=active]:text-[#FF4700]
                 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[#FF4700]
                 data-[state=active]:after:w-full
                 transition-all duration-300 ease-in-out"
                >
                  Part C: Psychometric/Qualitative
                </TabsTrigger>
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
