"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
 Video as VideoIcon,
 Camera,
 Mic,
 MicOff,
 Volume2,
 VolumeX,
 PhoneOff,
 Clock,
} from "lucide-react";
import aiBadge from "../../../../../../public/icons/ai-badge.svg"
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ImageLightbox } from "@/components/case-detail/media/ImageLightbox";
import { PhotoItem } from "@/components/case-detail/media/photoSection";

// ---------------- Types ----------------
export type CLItem = { id: string | number; text: string };
export type TranscriptMessage = { role: "Staff" | "Client"; time?: string; text: string };

// --------------- Demo data ---------------

const photos: PhotoItem[] = [
 { id: 1, url: "https://images.unsplash.com/photo-1528605105345-5344ea20e269?q=80&w=1600&auto=format&fit=crop" },
 { id: 2, url: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop" },
 { id: 3, url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600&auto=format&fit=crop" },
 { id: 4, url: "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?q=80&w=1600&auto=format&fit=crop" },
 { id: 5, url: "https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?q=80&w=1600&auto=format&fit=crop" },
];


const CL: CLItem[] = [
 { id: 1, text: "Verify the applicant's identity and confirm personal details." },
 { id: 2, text: "Discuss the purpose of the loan and how the funds will be utilized." },
 { id: 3, text: "Assess the applicant's business financials and credit history." },
 { id: 4, text: "Explain loan terms, interest rates, and repayment options clearly." },
 { id: 5, text: "Provide a detailed breakdown of current financial status, including income and expenses." },
 { id: 6, text: "List any existing debts or loans, along with their repayment terms." },
 { id: 7, text: "Outline your credit history and any relevant financial documents to support your application." },
];

const TX: TranscriptMessage[] = [
 { role: "Staff", time: "0:08", text: "Hello, welcome to [Platform Name]. How can I assist you today?" },
 { role: "Client", time: "0:12", text: "Hi, I'd like to know more about the online loan options you offer." },
 { role: "Staff", time: "0:16", text: "Certainly! We offer personal loans with competitive interest rates and flexible repayment terms. Are you looking for a loan for any specific purpose?" },
 { role: "Client", time: "0:20", text: "Yes, I need funds for personal reasons. Can you tell me the maximum amount I can borrow?" },
 { role: "Staff", time: "0:22", text: "We offer loans ranging from RM1,000 to RM30,000. The amount you can apply for will depend on factors such as your income, credit score, and other financial information." },
];

// ---------------- Helpers ----------------
function useTimer(started: boolean) {
 const [seconds, setSeconds] = React.useState(0);
 React.useEffect(() => {
  if (!started) return;
  const id = setInterval(() => setSeconds((s) => s + 1), 1000);
  return () => clearInterval(id);
 }, [started]);
 const mm = Math.floor(seconds / 60)
  .toString()
  .padStart(2, "0");
 const ss = (seconds % 60).toString().padStart(2, "0");
 return `${mm}:${ss}`;
}

// ---------------- Page ----------------
export default function VideoInterviewPage() {
 const [checked, setChecked] = React.useState<Set<CLItem["id"]>>(new Set([1]));
 const [muted, setMuted] = React.useState(false);
 const [speaker, setSpeaker] = React.useState(true);
 const [open, setOpen] = React.useState(false);
 const [index, setIndex] = React.useState(0);
 const [camDisabled, setCamDisabled] = React.useState(false);
 const [shots, setShots] = React.useState(0);
 const duration = useTimer(true);
 const { push } = useRouter();
 const { id: caseId } = useParams();


 const toggle = (id: CLItem["id"], value: boolean) => {
  setChecked((prev) => {
   const next = new Set(prev);
   value ? next.add(id) : next.delete(id);
   return next;
  });
 };

 const openAt = (i: number) => {
  setIndex(i);
  setOpen(true);

 };
 const takeScreenshot = () => setShots((n) => n + 1);

 return (
  <>
   <div className="min-h-screen bg-[#0D121C] text-white">
    {/* Header */}
    <div className="mx-auto px-16 pt-3 pb-3">
     <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
       <VideoIcon className="size-20" />
       <span className="text-base font-semibold">Video Interview</span>
       <Image src={aiBadge} alt="phine" />
      </div>

      <Button onClick={() => setOpen(true)} variant="outline" className="h-8 p-12 rounded-md border-white/20 text-white/90 bg-white/5 hover:bg-white/10">
       Screenshot Library ({shots})
      </Button>
     </div>
    </div>

    {/* Content */}
    <div className="mx-auto px-16 pb-24">
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      {/* Left: video tiles */}
      <div className="grid grid-row-2 gap-3 space-y-4">
       {/* Remote video */}
       <div className="relative rounded-xl overflow-hidden bg-black ring-1 ring-white/10">
        {/* placeholder image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1587691592099-24045742c181?q=80&w=1600&auto=format&fit=crop" alt="remote" className="h-full w-full object-cover" />
        <div className="absolute left-3 bottom-3 flex items-center gap-2 rounded-md bg-black/60 px-2 py-1 text-[12px]">
         <div className="h-5 w-5 rounded-full bg-white/20 grid place-items-center">LJ</div>
         <span>Lim Wei Jun</span>
         {muted && <MicOff className="size-16 text-red-400" />}
        </div>
        <button onClick={takeScreenshot} className="absolute right-3 bottom-3 grid place-items-center h-9 w-9 rounded-full bg-white/20 hover:bg-white/30">
         <Camera className="size-16" />
        </button>
       </div>

       {/* Self view */}
       <div className="relative rounded-xl overflow-hidden bg-black ring-1 ring-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600&auto=format&fit=crop" alt="self" className="h-full w-full object-cover" />
        <div className="absolute left-3 bottom-3 flex items-center gap-2 rounded-md bg-black/60 px-2 py-1 text-[12px]">
         <div className="h-5 w-5 rounded-full bg-white/20 grid place-items-center">DH</div>
         <span>David Hunter (You)</span>
        </div>
       </div>
      </div>

      {/* Middle: checklist + notes */}
      <div className="space-y-4 grid grid-row gap-3">
       <div className="rounded-xl bg-white text-gray-900 p-12 shadow-sm ring-1 ring-black/5">
        <div className="font-semibold mb-3 pb-2 text-gray-900 border-b">Checklist</div>
        <ul className="divide-y">
         {CL.map((item) => (
          <li key={item.id} className="flex items-start gap-3 py-3">
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

       <div className="rounded-xl bg-white text-gray-900 p-4 shadow-sm ring-1 ring-black/5">
        <div className="flex items-center justify-between p-12">
         <div className="font-semibold text-gray-900">Operator Notes</div>
         <Button onClick={takeScreenshot} size="sm" className="h-7 px-2 bg-orange-100 text-orange-700 hover:bg-orange-200">Take Screenshot</Button>
        </div>
        <textarea
         placeholder="Write your own notes..."
         className="mt-2 w-full h-[220px] resize-none rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-brand-500/40"
        />
       </div>
      </div>

      {/* Right: transcript */}
      <div className="rounded-xl bg-white text-gray-900 p-4 shadow-sm ring-1 ring-black/5">
       <div className="font-semibold mb-3 p-12 text-gray-900 border-b">Live Transcript</div>
       <div className="max-h-[560px] overflow-y-auto p-12">
        <ul className="space-y-4">
         {TX.map((m, i) => (
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
            <div className="text-sm text-gray-700 mb-16">
             {m.text}
            </div>
           </div>
          </li>
         ))}
        </ul>
       </div>
      </div>
     </div>
    </div>

    {/* Call control bar */}
    <div className="sticky bottom-3 m-6 rounded-xl bg-[#0b142b] p-12 ring-1 ring-white/10 ">
     <div className="grid grid-cols-3 items-center gap-3">
      {/* left time */}
      <div className="flex items-center gap-2 text-white/80 text-sm">
       <Clock className="size-16" />
       <span>10:20 AM</span>
      </div>

      {/* center controls */}
      <div className="flex items-center justify-center gap-3">
       <Button
        variant="secondary"
        className="h-40 w-40 p rounded-full bg-white/10 text-white hover:bg-white/20"
        onClick={() => setCamDisabled((c) => !c)}
       >
        <VideoIcon className="size-24" />
       </Button>
       <Button
        variant="secondary"
        className="h-40 w-40 rounded-full bg-white/10 text-white hover:bg-white/20 p-0"
        onClick={() => setMuted((m) => !m)}
       >
        {muted ? <MicOff className="size-24" /> : <Mic className="size-24" />}
       </Button>
       <Button
        variant="secondary"
        className="h-40 w-40 rounded-full bg-white/10 text-white hover:bg-white/20 p-0"
        onClick={() => setSpeaker((s) => !s)}
       >
        {speaker ? <Volume2 className="size-24" /> : <VolumeX className="size-24" />}
       </Button>
       <Button className="ml-2 bg-red-600 hover:bg-red-700 text-white" onClick={() => push(`/cases/${caseId}/confirmation`)}>
        <PhoneOff className="size-24" />
        <span className="ml-2">End Call</span>
       </Button>
      </div>

      {/* right timer */}
      <div className="flex items-center justify-end text-white/80 text-sm">
       <span>{duration}</span>
      </div>
     </div>
    </div>
   </div>

   <ImageLightbox
    title="Photos"
    items={photos}
    index={index}
    open={open}
    onOpenChange={setOpen}
    onIndexChange={setIndex}
   // onDelete={onDeletePhoto}
   />
  </>

 );
}
