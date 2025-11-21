"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import useMergedLog from "@/hooks/useMergeLog";
import { ChecklistItem } from "@/types/app-log";
import Transcript from "./transcript";
import SectionTitle from "./sectionTitle";
import VideoPlayer from "./videoPlayer";
import StructuredTable from "./structuredTable";
import Checklist from "./checkList";

export default function VideoCallLogDrawer({ open, onOpenChange, logType = "video"
}: {
        open: boolean; onOpenChange: (open?: boolean) => void; logType?: "video" | "phone";
}) {
        const { id } = useParams();
        const accessToken = (useSession()?.data as any)?.accessToken ?? "";
        const [localChecklist, setLocalChecklist] = React.useState<ChecklistItem[]>([]);
        const [tab, setTab] = React.useState("checklist");
        const refChecklist = React.useRef<HTMLDivElement | null>(null);
        const refStructured = React.useRef<HTMLDivElement | null>(null);
        const refVideo = React.useRef<HTMLDivElement | null>(null);
        const refTranscript = React.useRef<HTMLDivElement | null>(null);

        const { data: mergedData, isLoading: tplLoading, isError: tplError, error: tplErrorObj } = useMergedLog({
                accessToken,
                caseId: id as string,
                type: logType,
                open,
        });

        const handleToggleChecklist = (id: string | number) => {
                setLocalChecklist((prev) =>
                        prev.map((it) => (String(it.id) === String(id) ? { ...it, done: !Boolean(it.done) } : it))
                );
        };

        const onTabChange = (v: string) => {
                setTab(v);
                const map: Record<string, HTMLDivElement | null> = {
                        checklist: refChecklist.current,
                        structured: refStructured.current,
                        operator: null,
                        video: refVideo.current,
                        transcript: refTranscript.current,
                        screenshots: null,
                };
                requestAnimationFrame(() => map[v]?.scrollIntoView({ behavior: "smooth", block: "start" }));
        };

        const drawerTitle = logType === "phone" ? "Phone Log" : "Video Call Log";

        React.useEffect(() => {
                if (mergedData?.checklist && Array.isArray(mergedData.checklist)) {
                        setLocalChecklist(mergedData.checklist.map((it) => ({ ...it })));
                } else {
                        setLocalChecklist([]);
                }
        }, [mergedData?.checklist]);

        return (
                <Sheet open={open} onOpenChange={() => onOpenChange()}>
                        <SheetContent side="right" className="bg-white p-0 w-[1080px] sm:w-[1080px] max-w-none sm:max-w-none">
                                <SheetHeader className="border-b p-[16px]">
                                        <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                        <div onClick={() => onOpenChange(false)} className="border p-3 rounded-md flex items-center cursor-pointer">
                                                                <ChevronRight className="size-16" />
                                                                <ChevronRight className="size-16 ml-[-22px]" />
                                                        </div>
                                                        <SheetTitle>{drawerTitle}</SheetTitle>
                                                </div>
                                                <SheetClose asChild>
                                                        <Button variant="ghost" size="icon">
                                                                <X className="size-16" />
                                                        </Button>
                                                </SheetClose>
                                        </div>
                                </SheetHeader>

                                <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 px-24 pt-4">
                                        <div className="xl:col-span-12 space-y-6">
                                                <Tabs value={tab} onValueChange={onTabChange} className="w-full">
                                                        <TabsList className="w-full justify-start overflow-x-auto border-b rounded-none border-gray-200 gap-[16px]">
                                                                <TabsTrigger
                                                                        value="checklist"
                                                                        className="relative px-4 py-3 text-[15px] font-semibold text-gray-500
                 data-[state=active]:text-[#FF4700]
                 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[#FF4700]
                 data-[state=active]:after:w-full
                 transition-all duration-300 ease-in-out"
                                                                >
                                                                        Checklist
                                                                </TabsTrigger>

                                                                <TabsTrigger
                                                                        value="structured"
                                                                        className="relative px-4 py-3 text-[15px] font-semibold text-gray-500
                 data-[state=active]:text-[#FF4700]
                 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[#FF4700]
                 data-[state=active]:after:w-full
                 transition-all duration-300 ease-in-out">
                                                                        Structured Notes
                                                                </TabsTrigger>

                                                                <TabsTrigger
                                                                        value="video"
                                                                        className="relative px-4 py-3 text-[15px] font-semibold text-gray-500
                 data-[state=active]:text-[#FF4700]
                 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[#FF4700]
                 data-[state=active]:after:w-full
                 transition-all duration-300 ease-in-out"
                                                                >
                                                                        {logType === "phone" ? "Audio Recording" : "Video Call Recording"}
                                                                </TabsTrigger>

                                                                <TabsTrigger
                                                                        value="transcript"
                                                                        className="relative px-4 py-3 text-[15px] font-semibold text-gray-500
                 data-[state=active]:text-[#FF4700]
                 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-[#FF4700]
                 data-[state=active]:after:w-full
                 transition-all duration-300 ease-in-out"
                                                                >
                                                                        Transcript
                                                                </TabsTrigger>
                                                        </TabsList>
                                                </Tabs>


                                                <div className="space-y-6 pr-2 overflow-y-auto max-h-[calc(92vh-120px)]">
                                                        <div ref={refChecklist} className="scroll-mt-[100px]">
                                                                <SectionTitle title="Checklist" />
                                                                {<Checklist items={localChecklist} onToggle={handleToggleChecklist} />
                                                                }
                                                                {tplError ? <div className="text-destructive text-sm mt-2">Failed loading template: {String((tplErrorObj as any)?.message ?? tplErrorObj)}</div> : null}
                                                        </div>

                                                        <div ref={refStructured} className="scroll-mt-[100px]">
                                                                <StructuredTable rows={mergedData.structured} />
                                                        </div>

                                                        <div ref={refVideo} className="scroll-mt-[100px]">
                                                                <SectionTitle title={logType === "phone" ? "Audio Recording" : "Video Call Recording"} />
                                                                <VideoPlayer
                                                                        src={mergedData.videoUrl}
                                                                        type={logType}
                                                                        subtitleUrl={mergedData.subtitleUrl}
                                                                        subtitleText={mergedData.subtitleSrt}
                                                                        isLoading={Boolean(mergedData?.isAppLogPolling || mergedData?.isFetchingSigned)}
                                                                />
                                                        </div>

                                                        <div ref={refTranscript} className="scroll-mt-[100px]">
                                                                <SectionTitle title="Transcript" />
                                                                <Transcript
                                                                        items={mergedData.subtitleSrt}
                                                                        isLoading={Boolean(mergedData?.isAppLogPolling || mergedData?.isFetchingSigned)}
                                                                />
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                        </SheetContent>
                </Sheet>
        );
}
