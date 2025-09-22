"use client";

import * as React from "react";
import { Info } from "lucide-react";

type Criterion = {
 label: string;
 value?: string | React.ReactNode;
 hint?: string;
};

type Section = {
 id: number;
 title: string;
 criteria: Criterion[];
};

export default function EvaluationDetails({ sections }: { sections: Section[] }) {
 return (
  <section className="space-y-10 mt-[32px]">
   <h3 className="text-20 font-semibold text-gray-900">Evaluation Details</h3>

   {sections.map((sec) => (
    <div key={sec.id} className="space-y-8">
     {/* Section Header */}
     <div className="flex items-center gap-3">
      <span className="flex h-24 w-24 items-center justify-center rounded-full text-brand-500 bg-brand-50 text-16 font-semibold">
       {sec.id}
      </span>
      <h4 className="text-16 font-semibold text-gray-900">{sec.title}</h4>
     </div>

     {/* Criteria rows */}
     <div>
      {sec.criteria.map((c, i) => (
       <div
        key={i}
        className={`flex py-16 items-start justify-start text-14 text-gray-700 ${i !== sec.criteria.length - 1 ? "border-b" : ""}  border-gray-200 bg-white`}
       >
        <div className="flex flex-1 text-gray-600 text-14 items-center gap-2">
         {c.label}
         {c.hint && (
          <span title={c.hint}>
           <Info className="h-18 w-18 text-gray-400" />
          </span>
         )}
        </div>
        <div className="flex-1 text-gray-900 font-bold text-18">{c.value ?? "-"}</div>
       </div>
      ))}
     </div>
    </div>
   ))}
  </section>
 );
}
