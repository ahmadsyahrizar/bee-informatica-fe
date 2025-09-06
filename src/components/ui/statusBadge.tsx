import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
 "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors",
 {
  variants: {
   variant: {
    "final-review": "bg-gray-200 text-gray-700",
    approved: "bg-green-100 text-green-700",
    attention: "bg-orange-100 text-orange-700",
    rejected: "bg-red-100 text-red-700",
    phone: "bg-gray-100 text-gray-400",
   },
  },
  defaultVariants: {
   variant: "final-review",
  },
 }
)

export interface StatusBadgeProps
 extends React.HTMLAttributes<HTMLSpanElement>,
 VariantProps<typeof badgeVariants> {
 label?: string
}

export function StatusBadge({ className, variant, label, ...props }: StatusBadgeProps) {
 const textMap: Record<string, string> = {
  "final-review": "Final Review",
  approved: "Approved",
  attention: "Attention Required",
  rejected: "Rejected",
  phone: "Phone",
 }

 return (
  <span className={cn(badgeVariants({ variant }), className)} {...props}>
   {label ?? textMap[variant ?? "final-review"]}
  </span>
 )
}  