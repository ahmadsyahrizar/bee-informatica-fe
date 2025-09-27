"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable, DTColumn } from "@/components/common/DataTable";
import logoFundingBee from "../../../../../../public/logo/fundingBeeLogo.svg";
import phoneDone from "../../../../../../public/icons/phone-done.svg";
import exampleTranscription from "../../../../../../public/icons/example-transcription.svg";
import { Download } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";

/* ---------------- Types ---------------- */
export type CLItem = { id: string | number; text: string; checked?: boolean };
export type KV = { label: string; value: React.ReactNode };
export type TranscriptMessage = { role: "Staff" | "Client"; time?: string; text: string };

/* --------------- Demo data --------------- */
const CHECKLIST: CLItem[] = [
 { id: 1, text: "How much can you commit to repay per month?", checked: true },
 { id: 2, text: "If we offered X amount for 1 year, would you accept?", checked: true },
 { id: 3, text: "Why is this loan amount necessary? Provide detailed breakdown.", checked: true },
 { id: 4, text: "Please explain your business in detail.", checked: true },
 { id: 5, text: "What is your SSM registration year?", checked: true },
 { id: 6, text: "Is your office owned or rented? Provide tenancy contract if rented.", checked: true },
 { id: 7, text: "When did you actually start your business operations?", checked: true },
 { id: 8, text: "Why and how did you start this business?" },
 { id: 9, text: "What were your previous work experiences?" },
 { id: 10, text: "How do you usually acquire customers (repeat/referral/social media)?" },
 { id: 11, text: "How many customers do you have per month on average?" },
 { id: 12, text: "What is the average sales per customer?" },
 { id: 13, text: "Name your 3–5 main customers and their contract terms." },
 { id: 14, text: "What percentage of payments are cash vs online? & term & any delays?" },
 { id: 15, text: "Do you have social media or website? Please provide links." },
 { id: 16, text: "Are there any other revenue streams besides your main business?" },
 { id: 17, text: "What are your total monthly expenses? (Breakdown required)" },
 { id: 18, text: "Do you have any existing loans from banks/P2P/money lenders?" },
 { id: 19, text: "How do you manage during difficult times (low sales, delays)?" },
 { id: 20, text: "What are your backup plans to pay us during difficulties?" },
 { id: 21, text: "Is there anyone who can offer support during difficult times?" },
 { id: 22, text: "What percentage of cash flow comes from your main business?" },
 { id: 23, text: "How much was your initial capital?" },
];

const STRUCTURED: KV[] = [
 { label: "Requested Loan Amount", value: "75K" },
 { label: "Loan Purpose / How funds will be used", value: "100K" },
 { label: "Preferred Loan Term", value: "36 months" },
 { label: "Desired Start Date", value: "2025-09-01" },
 { label: "Annual Revenue", value: "1.2M" },
 { label: "Current Debts/Loans", value: "150K" },
 { label: "Monthly Expenses", value: "80K" },
 { label: "Assets / Collateral", value: "Factory building (valued at 2.5M), 2 company vehicles" },
 { label: "Risk Factors", value: "-" },
 { label: "Defaults or Late Payments", value: "-" },
];

const TRANSCRIPT: TranscriptMessage[] = [
 { role: "Staff", time: "0:08", text: "Hello, welcome to [Platform Name]. How can I assist you today?" },
 { role: "Client", time: "0:12", text: "Hi, I'd like to know more about the online loan options you offer." },
 { role: "Staff", time: "0:16", text: "Certainly! We offer personal loans with competitive interest rates and flexible repayment terms. Are you looking for a loan for any specific purpose?" },
 { role: "Client", time: "0:20", text: "Yes, I need funds for personal reasons. Can you tell me the maximum amount I can borrow?" },
 { role: "Staff", time: "0:22", text: "We offer loans ranging from RM1,000 to RM30,000. The amount you can apply for will depend on factors such as your income, credit score, and other financial information." },
];

/* ---------------- Small bits ---------------- */
function SectionHeader({ title }: { title: string }) {
 return <div className="font-semibold text-gray-900 mb-2 mt-6">{title}</div>;
}

function StructuredTable({ rows }: { rows: KV[] }) {
 type Row = { key: string; label: React.ReactNode; colon: string; value: React.ReactNode };
 const data: Row[] = rows.map((r, i) => ({ key: String(i), label: r.label, colon: ":", value: r.value }));
 const cols: DTColumn<Row>[] = [
  { key: "label", header: "", width: "48%", className: "p-10 text-gray-600" },
  { key: "colon", header: "", width: "2%", className: "p-10 text-gray-400" },
  { key: "value", header: "", width: "50%", className: "p-10" },
 ];
 return (
  <div className="rounded-xl border bg-white">
   <div className="px-16 py-10">
    <DataTable<Row> columns={cols} rows={data} />
   </div>
  </div>
 );
}

function TranscriptList({ items }: { items: TranscriptMessage[] }) {
 return (
  <div className="rounded-xl border bg-white">
   <div className="p-12">
    <ul className="space-y-4 mt-2 pr-1">
     {items.map((m, i) => (
      <li key={i} className="flex items-start gap-3">
       <Avatar className={`h-24 w-24 mt-1 ${m.role === "Staff" ? "bg-violet-100" : "bg-amber-100"}`}>
        <AvatarImage src="" />
        <AvatarFallback className={`${m.role === "Staff" ? "text-violet-700" : "text-amber-700"} text-[10px]`}>
         {m.role === "Staff" ? "S" : "C"}
        </AvatarFallback>
       </Avatar>
       <div>
        <div className="mb-1 text-[11px] text-gray-500 font-medium">
         <span className="text-gray-900 font-semibold">{m.role}</span>
         {m.time ? <span className="ml-1">{m.time}</span> : null}
        </div>
        <div className="mb-24 rounded-lg bg-muted/30 text-sm text-gray-700">{m.text}</div>
       </div>
      </li>
     ))}
    </ul>
   </div>
  </div>
 );
}

/* ---------------- Main Page ---------------- */
export default function ConfirmPhoneLogPage() {
 const [tab, setTab] = React.useState("checklist");
 const { push } = useRouter();
 const { id } = useParams();
 const params = useSearchParams();

 // stage: phone | meet | review1 | final
 const stageParam = (params.get("stage") ?? "phone").toLowerCase();
 const isPhone = stageParam === "phone";
 const isMeet = stageParam === "meet";
 const isReview1 = stageParam === "review1";
 const isFinal = stageParam === "final";

 // dynamic labels
 const stageLabel =
  isPhone ? "Phone" : isMeet ? "Meet" : isReview1 ? "1st Review" : "Final Review";

 const pageTitle =
  isPhone ? "Confirm Phone Log" :
   isMeet ? "Confirm Meet Log" :
    isReview1 ? "Confirm 1st Review Notes" :
     "Confirm Final Review Notes";

 const recordingHeader =
  isPhone ? "Voice Call Recording" :
   isMeet ? "Video Call Recording" :
    "Review Attachments";

 const successTitle =
  isPhone ? "Transcription successfully uploaded" :
   isMeet ? "Recording successfully uploaded" :
    isReview1 ? "Review notes saved" :
     "Final review notes saved";

 // refs for tab scroll
 const refChecklist = React.useRef<HTMLDivElement | null>(null);
 const refStructured = React.useRef<HTMLDivElement | null>(null);
 const refOperator = React.useRef<HTMLDivElement | null>(null);
 const refRecording = React.useRef<HTMLDivElement | null>(null);
 const refTranscript = React.useRef<HTMLDivElement | null>(null);

 // checklist ticks
 const [checked, setChecked] = React.useState(
  new Set(CHECKLIST.filter(c => c.checked).map(c => c.id))
 );
 const toggle = (cid: CLItem["id"], value: boolean) =>
  setChecked(prev => {
   const next = new Set(prev);
   value ? next.add(cid) : next.delete(cid);
   return next;
  });

 // nav handlers
 const handleBack = () => {
  // keep stage context on back
  push(`/cases/${id}?stage=${stageParam}`);
 };

 const handleNextStage = () => {
  // trigger confirmation state on case details for this stage
  push(`/cases/${id}?stage=${stageParam}&status=confirmation`);
 };

 const onTabChange = (v: string) => {
  setTab(v);
  const map: Record<string, HTMLDivElement | null> = {
   checklist: refChecklist.current,
   structured: refStructured.current,
   operator: refOperator.current,
   recording: refRecording.current,
   transcript: refTranscript.current,
  };
  requestAnimationFrame(() =>
   map[v]?.scrollIntoView({ behavior: "smooth", block: "start" })
  );
 };

 // which tabs to show: recording/transcript only for phone/meet
 const showRecording = isPhone || isMeet;
 const showTranscript = isPhone || isMeet;

 return (
  <div className="min-h-screen bg-white">
   {/* Top brand bar */}
   <div className="border-b">
    <div className="mx-auto max-w-[1100px] py-[22px] flex items-center justify-center">
     <Image src={logoFundingBee} width={154} height={27} alt="funding-bee" />
    </div>
   </div>

   <div className="mx-auto max-w-[1100px] px-6 pt-[40px] pb-14">
    <div className="text-[18px] font-semibold text-gray-900 mb-2">
     {pageTitle}
    </div>

    {/* Tabs */}
    <Tabs value={tab} onValueChange={onTabChange}>
     <TabsList className="h-9 bg-transparent p-0 gap-6 border-b border-t rounded-none">
      <TabsTrigger value="checklist" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-500 data-[state=active]:text-brand-600">
       Checklist
      </TabsTrigger>
      <TabsTrigger value="structured" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-500 data-[state=active]:text-brand-600">
       Structured Notes
      </TabsTrigger>
      <TabsTrigger value="operator" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-500 data-[state=active]:text-brand-600">
       {isReview1 || isFinal ? `${stageLabel} Notes` : "Operator Notes"}
      </TabsTrigger>
      {showRecording && (
       <TabsTrigger value="recording" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-500 data-[state=active]:text-brand-600">
        {recordingHeader}
       </TabsTrigger>
      )}
      {showTranscript && (
       <TabsTrigger value="transcript" className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-500 data-[state=active]:text-brand-600">
        Transcript
       </TabsTrigger>
      )}
     </TabsList>
    </Tabs>

    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-[40px] mt-6">
     {/* Main column */}
     <div className="space-y-8">
      {/* Checklist */}
      <div ref={refChecklist} className="scroll-mt-[120px]">
       <SectionHeader title="Checklist" />
       <div className="rounded-xl border bg-white">
        <ul className="divide-y">
         {CHECKLIST.map(item => (
          <li key={item.id} className="flex items-start gap-3 p-12">
           <Checkbox
            checked={checked.has(item.id)}
            onCheckedChange={(v) => toggle(item.id, Boolean(v))}
            className="shadow-none h-16 w-16 rounded-[3px] border border-gray-300 mt-[2px]
                                   data-[state=checked]:bg-brand-500 data-[state=checked]:border-brand-500 data-[state=checked]:text-white
                                   [&_svg]:w-[15px] [&_svg]:h-[10px] [&_svg]:stroke-[3px]
                                   data-[state=checked]:[&_svg]:relative data-[state=checked]:[&_svg]:left-[2px] data-[state=checked]:[&_svg]:top-[3px]"
           />
           <p className="text-sm leading-relaxed text-gray-700">{item.text}</p>
          </li>
         ))}
        </ul>
       </div>
      </div>

      {/* Structured Notes */}
      <br />
      <div ref={refStructured} className="scroll-mt-[120px]">
       <div className="flex items-center gap-2 mb-2">
        <SectionHeader title="Structured Notes" />
        <Badge className="ml-2 text-[10px]">AI</Badge>
       </div>
       <StructuredTable rows={STRUCTURED} />
      </div>

      {/* Operator / Reviewer Notes */}
      <br />
      <div ref={refOperator} className="scroll-mt-[120px]">
       <SectionHeader title={isReview1 || isFinal ? `${stageLabel} Notes` : "Operator Notes"} />
       <div className="rounded-xl border bg-white p-12 text-sm leading-relaxed text-gray-700">
        {isReview1 || isFinal
         ? `Summary of ${stageLabel.toLowerCase()} assessment goes here. Add reviewer remarks, risk flags, and required follow-ups.`
         : "The call between the Admin and Borrower took place on [Date and Time]..."}
       </div>
      </div>

      {/* Recording (only for phone/meet) */}
      {showRecording && (
       <>
        <br />
        <div ref={refRecording} className="scroll-mt-[120px]">
         <SectionHeader title={recordingHeader} />
         <div className="rounded-xl border bg-white p-12">
          <div className="w-full h-10 rounded-full bg-gray-100 flex items-center px-4">
           <div className="h-1.5 bg-brand-500 rounded-full" style={{ width: "32%" }} />
          </div>
          <div className="mt-2 text-[11px] text-gray-500 flex justify-between">
           <span>02:11</span>
           <span>30:00</span>
          </div>
         </div>
        </div>
       </>
      )}

      {/* Transcript (only for phone/meet) */}
      {showTranscript && (
       <>
        <br />
        <div ref={refTranscript} className="scroll-mt-[120px]">
         <div className="flex justify-between items-center">
          <SectionHeader title="Transcript" />
          <div className="flex justify-end">
           <Button variant="outline" size="icon" className="h-24 w-24">
            <Download className="size-16" />
           </Button>
          </div>
         </div>
         <TranscriptList items={TRANSCRIPT} />
        </div>
       </>
      )}
     </div>

     {/* Right rail */}
     <div className="space-y-4">
      <div className="rounded-[24px] border border-gray-200 bg-gray-50 p-32 mt-[38px]">
       <div className="mx-auto mb-[32px] grid place-items-center">
        <Image src={phoneDone} width={80} height={80} alt="stage-complete" />
       </div>
       <div className="text-center">
        <div className="font-semibold text-gray-900 mb-[12px]">{successTitle}</div>
        <Image width={268} height={74} src={exampleTranscription} alt="attachment" />
       </div>
       <div className="mt-[32px] space-y-2">
        <Button onClick={handleNextStage} className="w-full bg-brand-500 hover:bg-brand-600 text-white">
         Save Log
        </Button>
        <Button onClick={handleBack} variant="outline" className="w-full">
         Discard and Go Back
        </Button>
       </div>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}
