"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X, ChevronRight } from "lucide-react";

export type CLItem = { id: string | number; text: string };

export type PhoneChecklistData = {
 title?: string;
 checklist: CLItem[];
 defaultCheckedIds?: Array<CLItem["id"]>;
};

const demoData: PhoneChecklistData = {
 title: "Phone Log",
 checklist: [
  { id: 1, text: "How much can you commit to repay per month?" },
  { id: 2, text: "If we offered X amount for 1 year, would you accept?" },
  { id: 3, text: "Why is this loan amount necessary? Provide detailed breakdown." },
  { id: 4, text: "Please explain your business in detail." },
  { id: 5, text: "What is your SSM registration year?" },
  { id: 6, text: "Is your office owned or rented? Provide tenancy contract if rented." },
  { id: 7, text: "When did you actually start your business operations?" },
  { id: 8, text: "Why and how did you start this business?" },
  { id: 9, text: "What were your previous work experiences?" },
  { id: 10, text: "How do you usually acquire customers (repeat/referral/social media)?" },
  { id: 11, text: "How many customers do you have per month on average?" },
  { id: 12, text: "What is the average sales per customer?" },
  { id: 13, text: "Name your 3–5 main customers and their contract terms." },
  { id: 14, text: "What percentage of payments are cash vs online? & term & any delays?" },
  { id: 15, text: "Do you have social media or website? Please provide links." },
 ],
 defaultCheckedIds: [1, 2, 3, 4, 5, 6, 7],
};

// ---------------- Main Drawer ----------------
export default function PhoneChecklistDrawer({
 open,
 onOpenChange,
 data = demoData,
 onChange,
}: {
 open: boolean;
 onOpenChange: (open?: string) => void;
 data?: PhoneChecklistData;
 onChange?: (checkedIds: Array<CLItem["id"]>) => void;
}) {
 const [checked, setChecked] = React.useState<Set<CLItem["id"]>>(new Set(data.defaultCheckedIds ?? []));

 React.useEffect(() => {
  onChange?.(Array.from(checked));
 }, [checked, onChange]);

 const toggle = (id: CLItem["id"], value: boolean) => {
  setChecked((prev) => {
   const next = new Set(prev);
   value ? next.add(id) : next.delete(id);
   return next;
  });
 };

 return (
  <Sheet open={open} onOpenChange={() => onOpenChange()}>
   <SheetContent side="right" className="bg-white p-0 w-[860px] sm:w-[860px] max-w-none sm:max-w-none">
    <SheetHeader className="border-b">
     <div className="flex items-center justify-between gap-3">
      <div onClick={() => onOpenChange()} className="flex items-center gap-3 cursor-pointer">
       <ChevronRight className="size-16" />
       <ChevronRight className="size-16 ml-[-22px]" />
       <SheetTitle>{data.title ?? "Checklist"}</SheetTitle>
      </div>
     </div>
    </SheetHeader>

    <div className="px-24 pt-4 pb-6">
     <div className="bg-white">
      <div className="px-16 py-12 text-18 font-semibold">Checklist</div>
      <ul className="divide-y rounded-xl border overflow-y-auto max-h-[calc(92vh-50px)]">
       {data.checklist.map((item) => (
        <li key={item.id} className="flex items-start gap-12 p-16">
         <Checkbox
          checked={checked.has(item.id)}
          onCheckedChange={(v) => toggle(item.id, Boolean(v))}
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
         />
         <span className="text-sm leading-relaxed">{item.text}</span>
        </li>
       ))}
      </ul>
     </div>
    </div>
   </SheetContent>
  </Sheet>
 );
}  