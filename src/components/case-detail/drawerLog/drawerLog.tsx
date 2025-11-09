"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DataTable, DTColumn } from "@/components/common/DataTable";
import {
 ListChecks,
 MessageSquareText,
 PlayCircle,
 ChevronRight,
 X,
 Sparkles,
} from "lucide-react";
import { Avatar } from "../../ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Checkbox } from "../../ui/checkbox";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import useMergedLog, { ChecklistItem, KeyValueField, VideoCallLogData } from "@/hooks/useMergeLog";

// reused small components
function SectionTitle({ title }: { title: string }) {
 return (
  <div className="py-3 mt-24 flex items-center gap-2">
   <div className="font-semibold text-grey-900 text-18">{title}</div>
  </div>
 );
}

function Checklist({
 items,
 onToggle,
}: {
 items: ChecklistItem[];
 onToggle: (id: string | number) => void;
}) {
 return (
  <div className="rounded-xl border bg-white p-3">
   <ul className="space-y-2">
    {items.length === 0 ? (
     <li className="p-6 text-sm text-muted-foreground">No checklist items available.</li>
    ) : (
     items.map((item) => (
      <li key={String(item.id)} className="flex items-start gap-12 p-16 border-b">
       <Checkbox
        checked={Boolean(item.done)}
        className={[
         "shadow-none",
         "h-16 w-16 rounded-[3px] border border-gray-300",
         "data-[state=checked]:bg-brand-500 data-[state=checked]:border-brand-500 data-[state=checked]:text-white",
         "mt-[2px]",
         "[&_svg]:w-[15px] [&_svg]:h-[10px]",
         "[&_svg]:stroke-[3px]",
         "data-[state=checked]:[&_svg]:relative data-[state=checked]:[&_svg]:left-[2px] data-[state=checked]:[&_svg]:top-[3px]",
         "[&_svg]:rotate-0",
        ].join(" ")}
        // call the toggle callback (support both events)
        onChange={() => onToggle(item.id)}
        onCheckedChange={() => onToggle(item.id)}
        aria-label={`toggle-${item.id}`}
       />
       <span className="text-sm leading-relaxed">{item.text}</span>
      </li>
     ))
    )}
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
    {rows.length === 0 ? (
     <div className="p-6 text-sm text-muted-foreground">No structured notes available.</div>
    ) : (
     <DataTable<Row> columns={columns} rows={rows} />
    )}
   </div>
  </div>
 );
}

function VideoPlayer({ src, type }: { src?: string; type?: "video" | "phone" }) {
 if (!src) return <div className="rounded-xl border bg-muted/10 p-16 text-sm text-muted-foreground">No recording available.</div>;
 // if phone -> likely audio; render audio element
 if (type === "phone") {
  return (
   <div className="rounded-xl border overflow-hidden bg-white p-16">
    <audio src={src} controls className="w-full" />
   </div>
  );
 }
 // default render video
 return (
  <div className="rounded-xl border overflow-hidden bg-black p-16">
   <div className="relative w-full aspect-video">
    <video src={src} controls className="w-full h-full" />
    <PlayCircle className="size-16 absolute left-3 top-3 text-white/80" />
   </div>
  </div>
 );
}

function Transcript({ items }: { items?: { role: "Staff" | "Client"; time?: string; text: string }[] }) {
 if (!items || items.length === 0) {
  return <div className="rounded-xl border bg-white p-16 text-sm text-muted-foreground">No transcript available.</div>;
 }
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
        <b className="text-gray-900 text-14">{m.role}</b>{" "}
        {m.time ? <span className="ml-1 text-gray-700 text-12 font-semibold">{m.time}</span> : null}
       </div>
       <div className="rounded-lg bg-muted/20 text-gray-700 text-14 font-medium p-3">{m.text}</div>
      </div>
     </li>
    ))}
   </ul>
  </div>
 );
}

// ---------------- Main Drawer ----------------
export default function VideoCallLogDrawer({
 open,
 onOpenChange,
 logType = "video",
}: {
 open: boolean;
 onOpenChange: (open?: boolean) => void;
 logType?: "video" | "phone";
}) {
 const { id } = useParams();
 const accessToken = (useSession()?.data as any)?.accessToken ?? "";
 const [localChecklist, setLocalChecklist] = React.useState<ChecklistItem[]>([]);
 const [tab, setTab] = React.useState("checklist");
 const refChecklist = React.useRef<HTMLDivElement | null>(null);
 const refStructured = React.useRef<HTMLDivElement | null>(null);
 const refVideo = React.useRef<HTMLDivElement | null>(null);
 const refTranscript = React.useRef<HTMLDivElement | null>(null);

 const { data: mergedData, isLoading: tplLoading, isError: tplError, error: tplErrorObj, refetch } = useMergedLog({
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

 // initialize / reset localChecklist whenever mergedData.checklist changes
 React.useEffect(() => {
  // deep-clone to avoid mutating the original mergedData
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
       <div className="border p-3 rounded-md flex items-center">
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
                 transition-all duration-300 ease-in-out"
        >
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
        {tplLoading ? <div className="p-6">Loading checklist...</div> : <Checklist items={localChecklist} onToggle={handleToggleChecklist} />
        }
        {tplError ? <div className="text-destructive text-sm mt-2">Failed loading template: {String((tplErrorObj as any)?.message ?? tplErrorObj)}</div> : null}
       </div>

       <div ref={refStructured} className="scroll-mt-[100px]">
        <StructuredTable rows={mergedData.structured} />
       </div>

       <div ref={refVideo} className="scroll-mt-[100px]">
        <SectionTitle title={logType === "phone" ? "Audio Recording" : "Video Call Recording"} />
        <VideoPlayer src={mergedData.videoUrl} type={logType} />
       </div>

       <div ref={refTranscript} className="scroll-mt-[100px]">
        <SectionTitle title="Transcript" />
        <Transcript items={mergedData.transcript} />
       </div>
      </div>
     </div>
    </div>
   </SheetContent>
  </Sheet>
 );
}
