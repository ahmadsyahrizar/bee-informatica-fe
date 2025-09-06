"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";

const items = [
 "Overview",
 "AI Highlight",
 "AI Financial Summary",
 "Sales Report",
 "Evaluation Details",
 "CCRIS",
 "Photos",
 "Social Media",
 "Documents",
];

export function OverviewSidebar() {
 return (

  <>
   <Button variant="link" className="h-8 rounded-xl px-3 gap-1 font-semibold text-14 mb-[40px]">
    <ArrowLeft className="size-[20px]" />  <span className="text-gray-600"> Back</span>
   </Button>
   <nav className="sticky top-20 hidden lg:block">

    <Separator />
    <ul className="space-y-6">
     {items.map((t, i) => (
      <li key={i}>
       <Link href="#" className={`block rounded-lg px-10 py-6 text-14 text-gray-500 font-semibold hover:bg-gray-50 ${i === 0 ? "bg-gray-50 text-gray-700" : ""}`}>
        {t}
       </Link>
      </li>
     ))}
    </ul>
   </nav>
  </>
 );
}