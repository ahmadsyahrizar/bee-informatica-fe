import { Checkbox } from "@/components/ui/checkbox";
import { ChecklistItem } from "@/types/app-log";

export default function Checklist({
 items,
 onToggle,
}: {
 items: ChecklistItem[];
 onToggle: (id: string | number) => void;
}) {
 return (
  <div className="rounded-xl border bg-white p-3">
   <ul className="space-y-2">
    {items.length === 0 ? (
     <li className="p-6 text-sm text-muted-foreground">No checklist items available.</li>
    ) : (
     items.map((item) => (
      <li key={String(item.id)} className="flex items-start gap-12 p-16 border-b">
       <Checkbox
        checked={Boolean(item.done)}
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
        // call the toggle callback (support both events)
        onChange={() => onToggle(item.id)}
        onCheckedChange={() => onToggle(item.id)}
        aria-label={`toggle-${item.id}`}
       />
       <span className="text-sm leading-relaxed">{item.text}</span>
      </li>
     ))
    )}
   </ul>
  </div>
 );
}