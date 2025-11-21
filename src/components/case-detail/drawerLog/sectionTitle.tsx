export default function SectionTitle({ title }: { title: string }) {
 return (
  <div className="py-3 mt-24 flex items-center gap-2">
   <div className="font-semibold text-grey-900 text-18">{title}</div>
  </div>
 );
}
