export default function Loading() {
 return (
  <div className="min-h-screen bg-[#F8FAFD]">
   <div className="mx-auto max-w-[1216px] px-24 py-24">
    <div className="h-8 w-60 rounded bg-gray-200 animate-pulse" />
    <div className="mt-16 grid grid-cols-12 gap-16">
     <div className="col-span-12 lg:col-span-2 space-y-6">
      {Array.from({ length: 8 }).map((_, i) => (
       <div key={i} className="h-8 rounded bg-gray-200 animate-pulse" />
      ))}
     </div>
     <div className="col-span-12 lg:col-span-10 space-y-12">
      {Array.from({ length: 6 }).map((_, i) => (
       <div key={i} className="h-40 rounded-xl border bg-white" />
      ))}
     </div>
    </div>
   </div>
  </div>
 );
}  