"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DataTable, DTColumn } from "@/components/common/DataTable";
import {
 CheckCircle2,
 ListChecks,
 MessageSquareText,
 Images,
 X,
 Sparkles,
 PlayCircle,
 ChevronRight,
} from "lucide-react";
import { Avatar } from "../ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

// ---------------- Types ----------------
export type ChecklistItem = { text: string; done?: boolean };
export type KeyValueField = { label: string; value: React.ReactNode };
export type TranscriptMessage = { role: "Staff" | "Client"; time?: string; text: string };
export type Screenshot = { url: string; caption?: string };

export type VideoCallLogData = {
 checklist: ChecklistItem[];
 structured: KeyValueField[];
 operatorNotes: string;
 videoUrl?: string;
 transcript: TranscriptMessage[];
 screenshots: Screenshot[];
};

// --------------- Demo data ---------------
const demoData: VideoCallLogData = {
 checklist: [
  { text: "Verify the applicant’s identity and confirm personal details.", done: true },
  { text: "Discuss the purpose of the loan and how the funds will be utilized.", done: true },
  { text: "Assess the applicant’s business financials and credit history.", done: true },
  { text: "Explain loan terms, interest rates, and repayment options clearly.", done: false },
  { text: "Provide a detailed breakdown of current financial status.", done: false },
  { text: "Outline credit history and relevant financial documents.", done: false },
 ],
 structured: [
  { label: "Requested Loan Amount", value: "75K" },
  { label: "Loan Purpose / How funds will be used", value: "100K" },
  { label: "Preferred Loan Term", value: "36 months" },
  { label: "Desired Start Date", value: "2025-09-01" },
  { label: "Annual Revenue", value: "1.2M" },
  { label: "Current Debts/Loans", value: "150K" },
  { label: "Monthly Expenses", value: "80K" },
  { label: "Assets / Collateral", value: "Factory building (2.5M), 2 company vehicles" },
  { label: "Risk Factors", value: "-" },
  { label: "Defaults or Late Payments", value: "-" },
 ],
 operatorNotes:
  "The call between the Admin and Borrower took place on [Date and Time]. The Borrower is in the process of confirming the desired loan amount and repayment terms. The Admin provided information regarding the loan conditions, interest rates, and required procedures.",
 videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
 transcript: [
  { role: "Staff", time: "00:08", text: "Hello, welcome to Fundingbee. How can I assist you today?" },
  { role: "Client", time: "01:12", text: "Hi, I'd like to know more about the online loan options you offer." },
  { role: "Staff", time: "01:16", text: "Certainly. We offer personal loans with competitive rates and flexible terms." },
  { role: "Client", time: "02:20", text: "Yes, I need funds for personal reasons. Can you tell me the maximum amount I can borrow?" },
 ],
 screenshots: [
  { url: "https://placehold.co/160x120" },
  { url: "https://placehold.co/160x120" },
  { url: "https://placehold.co/160x120" },
  { url: "https://placehold.co/160x120" },
  { url: "https://placehold.co/160x120" },
 ],
};

// --------------- Small UI bits ---------------
function SectionTitle({ title }: { icon?: React.ReactNode; title: string }) {
 return (
  <div className="py-3 mt-24 flex items-center gap-2">
   <div className="font-semibold text-grey-900 text-18">{title}</div>
  </div>
 );
}

function Checklist({ items }: { items: ChecklistItem[] }) {
 return (
  <div className="rounded-xl border bg-white p-3">
   <ul className="space-y-2">
    {items.map((it, idx) => (
     <li key={idx} className="flex items-start gap-3 text-sm">
      <CheckCircle2 className={`size-16 mt-[2px] ${it.done ? "text-emerald-600" : "text-muted-foreground opacity-50"}`} />
      <span>{it.text}</span>
     </li>
    ))}
   </ul>
  </div>
 );
}

function StructuredTable({ rows }: { rows: KeyValueField[] }) {
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
    <DataTable<Row> columns={columns} rows={rows} />
   </div>
  </div >
 );
}

function OperatorNotes({ text }: { text: string }) {
 return (
  <div className="rounded-xl border bg-white p-3 text-sm leading-relaxed">
   {text}
  </div>
 );
}

function VideoPlayer({ src }: { src?: string }) {
 if (!src) return null;
 return (
  <div className="rounded-xl border overflow-hidden bg-black">
   <div className="relative w-full aspect-video">
    <video src={src} controls className="w-full h-full" />
    <PlayCircle className="size-16 absolute left-3 top-3 text-white/80" />
   </div>
  </div>
 );
}

function Transcript({ items }: { items: TranscriptMessage[] }) {
 return (
  <div className="rounded-xl border bg-white p-16">
   <ul className="space-y-3">
    {items.map((m, i) => (
     <li key={i} className="flex justify-start items-start">
      <Avatar className="h-24 w-24 mr-8">
       <AvatarImage className="object-cover" width={24} height={24} src="https://placehold.co/600x400" alt="user" />
       <AvatarFallback>U</AvatarFallback>
      </Avatar>

      <div>
       <div className="mb-1 text-muted-foreground font-medium">
        <b className="text-gray-900 text-14">{m.role}</b> {m.time ? <span className="ml-1 text-gray-700 text-12 font-semibold">{m.time}</span> : null}
       </div>
       <div className="rounded-lg bg-muted/20 text-gray-700 text-14 font-medium">{m.text}</div>
      </div>
     </li>
    ))}
   </ul>
  </div>
 );
}

function Screenshots({ items }: { items: Screenshot[] }) {
 return (
  <div className="">
   <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
    {items.map((s, i) => (
     <div key={i} className="relative aspect-[4/3] rounded-md overflow-hidden border">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={s.url} alt="screenshot" className="w-full h-full object-cover" />
     </div>
    ))}
   </div>
  </div>
 );
}

// ---------------- Main Drawer ----------------
export default function VideoCallLogDrawer({
 open,
 onOpenChange,
 data = demoData,
}: {
 open: boolean;
 onOpenChange: (open?: string) => void;
 data?: VideoCallLogData;
}) {
 const [tab, setTab] = React.useState("checklist");
 const refChecklist = React.useRef<HTMLDivElement | null>(null);
 const refStructured = React.useRef<HTMLDivElement | null>(null);
 const refOperator = React.useRef<HTMLDivElement | null>(null);
 const refVideo = React.useRef<HTMLDivElement | null>(null);
 const refTranscript = React.useRef<HTMLDivElement | null>(null);
 const refScreens = React.useRef<HTMLDivElement | null>(null);

 const onTabChange = (v: string) => {
  setTab(v);
  const map: Record<string, HTMLDivElement | null> = {
   checklist: refChecklist.current,
   structured: refStructured.current,
   operator: refOperator.current,
   video: refVideo.current,
   transcript: refTranscript.current,
   screenshots: refScreens.current,
  };
  requestAnimationFrame(() => map[v]?.scrollIntoView({ behavior: "smooth", block: "start" }));
 };

 return (
  <Sheet open={open} onOpenChange={() => onOpenChange()}>
   <SheetContent side="right" className="bg-white p-0 w-[1080px] sm:w-[1080px] max-w-none sm:max-w-none">
    <SheetHeader className="border-b">
     <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
       <ChevronRight className="size-16" />
       <ChevronRight className="size-16 ml-[-22px]" />
       <SheetTitle>Video Call Log</SheetTitle>
      </div>
      <SheetClose asChild>
       <Button variant="ghost" size="icon"><X className="size-16" /></Button>
      </SheetClose>
     </div>
    </SheetHeader>

    <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 px-24 pt-4">
     <div className="xl:col-span-12 space-y-6">
      <Tabs value={tab} onValueChange={onTabChange} className="w-full">
       <TabsList className="w-full justify-start overflow-x-auto">
        <TabsTrigger value="checklist">Checklist</TabsTrigger>
        <TabsTrigger value="structured">Structured Notes</TabsTrigger>
        <TabsTrigger value="operator">Operator Notes</TabsTrigger>
        <TabsTrigger value="video">Video Call Recording</TabsTrigger>
        <TabsTrigger value="transcript">Transcript</TabsTrigger>
        <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
       </TabsList>
      </Tabs>

      <div className="space-y-6 pr-2 overflow-y-auto max-h-[calc(92vh-120px)]">
       <div ref={refChecklist} className="scroll-mt-[100px]">
        <SectionTitle icon={<ListChecks className="size-16" />} title="Checklist" />
        <Checklist items={data.checklist} />
       </div>

       <div ref={refStructured} className="scroll-mt-[100px]">
        <StructuredTable rows={data.structured} />
       </div>

       <div ref={refOperator} className="scroll-mt-[100px]">
        <SectionTitle title="Operator Notes" />
        <OperatorNotes text={data.operatorNotes} />
       </div>

       <div ref={refVideo} className="scroll-mt-[100px]">
        <SectionTitle title="Video Call Recording" />
        <VideoPlayer src={data.videoUrl} />
       </div>

       <div ref={refTranscript} className="scroll-mt-[100px]">
        <SectionTitle icon={<MessageSquareText className="size-16" />} title="Transcript" />
        <Transcript items={data.transcript} />
       </div>

       <div ref={refScreens} className="scroll-mt-[100px]">
        <SectionTitle icon={<Images className="size-16" />} title="Screenshots" />
        <Screenshots items={data.screenshots} />
       </div>
      </div>
     </div>
    </div>
   </SheetContent>
  </Sheet>
 );
}
