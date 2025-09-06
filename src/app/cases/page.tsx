import { fetchCases } from "@/lib/api/cases";
import { CaseListClient } from "@/components/case/CaseListClient";

export default async function Page() {
 const rows = await fetchCases();
 return <CaseListClient rows={rows} />

}
