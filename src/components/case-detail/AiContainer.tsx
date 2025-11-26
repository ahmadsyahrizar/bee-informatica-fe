import useCaseDetail from "@/hooks/useCaseDetail";
import { FinancialAnalysisResponse } from "@/types/api/ai-highlight.type";
import { useParams } from "next/navigation";
import { AIHighlight } from "./AiHighlight";
import { FinancialSummary } from "./FinancialSummary";

const AiContainer = () => {
  const { id } = useParams()
  const { data } = useCaseDetail<FinancialAnalysisResponse>({ type: "ai_highlight", caseId: id as string });
  const dataStrength = data?.strengths || [];
  const dataRisks = data?.risks || [];
  const dataFinancialSummary = data?.financial_summaries || []
  const financialMeta = data?.financial_meta || {}
  const dataInsight = data?.meta

  return (
    <>
      <AIHighlight strength={dataStrength} risks={dataRisks} />
      <FinancialSummary insight={dataInsight} data={dataFinancialSummary} />
    </>)
}

export default AiContainer