"use client";

import iconPhoneLog from "@/assets/icons/icon-phone-log.svg";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import iconMemo from "@/assets/icons/icon-memo.svg";
import { Input } from "@/components/ui/input";
import VideoCallLogDrawer from "./drawerLog/drawerLog";
import { useEffect, useState } from "react";
import MemoModal from "./MemoModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import UpsertMemo from "@/services/UpsertMemo";
import { GetMemoResponse, PayloadMemoRequest } from "@/types/api/memo.type";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCaseDetailContext } from "@/context/InitCaseDetailContext";
import { toast } from "sonner";
import iconHistory from "@/assets/icons/icon-history.svg";
import { StageDisplay } from "./StageDisplay";
import { Stage } from "./Contact";

type Props = {
  entries?: GetMemoResponse[] | undefined;
  memoLoading?: boolean;
  onOpenHistory?: () => void;
  onInvalidateMemo?: () => void;
};

const MemoLog = ({ entries, memoLoading, onOpenHistory, onInvalidateMemo }: Props) => {
  // @ts-expect-error rija
  const accessToken = useSession().data?.accessToken ?? "";
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [openVideoDrawer, setOpenVideoDrawer] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [memo, setMemo] = useState("");

  const { data: dataInit } = useCaseDetailContext();
  const { mutate, isPending } = useMutation({
    mutationKey: ["upsertMemo", id],
    mutationFn: (body: PayloadMemoRequest) => UpsertMemo({ accessToken, caseId: "151" as string, body }),
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
          queryClient.invalidateQueries({ queryKey: ["getMemo", id] });
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
      <div className="border border-gray-200 p-12 rounded-lg">
        <div className="flex justify-between">
          <div className="flex justify-start items-center gap-2">
            <StageDisplay stage={dataInit?.stage as Stage} />

            {(dataInit?.stage === "phone" || dataInit?.stage === "video") && (
              <div
                onClick={() => handleLog("phone")}
                className="bg-gray-100 text-12 text-gray-600 font-medium p-1 rounded-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                Log <ChevronRight size={14} />
              </div>
            )}
          </div>

          <div className="border border-gray-300 p-8 rounded-md" onClick={onOpenHistory}>
            <Image src={iconHistory} alt="history" width={20} height={20} />
          </div>
        </div>

        <div className="mt-3 relative">
          <Image src={iconMemo} alt="memo" width={18} height={18} className="absolute left-2 top-2" />
          <Input value={memo} readOnly onClick={handleOpenModal} className="w-[563px] bg-gray-50 pl-[32px]" placeholder="add a memo" />
        </div>
      </div>

      <VideoCallLogDrawer onOpenChange={handleLog} open={openVideoDrawer} />
      <MemoModal isLoading={isPending} value={memo} open={openModal} onClose={handleOpenModal} onSave={onSave} />
    </>
  );
};

export default MemoLog;
