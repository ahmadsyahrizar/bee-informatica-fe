import * as React from "react"
import { cn } from "@/lib/utils"

interface ScoreDisplayProps extends React.HTMLAttributes<HTMLSpanElement> {
 value: number
}

export function ScoreDisplay({ value, className, ...props }: ScoreDisplayProps) {
 return (
  <span
   className={cn("text-2xl font-bold text-gray-900", className)}
   {...props}
  >
   {value}
  </span>
 )
}   