import * as React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const PaginationBar: React.FC<{
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}> = ({ page, totalPages, onPrev, onNext }) => (
  <div className="flex items-center justify-between pt-12">
    <Button variant="outline" className="h-9 rounded-[8px] border-gray-300 gap-2" onClick={onPrev}>
      <ArrowLeft size={20} className="size-20 text-gray-400" /> Previous
    </Button>

    <div className="flex items-center gap-6 font-medium text-14 text-gray-700">
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          className={`h-[40px] w-[40px] rounded-lg grid place-items-center ${i + 1 === page ? "bg-gray-50 text-gray-700" : "text-gray-700 hover:bg-gray-50"
            }`}
        >
          {i + 1}
        </button>
      ))}
    </div>

    <Button variant="outline" className="h-9 rounded-[8px] border-gray-300 gap-2" onClick={onNext}>
      Next <ArrowRight className="size-20 text-gray-400" size={"20px"} />
    </Button>
  </div>
);   
