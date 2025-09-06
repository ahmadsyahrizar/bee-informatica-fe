import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDownIcon, Search } from "lucide-react";

export const PageHeader: React.FC<{ total?: number }> = ({ total }) => {
 return (
  <>
   <div className="md:flex md:flex-row md:justify-between">
    <h1 className="text-[24px] font-bold text-gray-900">Case List</h1>
    <div className="relative w-[360px]">
     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-20 w-20 text-gray-400" />
     <Input placeholder="Search by Case ID or Client Name" className="pl-9 h-9 rounded-[8px]" />
    </div>
   </div>

   <div className="flex items-center justify-between mt-[28px]">
    <div className="flex items-center gap-3">
     <div className="flex gap-3 font-[600] text-gray-700">
      <Select defaultValue="all-stages" >
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

      <Select defaultValue="all-dates">
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

      <Select defaultValue="all-scores">
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
         Updated (Newest)
         <ChevronDownIcon className="size-20 opacity-50" />
        </Button>
       </DropdownMenuTrigger>
       <DropdownMenuContent align="end" className="w-48 bg-white">
        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Updated (Newest)</DropdownMenuItem>
        <DropdownMenuItem>Updated (Oldest)</DropdownMenuItem>
        <DropdownMenuItem>Score (High → Low)</DropdownMenuItem>
        <DropdownMenuItem>Score (Low → High)</DropdownMenuItem>
       </DropdownMenuContent>
      </DropdownMenu>
     </div>
    </div>
   </div>
  </>
 );
};