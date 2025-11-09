import React from "react";

/** ---------- UI types ---------- */
export type RatioRow = {
 key?: string;
 label: string;
 ratio?: string | number;
 fullRate?: number | string;
 rateScore?: number | string | React.ReactNode;
 score?: number | string | React.ReactNode;
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

/** ---------- API payload types (adjust names if your API differs) ---------- */

/** Template / definition side */
export type CashflowTemplateItem = {
 key: string;
 value: string;
 ratio?: number | string;
 full_rate?: number | string;
 order?: number;
 header_key?: string | null;
 header_value?: string | null;
};

export type QualitativeTemplateItem = {
 category_id: number | string;
 // any other fields you may have in template
};

export type CreditScoreTemplate = {
 pre_screening?: {
  ratio_allocation?: number | string;
  credit_score_data?: Array<{ key: string; value?: string; ratio?: number | string }>;
 };
 cashflow_analysis?: {
  ratio_allocation?: number | string;
  credit_score_data?: CashflowTemplateItem[];
 };
 qualitative_score?: {
  ratio_allocation?: number | string;
  qualitative_score_data?: QualitativeTemplateItem[];
 };
};

/** Score / filled-in side */
export type ScoreItem = {
 key: string;
 score: number;
 // possibly other metadata from API
};

export type QualitativeScoreItem = {
 category_id: number | string;
 final_score: number;
 // other metadata
};

export type CreditScoreResponse = {
 pre_screening?: {
  credit_score_data?: ScoreItem[];
 };
 cashflow_analysis?: {
  credit_score_data?: ScoreItem[];
 };
 qualitative_score?: {
  qualitative_score_data?: QualitativeScoreItem[];
 };
};

/** ---------- Helpers ---------- */

/** Convert a number|string|undefined into a numeric value (removes non-numeric chars) */
const toNumber = (v: number | string | undefined): number =>
 typeof v === "number" ? v : v ? Number(String(v).replace(/[^\d.-]/g, "")) : NaN;

/** Parse percentage-like strings ("12.3%", "12.3") into a numeric percentage value */
const toPercent = (v: number | string | undefined): number => {
 if (v == null) return NaN;
 if (typeof v === "number") return v;
 const s = String(v).trim();
 return s.endsWith("%") ? parseFloat(s.slice(0, -1)) : parseFloat(s);
};

/** Safely extract a numeric value from unknown rateScore which may be number | string | ReactNode */
const extractNumeric = (v: number | string | React.ReactNode | undefined): number => {
 if (v == null) return NaN;
 if (typeof v === "number") return v;
 if (typeof v === "string") return toNumber(v);
 // For React.ReactNode or other types, try to coerce to string then parse
 try {
  const s = String((v as unknown) ?? "");
  return toNumber(s);
 } catch {
  return NaN;
 }
};

/** Sum numeric-looking entries; returns numeric sum (rounded to 2 decimals) or NaN */
const sumNumeric = (arr: Array<number | string | undefined>): number => {
 const raw = arr.reduce<number>((acc, v) => {
  const n = Number.isFinite(Number(v)) ? Number(v) : NaN;
  return Number.isFinite(n) ? acc + n : acc;
 }, 0);
 // round to 2 decimals  
 return Number(raw?.toFixed(2));
};

/** ---------- Calculations ---------- */

/** Calculate per-row score: returns number (rounded 2 decimals) or "-" when not computable */
export const calcRowScore = (row: RatioRow): number | string => {
 const p = toPercent(row.ratio);
 const full = toNumber(row.fullRate);
 const rate = extractNumeric(row.rateScore);
 if (Number.isFinite(p) && Number.isFinite(full) && Number.isFinite(rate) && full > 0) {
  return Number((p * (rate / full)).toFixed(2));
 }
 return "-";
};

/** ---------- Constants ---------- */

const PRE_SCREENING_LABELS: Record<string, string> = {
 ssm: "SSM",
 license: "License",
 kyc: "KYC (ID, Utility, off add)",
 signboard: "Signboard (Pss)",
 identity_check: "Identity check for directors/partners",
};

export function mergeTemplateAndScore(
 templateData: CreditScoreTemplate,
 scoreData: CreditScoreResponse,
 fallbackIcons?: {
  overview?: React.ReactNode;
  pre?: React.ReactNode;
  cash?: React.ReactNode;
  qual?: React.ReactNode;
 }
): CreditScoreData {
 // Overview rows
 const overviewRows: RatioRow[] = [
  {
   label: "Part A: Pre Screening",
   ratio: `${templateData?.pre_screening?.ratio_allocation ?? 0}%`,
   score: "-",
  },
  {
   label: "Part B: Cashflow Analysis",
   ratio: `${templateData?.cashflow_analysis?.ratio_allocation ?? 0}%`,
   score: "-",
  },
  {
   label: "Part C: Qualitative",
   ratio: `${templateData?.qualitative_score?.ratio_allocation ?? 0}%`,
   score: "-",
  },
 ];

 // Cashflow groups
 const raw: CashflowTemplateItem[] = (templateData?.cashflow_analysis?.credit_score_data ?? []).slice();
 raw.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

 const groups = new Map<string, { header_value?: string | null; items: CashflowTemplateItem[] }>();
 raw.forEach((it) => {
  const hk = it.header_key ?? "default";
  if (!groups.has(hk)) groups.set(hk, { header_value: it.header_value ?? undefined, items: [] });
  groups.get(hk)!.items.push(it);
 });

 const cashflowRows: RatioRow[] = [];
 groups.forEach((g, hk) => {
  cashflowRows.push({ isGroup: true, label: g.header_value ?? "", key: `grp-${hk}` });
  g.items.forEach((it) => {
   cashflowRows.push({
    key: it.key,
    label: it.value,
    ratio: it.ratio,
    fullRate: it.full_rate,
    rateScore: "-",
    score: "-",
   });
  });
 });

 // Pre-screening keys (use score data keys if available, otherwise fallback constant list)
 const preKeysFromScore: string[] = (scoreData?.pre_screening?.credit_score_data ?? []).map((r) => r.key);
 const preKeys = preKeysFromScore.length ? preKeysFromScore : Object.keys(PRE_SCREENING_LABELS);
 const preRows: RatioRow[] = preKeys.map((k) => ({
  key: k,
  label: PRE_SCREENING_LABELS[k] ?? k,
  ratio: undefined,
  fullRate: 5,
  rateScore: "-",
  score: "-",
 }));

 // Qualitative rows
 const qualRaw: QualitativeTemplateItem[] = templateData?.qualitative_score?.qualitative_score_data ?? [];
 const qualRows: RatioRow[] = qualRaw.map((q) => ({
  key: String(q.category_id),
  label: `Category ${q.category_id}`,
  score: "-",
 }));

 // Scores maps
 const scoreMap = new Map<string, number>();
 (scoreData?.cashflow_analysis?.credit_score_data ?? []).forEach((s) => scoreMap.set(s.key, s.score));
 (scoreData?.pre_screening?.credit_score_data ?? []).forEach((s) => scoreMap.set(s.key, s.score));

 const qualMap = new Map<number, number>();
 (scoreData?.qualitative_score?.qualitative_score_data ?? []).forEach((q) =>
  qualMap.set(Number(q.category_id), q.final_score)
 );

 // Apply scores helper
 const applyScores = (rows: RatioRow[]) =>
  rows.map((r) => {
   if (r.isGroup) return r;
   const s = r.key ? scoreMap.get(r.key) : undefined;
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
 const qualApplied = qualRows.map((r) => {
  const cid = Number(r.key);
  const final = qualMap.get(cid);
  return { ...r, score: typeof final === "number" ? final : "-" };
 });

 // Footers
 const preFooter: RatioRow = {
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
 const cashFooter: RatioRow = {
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

 const qualFooter: RatioRow = {
  label: "Total",
  score: (() => {
   const s = qualApplied.map((r) => (typeof r.score === "number" ? r.score : NaN));
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
   icon: fallbackIcons?.overview,
  },
  preScreening: {
   title: "Part A: Pre Screening",
   columns: ["Compliance", "Ratio Allocation", "Full Rate", "Rate Score", "Score"],
   rows: preRowsApplied,
   footer: preFooter,
   icon: fallbackIcons?.pre,
  },
  cashflow: {
   title: "Part B: Cashflow Analysis",
   columns: ["Compliance", "Ratio Allocation", "Full Rate", "Rate Score", "Score / 100"],
   rows: cashflowApplied,
   footer: cashFooter,
   icon: fallbackIcons?.cash,
  },
  qualitative: {
   title: "Part C: Qualitative",
   columns: ["Category", "Score"],
   rows: qualApplied,
   footer: qualFooter,
   icon: fallbackIcons?.qual,
  },
 } as CreditScoreData;
}
