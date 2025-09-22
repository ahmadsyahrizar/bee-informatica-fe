"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, DTColumn } from "@/components/common/DataTable";
import {
 FileBadge2,
 ShieldCheck,
 ClipboardList,
 Banknote,
 X,
 ChevronRight,
} from "lucide-react";

// --- Types ---
export type RatioRow = {
 label: string;
 ratio?: string | number;
 fullRate?: number | string;
 rateScore?: number | string;
 score?: number | string;
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

// --- Demo data ---
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
   { label: "Avg balance of bank statement", ratio: "35%", fullRate: 5 },
   { label: "Repayment amount a month A/B>3", ratio: "10%", fullRate: 5 },
   { label: "Transition 6 mo balance stable", ratio: "10%", fullRate: 5 },
   { label: "Sudden inc/dec reason", ratio: "5%", fullRate: 5 },
   { isGroup: true, label: "Cash flow coming from main business (>70%)" },
   { label: "Cash flow from main business", ratio: "15%", fullRate: 5 },
   { label: "Other revenue stream", ratio: "5%", fullRate: 5 },
   { label: "Cash flow (C) = (A) - (B)", ratio: "15%", fullRate: 5 },
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

// --- Table with DataTable ---
function RatioTable({ section }: { section: Section }) {
 const columns: DTColumn<RatioRow>[] = [
  { key: "label", header: section.columns[0], width: "40%", className: 'p-6' },
  { key: "ratio", header: section.columns[1] ?? "", align: "left" },
  { key: "fullRate", header: section.columns[2] ?? "", align: "left" },
  { key: "rateScore", header: section.columns[3] ?? "", align: "left" },
  { key: "score", header: section.columns[4] ?? "", align: "left" },
 ];

 return (
  <div>
   <div className="py-3 mt-[16px] flex items-center gap-2">
    <div className="font-medium text-sm">{section.title}</div>
   </div>
   <div className="p-0">
    <DataTable
     columns={columns}
     rows={[...(section.rows ?? []), ...(section.footer ? [section.footer] : [])]}
     zebra
     dense
    />
   </div>
  </div>
 );
}

// --- Radar placeholder ---
function RadarCard() {
 return (
  <div className="mt-[60px]">
   <div className="aspect-square w-full rounded-xl border grid place-items-center text-xs text-muted-foreground">
    Add your radar chart here
   </div>
  </div>
 );
}

// --- Main component ---
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
  const el = map[v]?.current;
  if (el) {
   el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
 };

 return (
  <Sheet open={open} onOpenChange={onOpenChange}>
   <SheetContent side="right" className="bg-white max-h-full p-0 w-[1080px] sm:w-[1080px] max-w-none sm:max-w-none">
    <SheetHeader className="border-b ml-24">
     <div className="flex items-center justify-between gap-3">
      <div className="flex items-center mr-6">
       <ChevronRight className="size-16" />
       <ChevronRight className="size-16 ml-[-11px]" />
       <div>
        <SheetTitle className="leading-tight">Credit Score</SheetTitle>
       </div>
      </div>
      <SheetClose asChild>
       <Button variant="ghost" size="icon"><X className="size-16" /></Button>
      </SheetClose>
     </div>
    </SheetHeader>

    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 px-24">
     <div className="xl:col-span-12 space-y-6">
      <Tabs value={tab} onValueChange={onTabChange} className="w-full">
       <TabsList className="w-full justify-start align-top overflow-x-auto">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="pre">Part A: Pre‑Screening</TabsTrigger>
        <TabsTrigger value="cash">Part B: Cashflow Analysis</TabsTrigger>
        <TabsTrigger value="qual">Part C: Psychometric/Qualitative</TabsTrigger>
       </TabsList>
      </Tabs>

      <div className="space-y-6 pr-2 overflow-y-auto max-h-[calc(92vh-100px)]">
       <div ref={overviewRef} id="section-overview">
        <RatioTable section={data.overview} />
       </div>
       <div ref={preRef} id="section-pre">
        <RatioTable section={data.preScreening} />
       </div>
       <div ref={cashRef} id="section-cash">
        <RatioTable section={data.cashflow} />
       </div>
       <div ref={qualRef} id="section-qual">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <RatioTable section={data.qualitative} />
         <RadarCard />
        </div>
       </div>
      </div>
     </div>
    </div>
   </SheetContent>
  </Sheet>
 );
}
