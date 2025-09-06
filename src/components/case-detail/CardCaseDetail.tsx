import { Info } from "lucide-react"

const CardCaseDetail = ({ title, desc, bgColor, }: { title: string, desc: string, bgColor: string }) => {
 return (
  <div className="col-span-12 xl:col-span-6">
   <div className={`rounded-md ${bgColor} p-16 h-[86px]`}>
    <p className="rounded-md font-semibold text-gray-950">{title}</p>
    <span className="mt-[12px] text-12 text-gray-600 font-medium flex items-center justify-start gap-1"><Info className="size-14" /> {desc}</span>
   </div>
  </div>
 )
}

export default CardCaseDetail