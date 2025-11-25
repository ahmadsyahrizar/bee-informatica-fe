"use client";

import React, { useRef, useState } from "react";
import MemoLog from "./MemoLog";
import { Button } from "@/components/ui/button";
import iconReject from "@/assets/icons/icon-reject-black.svg";
import iconUpload from "@/assets/icons/iconUpload.svg";
import Image from "next/image";
import RejectApplicationModal from "./RejectModal";
import iconRejectBg from "@/assets/icons/icon-reject-bg.svg";
import iconApproved from "@/assets/icons/icon-circle-check.svg";

import UploadingDialog from "@/components/case-detail/UploadingDialog";
import UploadSuccessDialog from "@/components/case-detail/UploadSuccessModal";
import UploadErrorDialog from "@/components/case-detail/UploadErrorModal";

import { useCaseDetailContext } from "@/context/InitCaseDetailContext";
import { useTranscriptionUpload } from "@/hooks/useTranscriptionUpload";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import GetAppLog from "@/services/GetAppLog";
import { GetAppLogResponse } from "@/types/api/get-app-log.type";

import NextPage from "@/services/PostNextPage";
import { toast } from "sonner";
import { Stage } from "@/types/case";
import NextStageModal from "./NextStageModal";
import OfferModal from "./OfferModal";
import DisburseModal from "./DisburseModal";
import CompletedStatus from "./CompletedStatus";
import DecisionHistory from "./DecisionHistory";
import { useGetMemo } from "@/hooks/useGetMemo";
import CreateLogGeneration from "@/services/GetLogGeneration";
import GetRevertHistory from "@/services/GetRevertHistory";
import type { GetRevertHistoryResponse, HistoryWrapper, RevertHistory, SessionHistories } from "@/types/api/get-revert-history.type";

export function DetailHeader() {
    // @ts-expect-error rija
    const accessToken = useSession()?.data?.accessToken ?? "";
    const { data: dataInitial } = useCaseDetailContext();
    const stage = dataInitial?.stage as Stage;
    const caseId = dataInitial?.id ?? "";
    const [openReject, setOpenReject] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [pickedFile, setPickedFile] = useState<File | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState<{ open: boolean; message?: string }>({ open: false });
    const [reuploadMode, setReuploadMode] = useState(false);
    const [openNextStage, setOpenNextStage] = useState(false);
    const [openOfferModal, setOpenOfferModal] = useState(false);
    const [openDisburseModal, setOpenDisburseModal] = useState(false);
    const [openModalHistory, setOpenModalHistory] = useState(false);
    const queryClient = useQueryClient();
    const { entries: memoEntries, isLoading: memoLoading, isError: memoError, invalidate: invalidateMemo, refetch } =
        useGetMemo(caseId);

    const { data: revertHistoryWrapper, isLoading: revertHistoryLoading } = useQuery({
        queryKey: ["getRevertHistory", caseId],
        queryFn: async () => {
            const res = await GetRevertHistory({ accessToken, caseId: String(caseId) });
            return res?.data;
        },
        enabled: !!caseId && stage === "1st_review",
        select: (wrapper) => {
            // @ts-expect-error rija
            const sessions: SessionHistories[] = wrapper?.data ?? [];
            const revertItems: RevertHistory[] = [];
            for (const sess of sessions) {
                for (const h of sess.histories ?? []) {
                    if (h && (h as HistoryWrapper).type === "revert" && (h as any).revert_history) {
                        revertItems.push((h as any).revert_history as RevertHistory);
                    }
                }
            }
            return { sessions, revertItems };
        },
    });

    const { data: dataAppLog } = useQuery({
        queryKey: ["getAppLog", caseId, stage],
        queryFn: async () => {
            return await GetAppLog({ accessToken, caseId: caseId as string, type: stage });
        },
        select: (wrapper) => {
            return (wrapper.data && (wrapper.data as any).data) as GetAppLogResponse;
        },
        enabled: !!caseId && stage === "phone" || stage === "video",
    });

    const { uploadFile, isUploading, progress, currentFile, cancel, serverKey } = useTranscriptionUpload({
        accessToken,
        caseId,
        stage,
    });

    const nextStageMutation = useMutation({
        mutationFn: async () => {
            return await NextPage({ accessToken, caseId: String(caseId) });
        },
        onSuccess: () => {
            toast.success("Moved to next stage");
            queryClient.invalidateQueries({ queryKey: ["caseDetail", 'initial', caseId] });
            queryClient.invalidateQueries({ queryKey: ["getAppLog", caseId] });
            window.location.reload();
            setOpenNextStage(false);
        },
        onError: (err: any) => {
            toast.error(`Failed to move to next stage: ${err?.message || err}`);
        },
    });
    const revertHistories = revertHistoryWrapper ?? undefined;
    const isRejected = stage === "rejected";
    const accept =
        stage === "video" ? "video/*,video/mp4,video/quicktime" : "audio/*,audio/mpeg,audio/wav,audio/mp3";

    const handleUploadTranscription = () => {
        setReuploadMode(false);
        inputRef.current?.click();
    };

    const handleReuploadClick = () => {
        setReuploadMode(true);
        inputRef.current?.click();
    };

    const onPickFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPickedFile(file);

        try {
            await uploadFile(file, { reupload: reuploadMode });
            setShowSuccess(true);
        } catch (err: any) {
            setShowError({ open: true, message: err?.message || "Upload failed" });
        } finally {
            e.target.value = "";
            setReuploadMode(false);
        }
    };

    const handleCancelUpload = () => {
        cancel();
        setShowError({ open: true, message: "Upload cancelled by user" });
    };

    // ------------ NEW: create log generation mutation & state ------------
    const [isGenerating, setIsGenerating] = useState(false);
    const [generateLabel, setGenerateLabel] = useState<string | null>(null);

    const createLogMutation = useMutation({
        mutationFn: async (body: { type: string; key: string; additional?: any }) => {
            return await CreateLogGeneration({
                accessToken,
                caseId: String(caseId),
                body,
            });
        },
        onMutate: () => {
            // start loading bar in MemoLog area
            setIsGenerating(true);
        },
        onSuccess: (res: any) => {
            // expected response: { data: { job_name, status } }
            setShowSuccess(false);
            setPickedFile(null);
            queryClient.invalidateQueries({ queryKey: ["getAppLog", caseId] });
            toast.success("Log generation queued");
            setIsGenerating(false);
        },
        onError: (err: any) => {
            setIsGenerating(false);
            toast.error(`Failed to generate log: ${err?.message || err}`);
        },
    });

    const handleGenerate = () => {
        setShowSuccess(false);
        const type = stage === "video" ? "video" : "phone";


        if (!serverKey) {
            toast.error("No file key available to generate log");
            return;
        }
        const body = {
            type,
            key: serverKey,
            // additional: {
            //     enable: true,
            // },
        };

        createLogMutation.mutate(body);
    };
    // --------------------------------------------------------------------

    const handleDiscard = () => {
        setShowSuccess(false);
        setPickedFile(null);
    };

    const handleRetry = async () => {
        if (!pickedFile) return;
        setShowError({ open: false });
        try {
            await uploadFile(pickedFile);
            setShowSuccess(true);
        } catch (err: any) {
            setShowError({ open: true, message: err?.message || "Upload failed" });
        }
    };

    const handleUploadOther = () => {
        setShowError({ open: false });
        inputRef.current?.click();
    };

    const handleOpenHistory = () => setOpenModalHistory(true);
    const handleCloseHistory = () => setOpenModalHistory(false);
    const closeError = () => setShowError({ open: false });

    const hasRecordings = Boolean(dataAppLog?.recording && dataAppLog.recording?.length > 0);
    const showReuploadAndNext = hasRecordings && (stage === "phone" || stage === "video");

    function renderActions() {
        if (stage === "phone" || stage === "video") {
            if (showReuploadAndNext) {
                return (
                    <>
                        <Button onClick={() => setOpenReject(true)} className="bg-white p-2 shadow-none border border-gray-300">
                            <Image src={iconReject} alt="reject" width={16} height={16} />
                            Reject
                        </Button>

                        <Button
                            onClick={handleReuploadClick}
                            disabled={isUploading}
                            className="p-2 bg-white shadow-none border border-brand-500 text-brand-500"
                        >
                            <Image src={iconUpload} alt="re-upload" width={16} height={16} />
                            Re-upload
                        </Button>

                        <Button
                            onClick={() => setOpenNextStage(true)}
                            className="p-2 bg-white shadow-none border border-brand-500 text-brand-500"
                        >
                            Proceed to Next Stage
                        </Button>
                    </>
                );
            } else {
                return (
                    <>
                        <Button onClick={() => setOpenReject(true)} className="bg-white p-2 shadow-none border border-gray-300">
                            <Image src={iconReject} alt="reject" width={16} height={16} />
                            Reject
                        </Button>

                        <Button
                            onClick={handleUploadTranscription}
                            disabled={isUploading}
                            className="p-2 bg-white shadow-none border border-brand-500 text-brand-500"
                        >
                            <Image src={iconUpload} alt="upload" width={16} height={16} />
                            {isUploading ? "Uploading..." : "Upload"}
                        </Button>
                    </>
                );
            }
        }

        if (stage === "1st_review") {
            return (
                <>
                    <Button onClick={() => setOpenReject(true)} className="bg-white p-2 shadow-none border border-gray-300">
                        <Image src={iconReject} alt="reject" width={16} height={16} />
                        Reject
                    </Button>

                    {/* Submit triggers next-stage modal; confirm calls nextStageMutation */}
                    <Button
                        onClick={() => setOpenNextStage(true)}
                        // disabled={!submitEnabled}
                        className="p-2 bg-white shadow-none border border-brand-500 text-brand-500 disabled:opacity-50"
                    >
                        Submit
                    </Button>
                </>
            );
        }

        // cam_review: show Reject + Offer
        if (stage === "cam_review") {
            return (
                <>
                    <Button onClick={() => setOpenReject(true)} className="bg-white p-2 shadow-none border border-gray-300">
                        <Image src={iconReject} alt="reject" width={16} height={16} />
                        Reject
                    </Button>

                    <Button
                        onClick={() => setOpenOfferModal(true)}
                        className="p-2 bg-white shadow-none border border-green-400 text-green-600"
                    >
                        <Image src={iconApproved} width={16} height={16} alt="approve" />
                        Offer
                    </Button>
                </>
            );
        }

        // offer stage: show Reject + Mark as Disbursed
        if (stage === "offer") {
            return (
                <>
                    <Button onClick={() => setOpenReject(true)} className="bg-white p-2 shadow-none border border-gray-300">
                        <Image src={iconReject} alt="reject" width={16} height={16} />
                        Reject
                    </Button>

                    <Button
                        onClick={() => setOpenDisburseModal(true)}
                        className="p-2 bg-white shadow-none border border-green-400 text-green-600"
                    >
                        <Image src={iconApproved} alt="reject" width={16} height={16} />
                        Mark as Disbursed
                    </Button>
                </>
            );
        }

        if (stage === "completed") return null
        return null;
    }

    return (
        <div className="flex justify-between items-start">
            {stage === "completed" ?
                <CompletedStatus onOpenHistory={handleOpenHistory} />
                :
                <>
                    {/* pass isGenerating to MemoLog so it can render the loading bar */}
                    <MemoLog
                        entries={memoEntries}
                        onOpenHistory={handleOpenHistory}
                        onInvalidateMemo={invalidateMemo}
                        memoLoading={memoLoading}
                        isGenerating={isGenerating}
                        generateLabel={stage === "video" ? "Generating Video Log.." : "Generating Phone Log.."}
                        revertItems={revertHistories?.revertItems}
                    />
                    {isRejected ? (
                        <div className="relative text-[#F04438] bg-error-50 rounded-md px-3 py-2 pr-[48px] border font-semibold border-error-200 flex justify-between items-center">
                            Application Rejected
                            <Image src={iconRejectBg} alt="reject" width={40} height={40} className="absolute right-0 bottom-0" />
                        </div>
                    ) : (
                        <div className="flex gap-2 items-center">
                            {renderActions()}

                            <input ref={inputRef} type="file" accept={accept} onChange={onPickFile} className="hidden" />
                        </div>
                    )}

                    {/* Uploading progress modal */}
                    <UploadingDialog
                        open={isUploading}
                        file={currentFile ?? pickedFile}
                        stage={stage === "rejected" ? "phone" : (stage as "phone" | "video")}
                        progress={progress}
                        onCancel={handleCancelUpload}
                    />

                    {/* Success modal */}
                    <UploadSuccessDialog
                        open={showSuccess}
                        file={pickedFile}
                        stage={stage === "rejected" ? "phone" : (stage as "phone" | "video")}
                        onGenerate={handleGenerate}     // <-- now triggers API
                        onDiscard={handleDiscard}
                        onClose={handleDiscard}
                    />

                    {/* Error / cancelled modal */}
                    <UploadErrorDialog
                        open={showError.open}
                        file={pickedFile}
                        stage={stage === "rejected" ? "phone" : (stage as "phone" | "video")}
                        message={showError.message}
                        onRetry={handleRetry}
                        onUploadOther={handleUploadOther}
                        onClose={closeError}
                    />

                    <RejectApplicationModal open={openReject} onClose={() => setOpenReject(false)} />

                    {/* NEXT STAGE CONFIRMATION MODAL */}
                    <NextStageModal
                        open={openNextStage}
                        onClose={() => setOpenNextStage(false)}
                        onConfirm={() => nextStageMutation.mutate()}
                        stage={stage === "rejected" ? "phone" : (stage as "phone" | "video")}
                    />

                    {/* OFFER modal (CAM review -> offer) */}
                    <OfferModal
                        open={openOfferModal}
                        onClose={() => setOpenOfferModal(false)}
                        accessToken={accessToken}
                        caseId={caseId}
                        stage={stage}
                    />

                    <DisburseModal
                        open={openDisburseModal}
                        onClose={() => setOpenDisburseModal(false)}
                        accessToken={accessToken}
                        caseId={caseId}
                        stage={stage}
                    />
                </>
            }

            <DecisionHistory
                open={openModalHistory}
                onClose={handleCloseHistory}
                entries={memoEntries}
                title="Decision History"
                revertItems={revertHistories?.revertItems}
            />
        </div>
    );
}

export default DetailHeader;
