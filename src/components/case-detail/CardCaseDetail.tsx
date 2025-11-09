// import { Info } from "lucide-react"

const CardCaseDetail = ({ children, title, desc, bgColor, }: { children?: React.ReactNode, title: string, desc?: string, bgColor: string }) => {
 return (
  <div className="col-span-12 xl:col-span-6">
   <div className={`rounded-md ${bgColor} p-16 h-full`}>
    <p className="rounded-md font-semibold text-gray-950">{title}</p>
    {children ? children : (
     <p className="mt-8 text-14 text-gray-700 font-medium">{desc}</p>
    )}
    {/* <span className="mt-[12px] text-12 text-gray-600 font-medium flex items-center justify-start gap-1"><Info className="size-14" /> </span> */}
   </div>
  </div>
 )
}

export default CardCaseDetail