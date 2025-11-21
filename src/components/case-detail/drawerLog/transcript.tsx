"use client";

import * as React from "react";

function parseSrt(srt: string) {
 if (!srt) return [];
 const blocks = srt
  .replace(/\r/g, "")
  .split(/\n\s*\n/)
  .map((b) => b.trim())
  .filter(Boolean);

 const entries: { startSeconds: number; endSeconds?: number; text: string; index: number }[] = [];

 const toSeconds = (t: string) => {
  const cleaned = t.replace(",", ".").trim();
  const parts = cleaned.split(":").map(Number);
  if (parts.length === 3 && parts.every((p) => !Number.isNaN(p))) {
   return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
 };

 for (let i = 0; i < blocks.length; i++) {
  const lines = blocks[i].split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) continue;
  const timeLineIdx = lines.findIndex((l) => l.includes("-->"));
  if (timeLineIdx === -1) continue;
  const timeLine = lines[timeLineIdx];
  const [startRaw, endRaw] = timeLine.split("-->").map((s) => s.trim());
  const startSeconds = toSeconds(startRaw);
  const endSeconds = endRaw ? toSeconds(endRaw) : undefined;
  const text = lines.slice(timeLineIdx + 1).join("\n");
  entries.push({ startSeconds, endSeconds, text, index: entries.length });
 }
 return entries;
}

function formatTime(sec: number) {
 if (!Number.isFinite(sec)) return "0:00";
 const s = Math.floor(sec);
 const h = Math.floor(s / 3600);
 const m = Math.floor((s % 3600) / 60);
 const ss = s % 60;
 if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
 return `${m}:${String(ss).padStart(2, "0")}`;
}

function findMedia(): HTMLMediaElement | null {
 const video = document.querySelector("video");
 if (video) return video as HTMLMediaElement;
 const audio = document.querySelector("audio");
 if (audio) return audio as HTMLMediaElement;
 return null;
}

type Props = {
 items?: string | null;
 isLoading?: boolean;
};

export default function Transcript({ items, isLoading = false }: Props) {
 const srtText = typeof items === "string" ? items : null;
 const cues = React.useMemo(() => (srtText ? parseSrt(srtText) : []), [srtText]);

 const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
 const refs = React.useRef<Map<number, HTMLDivElement | null>>(new Map());

 React.useEffect(() => {
  if (!cues || cues.length === 0) {
   setActiveIndex(null);
   return;
  }

  const media = findMedia();
  if (!media) {
   setActiveIndex(null);
   return;
  }

  const onTime = () => {
   const t = media.currentTime;
   let found: number | null = null;
   for (let i = 0; i < cues.length; i++) {
    const c = cues[i];
    const end = typeof c.endSeconds === "number" ? c.endSeconds : c.startSeconds + 10;
    if (t >= c.startSeconds && t <= end) {
     found = c.index;
     break;
    }
   }
   if (found === null) {
    for (let i = cues.length - 1; i >= 0; i--) {
     if (media.currentTime >= cues[i].startSeconds) {
      found = cues[i].index;
      break;
     }
    }
   }
   if (found !== activeIndex) {
    setActiveIndex(found);
    if (found !== null) {
     const el = refs.current.get(found);
     if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
   }
  };

  media.addEventListener("timeupdate", onTime);
  onTime();

  return () => {
   media.removeEventListener("timeupdate", onTime);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [cues]);

 const handleSeek = (seconds: number) => {
  const media = findMedia();
  if (!media) return;
  try {
   media.currentTime = Math.max(0, Number(seconds));
   // If paused, keep paused; if playing, continue playing
  } catch (err) {
   // ignore
  }
 };

 if ((!cues || cues.length === 0) && !isLoading) {
  return (
   <div className="rounded-xl border bg-white p-16 text-sm text-muted-foreground">
    No transcript available.
   </div>
  );
 }

 return (
  <div className="relative rounded-xl border bg-white p-6 ">
   <div className="max-h-[70vh] overflow-y-auto pr-4 relative z-10">
    {
     isLoading ?
      <div className="flex flex-col items-center gap-2 mt-3 mb-3">
       <svg className="animate-spin h-[20px] w-[20px] text-gray-900" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
        <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
       </svg>
       <div className="text-sm text-gray-800 mt-3">Processing transcript…</div>
      </div> : <ul>
       {cues.map((c) => {
        const isActive = activeIndex === c.index;
        return (
         <li
          key={c.index}
          onClick={() => handleSeek(c.startSeconds)}
          aria-label={`Jump to ${formatTime(c.startSeconds)}`}
          // @ts-expect-error rija
          ref={(el) => refs.current.set(c.index, el)}
          className={`cursor-pointer items-start gap-6 p-3 rounded transition-colors flex ${isActive
           ? "bg-brand-50"
           : "hover:bg-gray-50"
           }`}
         >
          <div className="w-[72px] flex-shrink-0 text-[12px] text-gray-700 font-medium">{formatTime(c.startSeconds)}</div>
          <div className="flex-1">
           <div className="text-gray-700 text-[14px] font-medium whitespace-pre-line">{c.text}</div>
          </div>
         </li>
        );
       })}
      </ul>
    }


   </div>
  </div>
 );
}
