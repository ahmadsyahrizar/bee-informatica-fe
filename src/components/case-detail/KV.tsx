function KV({ label, value, footer, bgColor = "bg-gray-50" }: { label: string; value: React.ReactNode; footer?: React.ReactNode, bgColor?: string }) {
 return (
  <div className={`rounded-md border-0 ${bgColor} p-16 h-[122px]`}>
   <div className="text-14 font-normal text-gray-600">{label}</div>
   <div className="mt-6 text-16 font-medium text-gray-900">{value}</div>
   {footer && <div className="mt-6 text-12 font-semibold underline text-gray-600">{footer}</div>}
  </div>
 );
}

export default KV