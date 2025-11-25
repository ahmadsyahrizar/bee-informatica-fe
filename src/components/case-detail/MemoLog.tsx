"use client";

import { ChevronRight } from "lucide-react";
import Image from "next/image";
import iconMemo from "@/assets/icons/icon-memo.svg";
import { Input } from "@/components/ui/input";
import VideoCallLogDrawer from "./drawerLog/drawerLog";
import { useEffect, useState } from "react";
import MemoModal from "./MemoModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import UpsertMemo from "@/services/UpsertMemo";
import type { RevertHistory } from "@/types/api/get-revert-history.type";
import { GetMemoResponse, PayloadMemoRequest } from "@/types/api/memo.type";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCaseDetailContext } from "@/context/InitCaseDetailContext";
import { toast } from "sonner";
import iconHistory from "@/assets/icons/icon-history.svg";
import { StageDisplay } from "./StageDisplay";
import { Stage } from "./Contact";

import type { HistoryWrapper } from "@/types/api/get-revert-history.type"; // new type

type Props = {
  entries?: GetMemoResponse[] | undefined;
  memoLoading?: boolean;
  onOpenHistory?: () => void;
  onInvalidateMemo?: () => void;
  isGenerating?: boolean;
  generateLabel?: string | null;
  revertItems?: RevertHistory[];
};

const MemoLog = ({ entries, onOpenHistory, isGenerating = false, generateLabel = null, revertItems = [] }: Props) => {
  // @ts-expect-error rija
  const accessToken = useSession().data?.accessToken ?? "";
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [openVideoDrawer, setOpenVideoDrawer] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [memo, setMemo] = useState("");

  const { data: dataInit } = useCaseDetailContext();
  const currentStage = dataInit?.stage;
  const showRevertSection = dataInit?.stage === "1st_review" && Array.isArray(revertItems) && revertItems.length > 0;

  const { mutate, isPending } = useMutation({
    mutationKey: ["upsertMemo", id],
    mutationFn: (body: PayloadMemoRequest) => UpsertMemo({ accessToken, caseId: String(id || "151"), body }),
  });

  const handleOpenModal = () => {
    setOpenModal((prev) => !prev);
  };

  const onSave = (v: string) => {
    setMemo(v);
    mutate(
      {
        stage: dataInit?.stage as PayloadMemoRequest["stage"],
        memo: v,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["getMemo"] });
          toast.success("Successfully input memo");
        },
      }
    );
  };

  const handleLog = (which?: string | boolean) => {
    if (typeof which === "boolean") {
      if (!which) {
        setOpenVideoDrawer(false);
      }
      return;
    }

    if (which === "phone") {
      setOpenVideoDrawer((p) => !p);
      return;
    }

    setOpenVideoDrawer(false);
  };

  useEffect(() => {
    const memos = Array.isArray(entries) ? entries : [];
    const currMemo = memos.find(({ stage }) => stage === dataInit?.stage);
    setMemo(currMemo?.memo ?? "");
  }, [entries, dataInit?.stage]);

  return (
    <>
      <div className="flex gap-3">
        <div>
          <div className="border bg-white border-gray-200 p-12 rounded-lg">
            <div className="flex justify-between">
              <div className="flex justify-start items-center gap-2">
                <StageDisplay stage={dataInit?.stage as Stage} />

                {(dataInit?.stage === "phone" || dataInit?.stage === "video") && !isGenerating && (
                  <div
                    onClick={() => handleLog("phone")}
                    className="bg-gray-100 text-12 text-gray-600 font-medium p-1 rounded-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Log <ChevronRight size={14} />
                  </div>
                )}
              </div>

              {!isGenerating && (
                <div className="border border-gray-300 p-8 rounded-md" onClick={onOpenHistory}>
                  <Image src={iconHistory} alt="history" width={20} height={20} />
                </div>
              )}

              {isGenerating && (
                <div className="w-[200px]">
                  <div className="text-sm font-medium text-gray-700">{generateLabel ?? "Generating log..."}</div>
                  <div className="mt-2 h-2 bg-gray-100 rounded overflow-hidden">
                    <div
                      className="h-full rounded"
                      style={{
                        width: "48%",
                        transition: "width 1s ease",
                        background: "#FF4700",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 relative">
              <Image src={iconMemo} alt="memo" width={18} height={18} className="absolute left-2 top-2" />
              <Input value={memo} readOnly onClick={handleOpenModal} className="w-[563px] bg-gray-50 pl-[32px]" placeholder="add a memo" />
            </div>
          </div>

          {showRevertSection && (
            <div className="relative mt-[-20px] z-[-1] p-[16px] rounded-lg bg-gray-50 border border-gray-200">
              <Image src={iconMemo} alt="memo" width={18} height={18} className="absolute left-3 top-[2.2em]" />
              <div className="relative">
                <div className="pl-[24px] text-xs text-gray-500 mt-3">Revert Reason</div>
                <div className="pl-[24px] text-sm">{revertItems?.[0].reason}</div>
              </div>
            </div>
          )}
        </div>

        {showRevertSection && (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleLog("phone")}
              className="flex items-center gap-2 px-[16px] py-[8px] border border-brand-500 rounded-md text-brand-500 bg-white text-14 font-semibold"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.37516 6.08092C5.95516 7.28894 6.74582 8.42114 7.74714 9.42245C8.74845 10.4238 9.88065 11.2144 11.0887 11.7944C11.1926 11.8443 11.2445 11.8693 11.3103 11.8884C11.5439 11.9565 11.8308 11.9076 12.0286 11.7659C12.0843 11.7261 12.1319 11.6784 12.2272 11.5832C12.5185 11.2918 12.6642 11.1462 12.8107 11.0509C13.3631 10.6918 14.0753 10.6918 14.6277 11.0509C14.7741 11.1462 14.9198 11.2918 15.2112 11.5832L15.3735 11.7456C15.8164 12.1884 16.0378 12.4099 16.1581 12.6477C16.3974 13.1206 16.3974 13.6792 16.1581 14.1522C16.0378 14.39 15.8164 14.6114 15.3735 15.0543L15.2422 15.1857C14.8008 15.627 14.5802 15.8477 14.2801 16.0162C13.9472 16.2032 13.4301 16.3377 13.0483 16.3366C12.7042 16.3355 12.469 16.2688 11.9986 16.1353C9.47077 15.4178 7.08547 14.0641 5.09548 12.0741C3.1055 10.0841 1.75177 7.69882 1.0343 5.17099C0.900792 4.70062 0.834038 4.46543 0.833015 4.12131C0.831879 3.73946 0.966347 3.22238 1.15336 2.88946C1.3219 2.58943 1.54258 2.36875 1.98393 1.9274L2.11529 1.79604C2.55816 1.35317 2.7796 1.13174 3.01741 1.01145C3.49038 0.772225 4.04894 0.772225 4.5219 1.01145C4.75972 1.13174 4.98116 1.35317 5.42402 1.79604L5.58642 1.95843C5.87776 2.24977 6.02342 2.39544 6.11866 2.54192C6.47782 3.09433 6.47782 3.80648 6.11866 4.35889C6.02342 4.50537 5.87775 4.65104 5.58642 4.94238C5.49116 5.03764 5.44353 5.08527 5.40366 5.14095C5.26198 5.3388 5.21306 5.62569 5.28117 5.85931C5.30033 5.92506 5.32528 5.97701 5.37516 6.08092Z" stroke="#FF4700" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              Add Phone Recording
            </button>

            <button
              onClick={() => handleLog("video")}
              className="flex items-center gap-2 px-[16px] py-[8px] border border-brand-500 rounded-md text-brand-500 bg-white text-14 font-semibold"
            >
              <svg width="19" height="14" viewBox="0 0 19 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.4997 4.10817C17.4997 3.60333 17.4997 3.3509 17.3998 3.23402C17.3132 3.1326 17.1833 3.07877 17.0503 3.08924C16.8971 3.1013 16.7186 3.27979 16.3616 3.63677L13.333 6.66536L16.3616 9.69396C16.7186 10.0509 16.8971 10.2294 17.0503 10.2415C17.1833 10.252 17.3132 10.1981 17.3998 10.0967C17.4997 9.97983 17.4997 9.7274 17.4997 9.22256V4.10817Z" stroke="#FF4700" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M0.833008 4.83203C0.833008 3.4319 0.833008 2.73183 1.10549 2.19705C1.34517 1.72665 1.72763 1.3442 2.19803 1.10451C2.73281 0.832031 3.43288 0.832031 4.83301 0.832031H9.33301C10.7331 0.832031 11.4332 0.832031 11.968 1.10451C12.4384 1.3442 12.8208 1.72665 13.0605 2.19705C13.333 2.73183 13.333 3.4319 13.333 4.83203V8.4987C13.333 9.89883 13.333 10.5989 13.0605 11.1337C12.8208 11.6041 12.4384 11.9865 11.968 12.2262C11.4332 12.4987 10.7331 12.4987 9.33301 12.4987H4.83301C3.43288 12.4987 2.73281 12.4987 2.19803 12.2262C1.72763 11.9865 1.34517 11.6041 1.10549 11.1337C0.833008 10.5989 0.833008 9.89883 0.833008 8.4987V4.83203Z" stroke="#FF4700" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              Add Video Recording
            </button>
          </div>
        )}
      </div>

      <VideoCallLogDrawer logType={currentStage as "phone" | "video"} onOpenChange={handleLog} open={openVideoDrawer} />
      <MemoModal isLoading={isPending} value={memo} open={openModal} onClose={handleOpenModal} onSave={onSave} />
    </>
  );
};

export default MemoLog;
