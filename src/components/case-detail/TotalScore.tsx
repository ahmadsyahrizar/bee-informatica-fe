import { ChevronRight } from "lucide-react";
import { useState } from "react";
import CreditScoreDrawer from "./drawerLog/drawerDetail";
import { useParams, useSearchParams } from "next/navigation";
import graphReview from "@/assets/icons/example-graph-review.svg"
import graph from "@/assets/icons/example-graph.svg"
import Image from "next/image";
import { CaseDetailInitResponse } from "@/types/api/case-detail.type";
import useCaseDetail from "@/hooks/useCaseDetail";

interface TotalScoreProps {
  preScreening?: number;
  cashflowScore?: number;
  qualitativeScore?: number;
  totalScore?: number;
}

export default function TotalScore({
  cashflowScore,
  preScreening,
  qualitativeScore,
  totalScore
}: TotalScoreProps) {
  const [openDrawer, setDrawer] = useState(false);
  const handleDrawer = () => setDrawer((prev) => !prev);
  const { id } = useParams();
  const { data: dataInitial } = useCaseDetail<CaseDetailInitResponse>({ type: 'initial', caseId: id as string })
  const isReviewStage = dataInitial?.stage === '1st_review'
  const isFinal = dataInitial?.stage === 'completed'

  return (
    <>
      <div className="w-[600px] col-span-12 xl:col-span-4" >
        <div className="border-0 rounded-[8px] bg-[#FFEFEB] p-12">
          <div className="flex flex-row justify-between items-center">
            <div className="text-14 text-gray-600">Total Score</div>
            {isReviewStage ? (
              <div onClick={handleDrawer} className="flex items-center text-brand-500 underline text-12 font-semibold">
                <p>Review Scoring (required)</p>
                <ChevronRight className="size-16 cursor-pointer" />
              </div>
            ) : <ChevronRight onClick={handleDrawer} className="size-16 cursor-pointer" />
            }
          </div>
          <div className="grid md:grid-cols-4 gap-3 mt-8">
            <div className="flex items-center justify-center">
              {(isReviewStage || isFinal) ? (
                <div className="relative w-[160px] h-[100px]">
                  {/* Background half-arc */}
                  <svg
                    width="135"
                    height="90"
                    viewBox="0 0 160 80"
                    className="absolute top-0 left-0"
                  >
                    <path
                      d="M10 80 A70 70 0 0 1 150 80"
                      stroke="#E5E1DF"
                      strokeWidth="16"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </svg>

                  <svg
                    width="135"
                    height="90"
                    viewBox="0 0 160 80"
                    className="absolute top-0 left-0"
                  >
                    <path
                      d="M10 80 A70 70 0 0 1 150 80"
                      stroke={totalScore && totalScore < 60 ? "#F04438" : "#17B26A"}
                      strokeWidth="16"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="220"
                      strokeDashoffset={
                        totalScore
                          ? 220 - (220 * totalScore) / 100 // 0–100 scale
                          : 220
                      }
                    />
                  </svg>

                  {/* Score number */}
                  <div className="absolute left-1 right-0 top-[30px] flex justify-center">
                    <p
                      className={`text-[48px] font-bold ${totalScore && totalScore < 60 ? "text-[#F04438]" : "text-[#17B26A]"
                        }`}
                    >
                      {totalScore?.toFixed(0)}
                    </p>
                  </div>
                </div>
              ) : (
                <Image src={graph} alt="review-stage" width={136} height={100} />
              )}
            </div>


            <div className="border border-[#FFC2AA] rounded-md bg-white p-12">
              <label className="text-12 text-gray-400 font-medium mb-16">Pre-Screening</label>
              <p className="text-brand-500 text-24 font-bold">{preScreening?.toFixed(1)}</p>
            </div>

            <div className="border border-[#FFC2AA] rounded-md bg-white p-12">
              <label className="text-12 text-gray-400 font-medium">Cashflow Analysis</label>
              <p className="text-brand-500 text-24 font-bold">{cashflowScore?.toFixed(1)}</p>
            </div>

            <div className="border border-[#FFC2AA] rounded-md bg-white p-12">
              <label className="text-12 text-gray-400 font-medium">Qualitative</label>
              <p className="text-brand-500 text-24 font-bold">{qualitativeScore?.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      <CreditScoreDrawer onOpenChange={handleDrawer} open={openDrawer} />
    </>

  )
}