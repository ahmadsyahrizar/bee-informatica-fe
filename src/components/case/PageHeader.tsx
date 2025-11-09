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
import { Stage } from "@/types/case";

type SortBy = "updated-newest" | "updated-oldest";

const PageHeader: React.FC<{
  total?: number;

  search: string;
  onSearchChange: (v: string) => void;
  stage: Stage & "all-stages";
  onStageChange: (v: Stage & "all-stages") => void;
  sortBy: SortBy;
  onSortByChange: (v: SortBy) => void;
}> = ({
  total,
  search,
  onSearchChange,
  stage,
  onStageChange,
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
          <Select value={stage} onValueChange={(v) => onStageChange(v as Stage & "all-stages")}>
            <SelectTrigger className="w-[140px] rounded-[8px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={4} className="bg-white">
              <SelectItem value="all-stages">All Stages</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="1st_review">1st Review</SelectItem>
              <SelectItem value="cam_review">Cam Review</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 rounded-[8px] gap-2 font-[600] text-gray-700">
                {sortBy === "updated-newest" && "Updated (Newest)"}
                {sortBy === "updated-oldest" && "Updated (Oldest)"}
                <ChevronDownIcon className="size-20 opacity-50" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 bg-white">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onSortByChange("updated-newest")}>
                Newest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortByChange("updated-oldest")}>
                Oldest
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* </div> */}
        {/* // </div> */}
      </>
    );
  };

export default PageHeader