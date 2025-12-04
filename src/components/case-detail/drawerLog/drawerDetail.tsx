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
    // UPDATED: header columns for overview as requested
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
    columns: ["Compliance", "Ratio Allocation", "Rate Score", "Score"],
    rows: [],
    footer: { label: "Total", rateScore: "-", score: "-" },
  },
  cashflow: {
    title: "Part B: Cashflow Analysis",
    icon: <Banknote className="size-16" />,
    columns: ["Compliance", "Ratio Allocation", "Rate Score", "Score / 100"],
    rows: [],
    footer: { label: "Total", rateScore: "-", score: "-" },
  },
  qualitative: {
    title: "Part C: Qualitative",
    icon: <ClipboardList className="size-16" />,
    columns: ["Category", "AI Score", "AI Reasoning", "Final Score"],
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

/* ------------- NEW: calcRowScore scaled to 0-100 -------------- */
/* Score = ratio% * (rateScore / MAX_RATE)  -> produces 0..100 contribution */
const MAX_RATE = 5;

const calcRowScore = (row: RatioRow) => {
  const p = toPercent(row.ratio); // e.g. 24
  const rate = toNumber(row.rateScore); // e.g. 4
  if (Number.isFinite(p) && Number.isFinite(rate) && MAX_RATE > 0) {
    return +(p * (rate / MAX_RATE)).toFixed(2);
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
  // Normalize inputs
  const tpl = templateData?.data ?? templateData ?? {};
  const sc = scoreData?.data ?? scoreData ?? {};

  /* ---------- PRE (unchanged) ---------- */
  const preRaw = tpl?.pre_screening?.credit_score_data ?? [];
  const preKeys = preRaw.length
    ? preRaw
    : Object.keys(PRE_SCREENING_LABELS).map((k, i) => ({
      key: k,
      value: PRE_SCREENING_LABELS[k],
      ratio: i === 4 ? 4 : 24,
      order: i + 1,
    }));

  const preRows: RatioRow[] = preKeys
    .slice()
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
    .map((it: any) => ({
      key: it.key,
      label: it.value,
      ratio: typeof it.ratio === "number" ? `${it.ratio}%` : it.ratio,
      rateScore: "-",
      score: "-",
    }));

  /* ---------- CASHFLOW: group by header_key, but keep original order ---------- */
  const raw = (tpl?.cashflow_analysis?.credit_score_data ?? [])
    .slice()
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0));

  // maintain insertion order of groups
  const groupsOrder: string[] = [];
  const groups = new Map<string, { header_value?: string; items: any[] }>();

  raw.forEach((it: any) => {
    const hk = it.header_key ?? "default";
    if (!groups.has(hk)) {
      groups.set(hk, { header_value: it.header_value, items: [] });
      groupsOrder.push(hk);
    }
    groups.get(hk)!.items.push(it);
  });

  // build a flattened list of rows but attach groupKey on item rows for later subtotal calc
  const cashflowRawRows: RatioRow[] = [];
  groupsOrder.forEach((hk) => {
    const g = groups.get(hk)!;
    // header row (marker)
    cashflowRawRows.push({
      isGroup: true,
      isHeader: true,
      label: g.header_value ?? "",
      key: `grp-${hk}`,
    } as any);

    // item rows (attach groupKey)
    g.items.forEach((it) => {
      cashflowRawRows.push({
        key: it.key,
        label: it.value,
        ratio: typeof it.ratio === "number" ? `${it.ratio}%` : it.ratio,
        rateScore: "-",
        score: "-",
        // custom helper for grouping/subtotals
        groupKey: hk,
      } as any);
    });
    // we'll insert a single Sub Total (for entire Part B) AFTER all groups
  });

  /* ---------- QUAL (unchanged) ---------- */
  /* ---------- QUAL (updated: hardcoded categories + mapping from scoreData) ---------- */

  // Hardcoded categories (as requested)
  const HARD_CODED_QUAL_CATS = [
    { category_id: 1, key: "emotional_stability", order: 1, max_scale: 6 },
    { category_id: 2, key: "response_timing", order: 2, max_scale: 4 },
    { category_id: 3, key: "consistency", order: 3, max_scale: 6 },
    { category_id: 4, key: "demeanor", order: 4, max_scale: 4 },
  ];

  // breakdown object from score response (prefer scoreData)
  const partCBreakdown =
    sc?.qualitative_score?.raw_part_c_data?.part_c_score_breakdown ??
    tpl?.qualitative_score?.raw_part_c_data?.part_c_score_breakdown ??
    {};

  // map final/editable scores from scoreData.qualitative_score.qualitative_score_data (by category_id)
  const qualFinalMap = new Map<number, number>();
  (sc?.qualitative_score?.qualitative_score_data ?? []).forEach((q: any) => {
    const cid = Number(q.category_id);
    if (Number.isFinite(cid)) {
      qualFinalMap.set(cid, q.final_score ?? q.score);
    }
  });

  // Build rows using HARD_CODED_QUAL_CATS, mapping aiScore & aiReason from partCBreakdown by key,
  // and finalScore from qualFinalMap by category_id.
  const qualApplied: RatioRow[] = HARD_CODED_QUAL_CATS.map((cat) => {
    const breakdown = partCBreakdown?.[cat.key] ?? {};
    // aiScore from breakdown.score (may be numeric)
    const aiScoreVal =
      typeof breakdown?.score === "number"
        ? +(breakdown.score.toFixed?.(2) ?? breakdown.score)
        : breakdown?.score ?? "-";
    // ensure aiReason visible (use "-" if empty)
    const aiReasonVal = (typeof breakdown?.reason === "string" && breakdown.reason.trim() !== "") ? breakdown.reason : "-";
    let finalFromMap;
    if (qualFinalMap.has(cat.category_id)) {
      finalFromMap = qualFinalMap.get(cat.category_id);
    } else {
      // default to aiScore
      const ai = typeof breakdown?.score === "number"
        ? +(breakdown.score.toFixed?.(2) ?? breakdown.score)
        : Number(breakdown?.score);

      finalFromMap = Number.isFinite(ai) ? ai : 0;
    }

    return {
      key: String(cat.category_id),
      label: `${cat.category_id}. ${cat.key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())}`,
      aiScore: Number.isFinite(Number(aiScoreVal))
        ? +Number(aiScoreVal).toFixed(2)
        : (aiScoreVal ?? "-"),
      aiReason: aiReasonVal,
      finalScore: Number.isFinite(Number(finalFromMap))
        ? Number(finalFromMap)
        : (finalFromMap ?? "-"),
    } as RatioRow;

  });

  // qualitative footer sums (aiScore and finalScore)
  const qualFooter = {
    label: "Total",
    aiScore: (() => {
      const nums = qualApplied.map((r) => (Number.isFinite(Number(r.aiScore)) ? Number(r.aiScore) : NaN));
      const s = sumNumeric(nums);
      return Number.isFinite(s) ? s : "-";
    })(),
    finalScore: (() => {
      const nums = qualApplied.map((r) => (Number.isFinite(Number(r.finalScore)) ? Number(r.finalScore) : NaN));
      const s = sumNumeric(nums);
      return Number.isFinite(s) ? s : "-";
    })(),
  };


  /* ---------- build maps from scoreData ---------- */
  const scoreMap = new Map<string, number>();
  (sc?.cashflow_analysis?.credit_score_data ?? []).forEach((s: any) => scoreMap.set(s.key, s.score));
  (sc?.pre_screening?.credit_score_data ?? []).forEach((s: any) => scoreMap.set(s.key, s.score));

  const qualMap = new Map<number, number>();
  (sc?.qualitative_score?.qualitative_score_data ?? []).forEach((q: any) =>
    qualMap.set(Number(q.category_id), q.final_score ?? q.score)
  );

  /* ---------- apply scores to pre rows ---------- */
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

  /* ---------- apply scores to cashflow raw rows (items only) ---------- */
  const cashflowAppliedTemp = cashflowRawRows.map((r) => {
    if (r.isHeader) return r;
    // item row: get score from map
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

  /* ---------- now build grouped cashflow rows (headers + children), then a single Sub Total ---------- */
  const cashflowApplied: RatioRow[] = [];
  // For each group in the same order, push: header, children
  groupsOrder.forEach((hk) => {
    // header
    const headerRow = cashflowAppliedTemp.find((rr) => rr.isHeader && rr.key === `grp-${hk}`);
    if (headerRow) {
      cashflowApplied.push(headerRow);
    } else {
      // fallback header if not found
      cashflowApplied.push({ isGroup: true, isHeader: true, label: groups.get(hk)!.header_value ?? "", key: `grp-${hk}` } as any);
    }

    // children
    const children = cashflowAppliedTemp.filter((rr) => !rr.isHeader && rr.groupKey === hk);
    children.forEach((c) => cashflowApplied.push(c));
  });

  // --- AFTER all groups: compute a single Sub Total row for the entire Part B ---
  const cashItemsForSubtotal = cashflowApplied.filter((r) => !r.isGroup && !r.isFooter);
  const ratioSumTotal = sumNumeric(cashItemsForSubtotal.map((c) => toNumber(c.ratio)));
  const rateScoreSumTotal = sumNumeric(cashItemsForSubtotal.map((c) => (typeof c.rateScore === "number" ? c.rateScore : NaN)));
  const scoreSumTotal = sumNumeric(cashItemsForSubtotal.map((c) => (typeof c.score === "number" ? c.score : NaN)));

  cashflowApplied.push({
    isGroup: true,
    isFooter: true,
    label: "Sub Total",
    ratio: Number.isFinite(ratioSumTotal) ? `${ratioSumTotal}%` : "-",
    rateScore: Number.isFinite(rateScoreSumTotal) ? rateScoreSumTotal : "-",
    score: Number.isFinite(scoreSumTotal) ? scoreSumTotal : "-",
    key: `sub-total`,
  } as any);

  /* ---------- footers ---------- */
  const preFooter = {
    label: "Total",
    rateScore: (() => {
      const s = preRowsApplied.map((r) => (typeof r.rateScore === "number" ? r.rateScore : NaN));
      const sum = sumNumeric(s);
      return Number.isFinite(sum) ? sum : "-";
    })(),
    score: (() => {
      const s = preRowsApplied.filter((r) => !r.isGroup).map((r) => (typeof r.score === "number" ? r.score : NaN));
      const sum = sumNumeric(s);
      return Number.isFinite(sum) ? sum : "-";
    })(),
  };

  const cashItems = cashflowApplied.filter((r) => !r.isGroup && !r.isFooter);
  const cashFooter = {
    label: "Total",
    rateScore: (() => {
      const s = cashItems.map((r) => (typeof r.rateScore === "number" ? r.rateScore : NaN));
      const sum = sumNumeric(s);
      return Number.isFinite(sum) ? sum : "-";
    })(),
    score: (() => {
      const s = cashItems.map((r) => (typeof r.score === "number" ? r.score : NaN));
      const sum = sumNumeric(s);
      return Number.isFinite(sum) ? sum : "-";
    })(),
  };

  /* ---------- overview contributions & rows (as before) ---------- */
  const preContribution = Number.isFinite(preFooter.score as number) ? Number(preFooter.score) : 0;
  const cashContribution = Number.isFinite(cashFooter.score as number) ? Number(cashFooter.score) : 0;
  const qualFinalSum = Number.isFinite(qualFooter.finalScore as number) ? Number(qualFooter.finalScore) : NaN;
  const qualRatio = toNumber(tpl?.qualitative_score?.ratio_allocation ?? tpl?.qualitative_score ?? 0);
  const qualContribution = Number.isFinite(qualFinalSum) ? +((qualFinalSum / 100) * qualRatio).toFixed(2) : 0;
  const overviewCombined = +(preContribution + cashContribution + qualContribution).toFixed(2);

  const overviewRows: RatioRow[] = [
    {
      label: "Part A: Pre Screening",
      ratio: `${tpl?.pre_screening?.ratio_allocation ?? 0}%`,
      score: Number.isFinite(preContribution) ? preContribution : "-",
    },
    {
      label: "Part B: Cashflow Analysis",
      ratio: `${tpl?.cashflow_analysis?.ratio_allocation ?? 0}%`,
      score: Number.isFinite(cashContribution) ? cashContribution : "-",
    },
    {
      label: "Part C: Qualitative",
      ratio: `${tpl?.qualitative_score?.ratio_allocation ?? 0}%`,
      score: Number.isFinite(qualContribution) ? qualContribution : "-",
    },
  ];

  return {
    overview: {
      title: "Overview",
      // ensure overview columns reflect the requested header labels
      columns: ["Category", "Ratio Allocation", "Ratio Score"],
      rows: overviewRows,
      footer: { label: "Total", ratio: "100%", score: overviewCombined },
      icon: demoData.overview.icon,
    },
    preScreening: {
      title: "Part A: Pre Screening",
      columns: ["Compliance", "Ratio Allocation", "Rate Score", "Score"],
      rows: preRowsApplied,
      footer: preFooter,
      icon: demoData.preScreening.icon,
    },
    cashflow: {
      title: "Part B: Cashflow Analysis",
      columns: ["Compliance", "Ratio Allocation", "Rate Score", "Score / 100"],
      rows: cashflowApplied,
      footer: cashFooter,
      icon: demoData.cashflow.icon,
    },
    qualitative: {
      title: "Part C: Qualitative",
      columns: ["Category", "AI Score", "AI Reasoning", "Final Score"],
      rows: qualApplied,
      footer: {
        label: "Total",
        aiScore: qualFooter.aiScore,
        finalScore: qualFooter.finalScore,
      } as any,
      icon: demoData.qualitative.icon,
    }
  } as CreditScoreData;
}

/* ---------------- Editable controls ---------------- */

/**
 * EditableRate
 * - presented as a dropdown button in table cell
 * - CLOSED state styling: width 189px, height 32px, radius 6px, border 1px gray-300, padding ~ top8 right12 bottom8 left12
 * - OPEN state: popup list with selected item highlighted and a check icon
 */
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

  // map numeric to label quickly
  const currentLabel = options.find((o) => String(o.value) === String(value))?.value ?? display;

  return (
    <div className="relative inline-block">
      {/* CLOSED - styled button */}
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center justify-between h-8 w-[189px] p-16 rounded-[6px] border border-gray-300 gap-1 text-sm bg-white"
          title="Edit"
        >
          <span className="truncate">{currentLabel}</span>
          {/* caret */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="ml-2">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
      ) : (
        // OPEN - dropdown list
        <div className="absolute z-30 mt-2 w-[220px] bg-white border border-gray-200 rounded-md shadow">
          <ul className="text-sm">
            {options.map((o) => {
              const selected = String(o.value) === String(value);
              return (
                <li key={o.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onSave(o.value);
                      setOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between gap-2 ${selected ? "bg-gray-50" : "hover:bg-gray-50"}`}
                  >
                    <span className="truncate">{o.label}</span>
                    {selected ? <Check className="size-14 text-[#EA5C2B]" /> : null}
                  </button>
                </li>
              );
            })}
          </ul>
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
      <div className=" flex items-center justify-start gap-2">
        <div className="text-right">
          <span className="inline-block">{Number.isFinite(Number(value)) ? value : (value ?? "-")}</span>
        </div>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="inline-flex items-center justify-center p-1"
          title="Edit final score"
          aria-label="Edit final score"
        >
          <Pencil className="size-12 text-gray-500" />
        </button>
      </div>
    );
  }

  return (
    <>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={draft as number | string}
        onChange={(e) => {
          const v = e.target.value.replace(/[^\d]/g, "");
          setDraft(v === "" ? "" : Number(v));
        }}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
            if (draft !== "" && !Number.isNaN(Number(draft))) onSave(Number(draft));
            setEditing(false);
          }
          if (e.key === "Escape") setEditing(false);
        }}
        className="
        w-[70px]
        bg-[#EEF2F6]
        px-3 py-2
        text-sm
        border-0
        border-b
        border-b-[#FF4700]
        focus:outline-none
        focus:border-b-2
        focus:border-b-[#FF4700]
        rounded-none
        text-right
        "
        style={{
          WebkitAppearance: "none",
          MozAppearance: "textfield",
        }}
      />

      <button
        className="w-2"
        onClick={() => {
          if (draft !== "" && !Number.isNaN(Number(draft))) onSave(Number(draft));
          setEditing(false);
        }}
        title="Save"
      >
        <Check className="size-14 text-[#00A36F]" />
      </button>
    </>
  );

}

/* ---------------- Main drawer component ----------------- */
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
  const { data: dataInit } = useCaseDetailContext();
  // @ts-expect-error rija
  const accessToken = session.data?.accessToken ?? "";
  const canEdit = dataInit?.stage === "1st_review";

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
      let targetIdx = -1;
      let count = -1;
      for (let i = 0; i < rows.length; i++) {
        if (!rows[i].isGroup && !rows[i].isHeader && !rows[i].isFooter) {
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

      const numericRows = rows.filter(r => !r.isGroup && !r.isHeader && !r.isFooter);
      const sumRate = sumNumeric(numericRows.map(r => typeof r.rateScore === "number" ? r.rateScore : NaN));
      const sumScore = sumNumeric(numericRows.map(r => typeof r.score === "number" ? r.score : NaN));

      nextModel[sectionKey].footer ??= { label: "Total" };
      nextModel[sectionKey].footer!.rateScore = Number.isFinite(sumRate) ? sumRate : "-";
      nextModel[sectionKey].footer!.score = Number.isFinite(sumScore) ? sumScore : "-";

      // Also update overview combined score live: recompute overview using current template ratios
      try {
        const tpl = templateData?.data ?? templateData ?? {};
        const preContribution = Number.isFinite(Number(nextModel.preScreening.footer?.score)) ? Number(nextModel.preScreening.footer!.score) : 0;
        const cashContribution = Number.isFinite(Number(nextModel.cashflow.footer?.score)) ? Number(nextModel.cashflow.footer!.score) : 0;

        const qualRatioLocal = toNumber(tpl?.qualitative_score?.ratio_allocation ?? 0);
        const qualFinalSumLocal = Number.isFinite(Number(nextModel.qualitative.footer?.finalScore)) ? Number(nextModel.qualitative.footer!.finalScore) : NaN;
        const qualContributionLocal = Number.isFinite(qualFinalSumLocal) ? +((qualFinalSumLocal / 100) * qualRatioLocal).toFixed(2) : 0;

        const overviewCombined = +(preContribution + cashContribution + qualContributionLocal).toFixed(2);

        // set overview rows and footer
        nextModel.overview.footer ??= { label: "Total", ratio: "100%", score: overviewCombined };
        nextModel.overview.footer!.score = overviewCombined;

        nextModel.overview.rows = [
          { label: "Part A: Pre Screening", ratio: `${tpl?.pre_screening?.ratio_allocation ?? 0}%`, score: Number.isFinite(preContribution) ? preContribution : "-" },
          { label: "Part B: Cashflow Analysis", ratio: `${tpl?.cashflow_analysis?.ratio_allocation ?? 0}%`, score: Number.isFinite(cashContribution) ? cashContribution : "-" },
          { label: "Part C: Qualitative", ratio: `${tpl?.qualitative_score?.ratio_allocation ?? 0}%`, score: Number.isFinite(qualContributionLocal) ? qualContributionLocal : "-" },
        ];
      } catch {
        // noop
      }

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

      // update overview combined similarly
      try {
        const tpl = templateData?.data ?? templateData ?? {};
        const preContribution = Number.isFinite(Number(nextModel.preScreening.footer?.score)) ? Number(nextModel.preScreening.footer!.score) : 0;
        const cashContribution = Number.isFinite(Number(nextModel.cashflow.footer?.score)) ? Number(nextModel.cashflow.footer!.score) : 0;

        const qualRatioLocal = toNumber(tpl?.qualitative_score?.ratio_allocation ?? 0);
        const qualFinalSumLocal = Number.isFinite(Number(nextModel.qualitative.footer?.finalScore)) ? Number(nextModel.qualitative.footer!.finalScore) : NaN;
        const qualContributionLocal = Number.isFinite(qualFinalSumLocal) ? +((qualFinalSumLocal / 100) * qualRatioLocal).toFixed(2) : 0;

        const overviewCombined = +(preContribution + cashContribution + qualContributionLocal).toFixed(2);

        nextModel.overview.footer ??= { label: "Total", ratio: "100%", score: overviewCombined };
        nextModel.overview.footer!.score = overviewCombined;

        nextModel.overview.rows = [
          { label: "Part A: Pre Screening", ratio: `${tpl?.pre_screening?.ratio_allocation ?? 0}%`, score: Number.isFinite(preContribution) ? preContribution : "-" },
          { label: "Part B: Cashflow Analysis", ratio: `${tpl?.cashflow_analysis?.ratio_allocation ?? 0}%`, score: Number.isFinite(cashContribution) ? cashContribution : "-" },
          { label: "Part C: Qualitative", ratio: `${tpl?.qualitative_score?.ratio_allocation ?? 0}%`, score: Number.isFinite(qualContributionLocal) ? qualContributionLocal : "-" },
        ];
      } catch {
      }

      return nextModel;
    });
  };

  /* Replace your existing RatioTable with this function */
  function RatioTable({
    section,
    editableKind,
    onEdit,
  }: {
    section: Section;
    editableKind: "rateScore" | "qualScore" | "none";
    onEdit?: (rowIdx: number, value: number) => void;
  }) {
    // Helpers
    const isGrouped = section.rows.some((r: any) => r.isHeader);
    const labelCol = section.columns?.[0] ?? "Label";
    const ratioCol = section.columns?.[1] ?? "Ratio";
    const rateCol = section.columns?.[2] ?? "";
    const scoreCol = section.columns?.[3] ?? "Score";

    // Build groups (preserve order)
    const groups: { header: any; items: RatioRow[] }[] = [];
    let current: { header: any; items: RatioRow[] } | null = null;
    section.rows.forEach((r: any) => {
      if (r.isHeader) {
        current = { header: r, items: [] };
        groups.push(current);
        return;
      }
      if (r.isFooter) {
        // footer rows (Sub Total) we will handle after groups
        return;
      }
      // normal item
      if (!current) {
        current = { header: { label: "" }, items: [] };
        groups.push(current);
      }
      current.items.push(r);
    });

    // find Sub Total row (single)
    const subtotalRow: any = section.rows.find((r: any) => r.isFooter && (r.label === "Sub Total" || r.isFooter));

    // section footer (Total)
    const sectionFooter: any = section.footer ?? null;

    // Render helpers for row cells
    let editableCounter = 0;
    const rowTextClass = "font-medium text-[14px] leading-[20px] text-[#121926] font-inter whitespace-pre-wrap";

    const renderLabelCell = (r: RatioRow) => (
      <div className={rowTextClass}>{r.label}</div>
    );

    const renderRatioCell = (r: RatioRow) => <div>{r.ratio ?? "-"}</div>;
    const renderRateCell = (r: any) => {
      if (editableKind === "rateScore") {
        const idx = editableCounter++;
        return (
          <div>
            <EditableRate
              value={r.rateScore}
              canEdit={canEdit}
              onSave={(n) => onEdit?.(idx, n)}
            />
          </div>
        );
      }
      if (editableKind === "qualScore") {
        const idx = editableCounter++;
        return (
          <EditableNumber
            value={r.finalScore}
            min={0}
            max={100}
            step={1}
            canEdit={canEdit}
            onSave={(n) => onEdit?.(idx, n)}
          />
        );
      }
      return <div>{r.rateScore ?? "-"}</div>;
    };
    const renderScoreCell = (r: RatioRow) => <div>{typeof r.score === "number" ? r.score : (r.score ?? "-")}</div>;
    const renderQualAiCell = (r: RatioRow) => (
      <div className={rowTextClass}>
        {Number.isFinite(Number(r.aiScore))
          ? Number(r.aiScore).toFixed(2)
          : (r.aiScore ?? "-")}
      </div>
    );

    const renderQualFinalCell = (r: RatioRow, idxForQual?: number) => {
      return (
        <EditableNumber
          // @ts-expect-error rija
          value={r.finalScore}
          min={0}
          max={100}
          step={1}
          canEdit={canEdit}
          onSave={(n) => onEdit?.(idxForQual ?? 0, n)}
        />
      );
    };

    // If not grouped, fallback to previous DataTable behavior (small mapping)
    if (!isGrouped) {
      const rowsForRender = section.rows.map((r: any) => {
        if (r.isGroup || r.isHeader || r.isFooter) return r;
        if (editableKind === "qualScore") {
          const idx = editableCounter++;
          const reasonText = (r.aiReason ?? "").toString() || "-";
          return {
            ...r,
            aiScore: <span>{Number.isFinite(Number(r.aiScore)) ? Number(Number(r.aiScore).toFixed?.(2) ?? r.aiScore) : (r.aiScore ?? "-")}</span>,
            aiReason: (
              <div
                className={`max-w-[520px] truncate ${rowTextClass}`}
                title={reasonText}
              >
                {reasonText}
              </div>
            ),

            finalScore: (
              <EditableNumber
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
        if (editableKind === "rateScore") {
          const idx = editableCounter++;
          return {
            ...r,
            rateScore: (
              <EditableRate
                value={r.rateScore}
                canEdit={canEdit}
                onSave={(n) => onEdit?.(idx, n)}
              />
            ),
            score: <span>{calcRowScore(r)}</span>
          } as RatioRow;
        }
        return r;
      });
      const footer = section.footer && editableKind !== "none" ? { ...section.footer } : section.footer;

      return (
        <div>
          <div className="py-3 mt-[16px] flex items-center gap-2">
            <div className="font-medium text-sm">{section.title}</div>
          </div>
          <div className="p-0">
            <DataTable
              columns={
                editableKind === "qualScore"
                  ? [
                    { key: "label", header: labelCol, width: "10%", className: "p-6" },
                    {
                      key: "aiScore",
                      header: (
                        <span
                          className="font-semibold text-[12px] leading-[18px]"
                          style={{
                            background: "linear-gradient(45deg, #AD00FE 0%, #00E0EE 100%)",
                            WebkitBackgroundClip: "text",
                            color: "transparent",
                          }}
                        >
                          {section.columns[1] ?? "AI Score"}
                        </span>
                      ),
                      align: "left",
                    },
                    {
                      key: "aiReason",
                      header: (
                        <span
                          className="font-semibold text-[12px] leading-[18px]"
                          style={{
                            background: "linear-gradient(45deg, #AD00FE 0%, #00E0EE 100%)",
                            WebkitBackgroundClip: "text",
                            color: "transparent",
                          }}
                        >
                          {section.columns[2] ?? "AI Reasoning"}
                        </span>
                      ),
                      align: "left",
                    },
                    { key: "finalScore", header: section.columns[3] ?? "Final Score", align: "left" },

                  ]
                  : // Non-qual sections:
                  // If section defines 3 columns (overview case: Category | Ratio Allocation | Ratio Score)
                  section.columns && section.columns.length === 3 && editableKind === "none"
                    ? [
                      { key: "label", header: labelCol, width: "40%", className: "p-6" },
                      { key: "ratio", header: section.columns[1] ?? ratioCol, align: "left" },
                      { key: "score", header: section.columns[2] ?? scoreCol, align: "left" },
                    ]
                    : [
                      // fallback: label | ratio | rateScore | score (existing behavior)
                      { key: "label", header: labelCol, width: "40%", className: "p-6" },
                      { key: "ratio", header: ratioCol ?? "", align: "left" },
                      { key: "rateScore", header: rateCol ?? "", align: "left" },
                      { key: "score", header: scoreCol ?? "", align: "left" },
                    ]
              }
              rows={[...rowsForRender, ...(footer ? [footer] : [])]}
              zebra
              dense
            />

          </div>
        </div>
      );
    }

    // GROUPED rendering with plain table markup
    return (
      <div>
        <div className="py-3 mt-[16px] flex items-center gap-2">
          <div className="font-medium text-sm">{section.title}</div>
        </div>

        <div className="overflow-hidden rounded-md border">
          <table className="min-w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-12 py-3 text-gray-500 text-left text-sm font-medium text-muted-foreground">{labelCol}</th>
                {editableKind === "qualScore" ? null : (
                  <>
                    <th className="px-6 py-3 text-gray-900 text-left text-sm font-medium text-muted-foreground">{ratioCol}</th>
                    <th className="px-6 py-3 text-gray-900 text-left text-sm font-medium text-muted-foreground">{rateCol}</th>
                  </>
                )}

                {editableKind === "qualScore" ? (
                  <>
                    <th className="px-6 py-3">
                      <span
                        className="font-semibold text-[12px] leading-[18px]"
                        style={{
                          background: "linear-gradient(45deg, #AD00FE 0%, #00E0EE 100%)",
                          WebkitBackgroundClip: "text",
                          color: "transparent",
                        }}
                      >
                        {section.columns[1] ?? "AI Score"}
                      </span>
                    </th>

                    <th className="px-6 py-3 ">
                      <span
                        className="font-semibold text-[12px] leading-[18px]"
                        style={{
                          background: "linear-gradient(45deg, #AD00FE 0%, #00E0EE 100%)",
                          WebkitBackgroundClip: "text",
                          color: "transparent",
                        }}
                      >
                        {section.columns[2] ?? "AI Reasoning"}
                      </span>
                    </th>

                    <th className="px-6 py-3 text-right text-sm font-medium text-muted-foreground" style={{ width: 50 }}>
                      {section.columns[3] ?? "Final Score"}
                    </th>


                  </>
                ) : (
                  <th className="px-6 py-3 text-left text-gray-500 text-sm font-medium text-muted-foreground">{scoreCol}</th>
                )}

              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {groups.map((g, gi) => (
                <React.Fragment key={`g-${gi}`}>
                  {/* full-width group header */}
                  <tr className="bg-gray-100 text-gray-600 font-medium">
                    <td className="p-12 text-14 border-t border-gray-200" colSpan={editableKind === "qualScore" ? 3 : 4}>
                      {g.header.label}
                    </td>
                  </tr>

                  {/* group items */}
                  {g.items.map((r: any, idx: number) => (
                    <tr key={`${g.header?.label || "grp"}-item-${idx}`} className="bg-white">
                      <td className="p-12">
                        <div className={rowTextClass}>{renderLabelCell(r)}</div></td>

                      {editableKind === "qualScore" ? (
                        <>
                          <td className="p-12 text-sm text-gray-900 font-medium w-[620px] align-top">
                            {renderQualAiCell(r)}
                          </td>

                          <td className="px-6 py-3 text-sm text-gray-900 font-medium text-right" style={{ width: 200 }}>
                            {renderQualFinalCell(r, gi + idx)}
                          </td>

                        </>
                      ) : (
                        <>
                          <td className="p-12">
                            <div className={rowTextClass}>{renderRatioCell(r)}</div></td>
                          <td className="p-12">
                            <div className={rowTextClass}>{renderRateCell(r)}</div></td>
                          <td className="p-12 text-right">
                            <div className={rowTextClass}>{renderScoreCell(r)}</div></td>
                        </>
                      )}
                    </tr>
                  ))}
                </React.Fragment>
              ))}

              {/* Sub Total row (single, right before Total) */}
              {subtotalRow && (
                <tr className="font-semibold bg-gray-100">
                  <td className="p-12 text-14 text-gray-900 font-semibold border-t border-gray-200">{subtotalRow.label ?? "Sub Total"}</td>
                  {editableKind === "qualScore" ? (
                    <>
                      <td className="px-6 py-3 text-14 text-gray-900 font-medium border-t border-gray-200">{subtotalRow.aiScore ?? "-"}</td>
                      <td className="px-6 py-3 text-14 text-gray-900 font-medium border-t border-gray-200">{subtotalRow.aiReason ?? "-"}</td>
                      <td className="px-6 py-3 text-14 text-gray-900 font-medium border-t border-gray-200 text-right" style={{ width: 100 }}>{subtotalRow.finalScore ?? "-"}</td>

                    </>
                  ) : (
                    <>
                      <td className="px-6 py-3 text-14 text-gray-900 font-medium border-t border-gray-200">{subtotalRow.ratio ?? "-"}</td>
                      <td className="px-6 py-3 text-14 text-gray-900 font-medium border-t border-gray-200">{subtotalRow.rateScore ?? "-"}</td>
                      <td className="px-6 py-3 text-14 text-gray-900 font-medium border-t border-gray-200">{subtotalRow.score ?? "-"}</td>
                    </>
                  )}
                </tr>
              )}

              {/* Section footer (Total) as final row */}
              {sectionFooter && (
                <tr className="bg-gray-100">
                  <td className="p-12 text-14 text-right text-gray-900 font-semibold border-t border-gray-200">{sectionFooter.label ?? "Total"}</td>
                  {editableKind === "qualScore" ? (
                    <>
                      <td className="px-6 py-3 text-sm text-gray-900 font-medium border-t border-gray-200">{(sectionFooter as any).aiScore ?? "-"}</td>
                      <td className="px-6 py-3 text-sm text-gray-900 font-medium border-t border-gray-200">{(sectionFooter as any).aiReason ?? "-"}</td>
                      <td className="px-6 py-3 text-sm text-gray-900 font-medium border-t border-gray-200">{(sectionFooter as any).finalScore ?? "-"}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-3 text-sm text-gray-900 font-medium border-t border-gray-200"></td>
                      <td className="px-6 py-3 text-sm text-gray-900 font-medium border-t border-gray-200"></td>
                      <td className="px-6 py-3 text-sm text-gray-900 font-medium border-t border-gray-200">{(sectionFooter as any).score ?? "-"}</td>
                    </>
                  )}
                </tr>
              )}
            </tbody>
          </table>
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
      .filter(r => !r.isGroup && !r.isHeader && !r.isFooter)
      .map(r => ({ key: r.key as any, score: Number(r.rateScore) })) as any[];

    const cash = model.cashflow.rows
      .filter(r => !r.isGroup && !r.isHeader && !r.isFooter)
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
      .filter(r => !r.isGroup && !r.isHeader && !r.isFooter)
      .every(r => Number.isFinite(Number(r.rateScore)));

    const cashOk = model.cashflow.rows
      .filter(r => !r.isGroup && !r.isHeader && !r.isFooter)
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
                <div className="grid grid-cols-1 gap-8">
                  <RatioTable
                    section={model.qualitative}
                    editableKind="qualScore"
                    onEdit={(rowIdx, val) => updateQualScore(rowIdx, val)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
