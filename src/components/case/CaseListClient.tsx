"use client";
import * as React from "react";
import { Table, TableBody } from "@/components/ui/table";
import { CaseRowType } from "@/types/case";
import { CaseRow } from "./CaseRow";
import { CaseTableHeader } from "./CaseTableHeader";
import { PageHeader } from "./PageHeader";
import { PaginationBar } from "./PaginationBar";
import { useRouter } from "next/navigation";

/* ---------------------------- helpers & types ---------------------------- */

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

type SortBy =
  | "updated-newest"
  | "updated-oldest"
  | "score-high"
  | "score-low";

const ROWS_PER_PAGE = 10;

const stageMap: Record<Exclude<StageFilter, "all-stages">, string> = {
  phone: "Phone",
  meet: "Meet",
  review1: "1st Review",
  final: "Final Review",
  approved: "Approved",
  rejected: "Rejected",
};

function toDate(s?: string | null): Date | null {
  if (!s) return null;
  // Robust parsing: "2025/09/03 10:00" -> "2025-09-03T10:00"
  const isoish = s.replaceAll("/", "-").replace(" ", "T");
  const d = new Date(isoish);
  return Number.isNaN(d.getTime()) ? null : d;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/* --------------------------------- comp --------------------------------- */

export const CaseListClient: React.FC<{ rows: CaseRowType[] }> = ({ rows }) => {
  const { push } = useRouter();

  // Controls
  const [search, setSearch] = React.useState("");
  const [stage, setStage] = React.useState<StageFilter>("all-stages");
  const [dateRange, setDateRange] = React.useState<DateFilter>("all-dates");
  const [score, setScore] = React.useState<ScoreFilter>("all-scores");
  const [sortBy, setSortBy] = React.useState<SortBy>("updated-newest");
  console.log({})

  // Debounced search (so typing is smooth)
  const [debouncedSearch, setDebouncedSearch] = React.useState(search);

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [search]);

  const handleRedirect = (param: string | number, s: string) => {
    console.log({ s })
    push(`/cases/${param}?stage=phone`);
  };

  // Derived data
  const now = React.useMemo(() => new Date(), []);
  const filteredSorted = React.useMemo(() => {
    let list = rows.slice();

    // Search (by Case ID or Client Name)
    if (debouncedSearch) {
      list = list.filter((r) => {
        const byId = r.caseId?.toLowerCase().includes(debouncedSearch);
        const byName = r.clientName?.toLowerCase().includes(debouncedSearch);
        return !!(byId || byName);
      });
    }

    // Stage filter
    if (stage !== "all-stages") {
      const target = stageMap[stage];
      list = list.filter((r) => r.stage.toLowerCase() === target.toLowerCase());
    }

    // Date filter (use `schedule` when present)
    if (dateRange !== "all-dates") {
      list = list.filter((r) => {
        const d = toDate(r.schedule);
        if (!d) return false;
        if (dateRange === "today") return isSameDay(d, now);
        if (dateRange === "week") {
          const diffMs = now.getTime() - d.getTime();
          const sevenDays = 7 * 24 * 60 * 60 * 1000;
          return diffMs >= 0 && diffMs <= sevenDays;
        }
        if (dateRange === "month") {
          return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        }
        return true;
      });
    }

    // Score filter
    if (score !== "all-scores") {
      list = list.filter((r) => {
        const sc = typeof r.score === "number" ? r.score : null;
        if (sc === null) return false;
        if (score === ">=80") return sc >= 80;
        if (score === "60-79") return sc >= 60 && sc <= 79;
        if (score === "<60") return sc < 60;
        return true;
      });
    }

    // Sorting
    list.sort((a, b) => {
      const da = toDate(a.schedule);
      const db = toDate(b.schedule);
      const sa = typeof a.score === "number" ? a.score : -Infinity;
      const sb = typeof b.score === "number" ? b.score : -Infinity;

      switch (sortBy) {
        case "updated-newest": {
          if (da && db) return db.getTime() - da.getTime();
          if (da && !db) return -1; // has date first
          if (!da && db) return 1;
          // fallback by id desc (treat id numeric when possible)
          return String(b.id).localeCompare(String(a.id), undefined, { numeric: true });
        }
        case "updated-oldest": {
          if (da && db) return da.getTime() - db.getTime();
          if (da && !db) return 1; // no date first
          if (!da && db) return -1;
          return String(a.id).localeCompare(String(b.id), undefined, { numeric: true });
        }
        case "score-high":
          return (isFinite(sb) ? sb : -Infinity) - (isFinite(sa) ? sa : -Infinity);
        case "score-low":
          return (isFinite(sa) ? sa : Infinity) - (isFinite(sb) ? sb : Infinity);
        default:
          return 0;
      }
    });

    return list;
  }, [rows, debouncedSearch, stage, dateRange, score, sortBy, now]);

  // Pagination
  const [page, setPage] = React.useState(1);
  React.useEffect(() => {
    // Reset to page 1 when filters/search/sort change
    setPage(1);
  }, [debouncedSearch, stage, dateRange, score, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / ROWS_PER_PAGE));
  const pageSlice = filteredSorted.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  console.log({ pageSlice })

  return (
    <>
      <PageHeader
        total={filteredSorted.length}
        // controls
        search={search}
        onSearchChange={setSearch}
        stage={stage}
        onStageChange={setStage}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        score={score}
        onScoreChange={setScore}
        sortBy={sortBy}
        onSortByChange={setSortBy}
      />

      <div className="mt-[32px] rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full max-w-[1216px]">
            <CaseTableHeader />
            <TableBody>
              {pageSlice.map((r) => (
                <CaseRow
                  row={r}
                  key={r.id}
                  onRedirect={() => handleRedirect(r.id, r.stage)}
                />
              ))}
              {pageSlice.length === 0 && (
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
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </div>
      </div>
    </>
  );
};
