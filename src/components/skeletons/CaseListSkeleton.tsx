import * as React from "react";

// Minimal skeleton (works even if shadcn/ui/skeleton isn't installed)
export const CaseListSkeleton: React.FC = () => {
 return (
  <div className="mx-auto max-w-[1120px] px-24 py-24">
   <div className="h-8 w-40 rounded-lg bg-gray-200 animate-pulse" />
   <div className="mt-16 rounded-xl border border-gray-200 bg-white">
    <div className="px-20 py-16 flex gap-6">
     <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
     <div className="h-6 w-28 bg-gray-200 rounded animate-pulse" />
     <div className="h-6 w-28 bg-gray-200 rounded animate-pulse" />
    </div>
    <div className="divide-y">
     {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="px-20 py-16 grid grid-cols-12 gap-6">
       <div className="col-span-5 h-6 bg-gray-100 rounded animate-pulse" />
       <div className="col-span-3 h-6 bg-gray-100 rounded animate-pulse" />
       <div className="col-span-2 h-6 bg-gray-100 rounded animate-pulse" />
       <div className="col-span-2 h-8 bg-gray-100 rounded animate-pulse" />
      </div>
     ))}
    </div>
   </div>
  </div>
 );
};   