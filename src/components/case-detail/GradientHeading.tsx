"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function AiGradientHeading({
 children = "AI Highlight",
 className,
 id,
}: {
 children?: React.ReactNode;
 className?: string;
 id?: string;
}) {
 return (
  <h3
   id={id}
   className={cn(
    "text-[18px] leading-[28px] font-semibold",
    "flex items-center gap-2 mb-2",
    className
   )}
  >
   <span
    className={cn(
     "inline-block text-transparent bg-clip-text",
     "bg-[linear-gradient(90deg,#AD00FE_0%,#B42AF9_35%,#00E0EE_100%)]",
     "bg-[length:140%_100%] bg-[position:0%_50%]",
     "[-webkit-text-fill-color:transparent]"
    )}
   >
    {children}
   </span>

   <GradientSparkle className="h-5 w-5" />
  </h3>
 );
}

function GradientSparkle({ className }: { className?: string }) {
 return (
  <svg
   viewBox="0 0 20 20"
   className={cn("inline-block", className)}
   aria-hidden="true"
  >
   <defs>
    <linearGradient id="ai-g" x1="0%" y1="0%" x2="100%" y2="0%">
     <stop offset="0%" stopColor="#AD00FE" />
     <stop offset="100%" stopColor="#00E0EE" />
    </linearGradient>
   </defs>
   <path
    d="M10 1.5l1.6 4.2 4.2 1.6-4.2 1.6L10 13.1l-1.6-4.2-4.2-1.6 4.2-1.6L10 1.5z"
    fill="url(#ai-g)"
   />
   <circle cx="15.8" cy="4.8" r="1.2" fill="url(#ai-g)" />
  </svg>
 );
}
