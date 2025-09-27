import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select";
import { ChevronDownIcon, Search } from "lucide-react";

type StageFilter =
 | "all-stages"
 | "phone"
 | "meet"
 | "review1"
 | "final"
 | "approved"
 | "rejected";
type DateFilter = "all-dates" | "today" | "week" | "month";
type ScoreFilter = "all-scores" | ">=80" | "60-79" | "<60";
type SortBy = "updated-newest" | "updated-oldest" | "score-high" | "score-low";

export const PageHeader: React.FC<{
 total?: number;

 search: string;
 onSearchChange: (v: string) => void;

 stage: StageFilter;
 onStageChange: (v: StageFilter) => void;

 dateRange: DateFilter;
 onDateRangeChange: (v: DateFilter) => void;

 score: ScoreFilter;
 onScoreChange: (v: ScoreFilter) => void;

 sortBy: SortBy;
 onSortByChange: (v: SortBy) => void;
}> = ({
 total,
 search,
 onSearchChange,
 stage,
 onStageChange,
 dateRange,
 onDateRangeChange,
 score,
 onScoreChange,
 sortBy,
 onSortByChange,
}) => {
  return (
   <>
    <div className="md:flex md:flex-row md:justify-between">
     <div className="flex items-center gap-3">
      <h1 className="text-[24px] font-bold text-gray-900">Case List</h1>
      {typeof total === "number" && (
       <span className="text-xs text-gray-500">({total} results)</span>
      )}
     </div>

     <div className="relative w-[360px]">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-20 w-20 text-gray-400" />
      <Input
       value={search}
       onChange={(e) => onSearchChange(e.target.value)}
       placeholder="Search by Case ID or Client Name"
       className="pl-9 h-9 rounded-[8px]"
      />
     </div>
    </div>

    <div className="flex items-center justify-between mt-[28px]">
     <div className="flex items-center gap-3">
      <div className="flex gap-3 font-[600] text-gray-700">
       <Select value={stage} onValueChange={(v) => onStageChange(v as StageFilter)}>
        <SelectTrigger className="w-[140px] rounded-[8px]">
         <SelectValue />
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={4} className="bg-white">
         <SelectItem value="all-stages">All Stages</SelectItem>
         <SelectItem value="phone">Phone</SelectItem>
         <SelectItem value="meet">Meet</SelectItem>
         <SelectItem value="review1">1st Review</SelectItem>
         <SelectItem value="final">Final Review</SelectItem>
         <SelectItem value="approved">Approved</SelectItem>
         <SelectItem value="rejected">Rejected</SelectItem>
        </SelectContent>
       </Select>

       <Select value={dateRange} onValueChange={(v) => onDateRangeChange(v as DateFilter)}>
        <SelectTrigger className="w-[120px] h-9 rounded-[8px]">
         <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white">
         <SelectItem value="all-dates">All dates</SelectItem>
         <SelectItem value="today">Today</SelectItem>
         <SelectItem value="week">This week</SelectItem>
         <SelectItem value="month">This month</SelectItem>
        </SelectContent>
       </Select>

       <Select value={score} onValueChange={(v) => onScoreChange(v as ScoreFilter)}>
        <SelectTrigger className="w-[130px] h-9 rounded-[8px]">
         <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white">
         <SelectItem value="all-scores">All Scores</SelectItem>
         <SelectItem value=">=80">≥ 80</SelectItem>
         <SelectItem value="60-79">60 – 79</SelectItem>
         <SelectItem value="<60">&lt; 60</SelectItem>
        </SelectContent>
       </Select>

       <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
         <Button variant="outline" className="h-9 rounded-[8px] gap-2 font-[600] text-gray-700">
          {sortBy === "updated-newest" && "Updated (Newest)"}
          {sortBy === "updated-oldest" && "Updated (Oldest)"}
          {sortBy === "score-high" && "Score (High → Low)"}
          {sortBy === "score-low" && "Score (Low → High)"}
          <ChevronDownIcon className="size-20 opacity-50" />
         </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 bg-white">
         <DropdownMenuLabel>Sort by</DropdownMenuLabel>
         <DropdownMenuSeparator />
         <DropdownMenuItem onClick={() => onSortByChange("updated-newest")}>
          Updated (Newest)
         </DropdownMenuItem>
         <DropdownMenuItem onClick={() => onSortByChange("updated-oldest")}>
          Updated (Oldest)
         </DropdownMenuItem>
         <DropdownMenuItem onClick={() => onSortByChange("score-high")}>
          Score (High → Low)
         </DropdownMenuItem>
         <DropdownMenuItem onClick={() => onSortByChange("score-low")}>
          Score (Low → High)
         </DropdownMenuItem>
        </DropdownMenuContent>
       </DropdownMenu>
      </div>
     </div>
    </div>
   </>
  );
 };
