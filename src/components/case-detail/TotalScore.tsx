import { ChevronRight } from "lucide-react";
import { useState } from "react";
import CreditScoreDrawer from "./drawerDetail";
import { useSearchParams } from "next/navigation";
import graphReview from "../../../public/icons/example-graph-review.svg"
import graph from "../../../public/icons/example-graph.svg"
import Image from "next/image";

interface TotalScoreProps {
  preScreening?: number;
  cashflowScore?: number;
  qualitativeScore?: number;
}

export default function TotalScore({
  cashflowScore,
  preScreening,
  qualitativeScore
}: TotalScoreProps) {
  const [openDrawer, setDrawer] = useState(false);
  const handleDrawer = () => setDrawer((prev) => !prev);
  const params = useSearchParams();
  const currentStage = (params.get("stage") || "phone").toLowerCase();
  const isReviewStage = currentStage === 'review1'
  const isFinal = currentStage === 'final'

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
            )
              :
              <ChevronRight onClick={handleDrawer} className="size-16 cursor-pointer" />
            }
          </div>
          <div className="grid md:grid-cols-4 gap-3 mt-8">
            <div>
              {isReviewStage || isFinal ? <Image src={graphReview} alt="review-stage" width={136} height={100} /> : <Image src={graph} alt="review-stage" width={136} height={100} />}
            </div>

            <div className="border border-[#FFC2AA] rounded-md bg-white p-12">
              <label className="text-12 text-gray-400 font-medium mb-16">Pre-Screening</label>
              <p className="text-brand-500 text-24 font-bold">{preScreening}</p>
            </div>

            <div className="border border-[#FFC2AA] rounded-md bg-white p-12">
              <label className="text-12 text-gray-400 font-medium">Cashflow Analysis</label>
              <p className="text-brand-500 text-24 font-bold">{cashflowScore}</p>
            </div>

            <div className="border border-[#FFC2AA] rounded-md bg-white p-12">
              <label className="text-12 text-gray-400 font-medium">Qualitative</label>
              <p className="text-brand-500 text-24 font-bold">{qualitativeScore}</p>
            </div>
          </div>
        </div>
      </div>

      <CreditScoreDrawer onOpenChange={handleDrawer} open={openDrawer} />
    </>

  )
}