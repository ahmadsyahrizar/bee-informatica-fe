"use client";

import * as React from "react";
import { Table, TableBody } from "@/components/ui/table";
import { CaseRowPagination, CaseRowType, Stage } from "@/types/case";
import { CaseRow } from "./CaseRow";
import { CaseTableHeader } from "./CaseTableHeader";
import PageHeader from "./PageHeader";
import { PaginationBar } from "./PaginationBar";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

type SortBy = "updated-newest" | "updated-oldest"

const CaseListClient: React.FC<{
  rows: CaseRowType[];
  pagination: CaseRowPagination;
  currentFilters: {
    q?: string;
    stage?: string;
    ob?: string;
    page?: number;
    size?: number;
    dateRange?: string;
    score?: string;
  };
}> = ({ rows, pagination, currentFilters }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [inputSearch, setInputSearch] = React.useState(currentFilters.q ?? "");

  React.useEffect(() => {
    setInputSearch(currentFilters.q ?? "");
  }, [currentFilters.q]);

  React.useEffect(() => {
    const t = setTimeout(() => {
      if ((currentFilters.q ?? "") === (inputSearch ?? "")) return;
      const p = new URLSearchParams(Array.from(searchParams.entries()));
      if (inputSearch) p.set("q", inputSearch);
      else p.delete("q");
      p.set("page", "1");
      router.push(`/cases?${p.toString()}`);
    }, 350);
    return () => clearTimeout(t);
  }, [currentFilters.q, inputSearch, router, searchParams]);

  const updateParam = (key: string, value?: string | number | null) => {
    const p = new URLSearchParams(Array.from(searchParams.entries()));
    if (value === undefined || value === null || value === "") p.delete(key);
    else p.set(key, String(value));
    if (key !== "page") p.set("page", "1");
    router.push(`/cases?${p.toString()}`);
  };

  const onStageChange = (v: Stage & "all-stages") => {
    if (v === "all-stages") updateParam("stage", undefined);
    else updateParam("stage", v);
  };

  const onSortByChange = (v: SortBy) => {
    let ob = "newest";
    if (v === "updated-newest") ob = "newest";
    if (v === "updated-oldest") ob = "oldest";
    updateParam("ob", ob);
  };

  const onPrev = () => {
    const newPage = Math.max(1, (currentFilters.page ?? 1) - 1);
    updateParam("page", newPage);
  };
  const onNext = () => {
    const newPage = Math.min((pagination.total_pages ?? 1), (currentFilters.page ?? 1) + 1);
    updateParam("page", newPage);
  };

  const handleRedirect = (param: string | number) => {
    router.push(`/cases/${param}`);
  };

  const onPagination = (page: number) => {
    updateParam("page", page);
  }

  return (
    <>
      <PageHeader
        total={rows.length}
        search={inputSearch}
        onSearchChange={setInputSearch}
        // @ts-expect-error rija
        stage={(currentFilters.stage as "all-stages") ?? "all-stages"}
        onStageChange={onStageChange}
        sortBy={
          currentFilters.ob === "oldest"
            ? ("updated-oldest" as SortBy)
            : currentFilters.ob === "score_desc"
              ? ("score-high" as SortBy)
              : currentFilters.ob === "score_asc"
                ? ("score-low" as SortBy)
                : ("updated-newest" as SortBy)
        }
        onSortByChange={(v: SortBy) => onSortByChange(v)}
      />

      <div className="mt-[32px] rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full max-w-[1216px]">
            <CaseTableHeader />
            <TableBody>
              {rows.length > 0 ? (
                rows.map((r) => (
                  <CaseRow row={r} key={r.id} onRedirect={() => handleRedirect(r.id)} />
                ))
              ) : (
                <tr>
                  <td className="py-12 text-center text-sm text-gray-500" colSpan={5}>
                    No results match your filters.
                  </td>
                </tr>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="px-20 pb-16">
          <PaginationBar
            page={currentFilters.page ?? pagination.current_page}
            totalPages={pagination.total_pages}
            onPagination={onPagination}
            onPrev={onPrev}
            onNext={onNext}
          />
        </div>
      </div>
    </>
  );
};

export default CaseListClient;
