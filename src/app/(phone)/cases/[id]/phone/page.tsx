"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import iconPhone from "../../../../../../public/icons/phonePage.svg"
import aiBadge from "../../../../../../public/icons/ai-badge.svg"
import iconMute from "../../../../../../public/icons/mute.svg"

import {
        Mic,
        MicOff,
        Volume2,
        VolumeX,
        PhoneOff,
        Clock,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

// ---------------- Types ----------------
export type CLItem = { id: string | number; text: string };
export type TranscriptMessage = { role: "Staff" | "Client"; time?: string; text: string };

// --------------- Demo data ---------------
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
        { role: "Staff", time: "0:08", text: "Hello, welcome to Fundingbee. How can I assist you today?" },
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
export default function PhoneInterviewPage() {
        const [checked, setChecked] = React.useState<Set<CLItem["id"]>>(new Set([1]));
        const [muted, setMuted] = React.useState(false);
        const [speaker, setSpeaker] = React.useState(true);
        const duration = useTimer(true);
        const { push } = useRouter()
        const { id: caseId } = useParams()

        const toggle = (id: CLItem["id"], value: boolean) => {
                setChecked((prev) => {
                        const next = new Set(prev);
                        value ? next.add(id) : next.delete(id);
                        return next;
                });
        };

        return (
                <div className="min-h-screen bg-[#0D121C] text-gray-900">
                        {/* Content Card */}
                        <div className="mx-auto px-4 pb-24 min-h-screen">
                                {/* Header row */}
                                <div className="flex items-center justify-between px-2 pb-3">
                                        <div className="flex items-center gap-2 text-white">
                                                <Image src={iconPhone} alt="phine" />
                                                <span className="text-base font-semibold">Phone Interview</span>
                                                <Image src={aiBadge} alt="phine" />
                                        </div>
                                </div>

                                {/* 3-column layout */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[80vh]">
                                        {/* Checklist */}
                                        <div className="rounded-xl bg-white  p-12 shadow-sm ring-1 ring-black/5">
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

                                        {/* Operator Notes */}
                                        <div className="rounded-xl bg-white p-12 shadow-sm ring-1 ring-black/5">
                                                <div className="font-semibold mb-3 pb-2 text-gray-900 border-b">Operator Notes</div>
                                                <textarea
                                                        placeholder="Write your own notes..."
                                                        className="w-full h-[520px] resize-none rounded-lg border border-gray-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-brand-500/40"
                                                />
                                        </div>

                                        {/* Live Transcript */}
                                        <div className="rounded-xl bg-white p-12 shadow-sm ring-1 ring-black/5">
                                                <div className="font-semibold mb-3 pb-2 text-gray-900 border-b">Live Transcript</div>
                                                <div className="max-h-[560px] overflow-y-auto pr-2">
                                                        <ul className="space-y-4">
                                                                {TX.map((m, i) => (
                                                                        <li key={i} className="flex items-start gap-3">
                                                                                <Avatar className="h-24 w-24 mt-1">
                                                                                        <AvatarImage className="object-cover" src="https://placehold.co/64" />
                                                                                        <AvatarFallback>U</AvatarFallback>
                                                                                </Avatar>
                                                                                <div>
                                                                                        <div className="mb-1 text-[11px] text-gray-500 font-medium">
                                                                                                <span className="text-gray-900 font-semibold">{m.role}</span>
                                                                                                {m.time ? <span className="ml-1">{m.time}</span> : null}
                                                                                        </div>
                                                                                        <div className="mb-16 text-sm text-gray-700">
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
                        <div className="sticky bottom-3 m-6 rounded-xl bg-[#0b142b] p-6 ring-1 ring-white/10">
                                <div className="grid grid-cols-3 items-center gap-3">
                                        {/* left time */}
                                        <div className="flex items-center gap-2 text-white/80 text-sm">
                                                <Clock className="size-16" />
                                                <span>10:20 AM</span>
                                        </div>

                                        {/* center participants + timer */}
                                        <div className="flex items-center justify-center gap-3">
                                                <div className="bg-[url('/images/blue-white.jpg')] bg-cover bg-center flex items-center gap-2 rounded-lg opacity-60 px-3 py-1 w-[400px] h-[64px]">
                                                        <Avatar className="h-40 w-40">
                                                                <AvatarImage className="object-cover" src="https://placehold.co/64" />
                                                                <AvatarFallback>LJ</AvatarFallback>
                                                        </Avatar>
                                                        <div className="rounded-sm px-3 py-2">
                                                                <span className="text-sm flex gap-3">Lim Wei Jun <Image src={iconMute} width={14} height={14} alt="mute" /> </span>
                                                        </div>
                                                </div>
                                                <div className="bg-[url('/images/blue-striped.jpg')] bg-cover bg-center flex items-center gap-2 rounded-lg opacity-60 px-3 py-1 w-[400px] h-[64px]">
                                                        <Avatar className="h-40 w-40">
                                                                <AvatarImage className="object-cover" src="https://placehold.co/64" />
                                                                <AvatarFallback>OR</AvatarFallback>
                                                        </Avatar>
                                                        <div className="rounded-sm px-3 py-2">
                                                                <span className="text-sm">Olivia (Admin)</span>
                                                        </div>
                                                </div>
                                                <span className="text-white/80 text-sm font-medium">{duration}</span>
                                        </div>

                                        {/* right controls */}
                                        <div className="flex items-center justify-end gap-2">
                                                <Button
                                                        variant="secondary"
                                                        className="bg-white/10 text-white hover:bg-white/20"
                                                        onClick={() => setMuted((m) => !m)}
                                                >
                                                        {muted ? <MicOff className="size-16" /> : <Mic className="size-16" />}
                                                </Button>
                                                <Button
                                                        variant="secondary"
                                                        className="bg-white/10 text-white hover:bg-white/20"
                                                        onClick={() => setSpeaker((s) => !s)}
                                                >
                                                        {speaker ? <Volume2 className="size-16" /> : <VolumeX className="size-16" />}
                                                </Button>
                                                <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => push(`/cases/${caseId}/confirmation`)}>
                                                        <PhoneOff className="size-16" />
                                                        <span className="ml-2">End Call</span>
                                                </Button>
                                        </div>
                                </div>
                        </div>
                </div>
        );
}
