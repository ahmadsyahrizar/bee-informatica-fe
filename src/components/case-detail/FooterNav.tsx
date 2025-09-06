"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function FooterNav() {
 return (
  <div className="mt-24 flex justify-end gap-12">
   <Button variant="outline" className="h-9 rounded-xl gap-2">
    <ChevronLeft className="h-4 w-4" /> Previous
   </Button>
   <Button className="h-9 rounded-xl gap-2">
    Next <ChevronRight className="h-4 w-4" />
   </Button>
  </div>
 );
}