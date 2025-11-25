"use client";

import { ChevronRight, Phone, Video, XCircle } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import iconMemo from "@/assets/icons/icon-memo.svg";
import firstReviewIcon from "@/assets/icons/firstReview.svg";
import camReview from "@/assets/icons/finalReview.svg";
import offeredIcon from "@/assets/icons/icon-offered.svg";
import approvedIcon from "@/assets/icons/approvedIcon.svg";
import iconRejected from "@/assets/icons/icon-rejected.svg";
import { GetMemoResponse } from "@/types/api/memo.type";
import { Stage as StageType } from "@/types/case";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PostRevertCam from "@/services/PostRevertCam";
import { Button } from "../ui/button";
import { useCaseDetailContext } from "@/context/InitCaseDetailContext";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import type { RevertHistory } from "@/types/api/get-revert-history.type";

type Stage = StageType;

const stageMeta: Record<
  Stage,
  {
    label: string;
    pillClass: string;
    pillIcon: React.ReactNode;
    dotBorder: string;
    dotIcon: React.ReactNode;
    lineClass: string;
  }
> = {
  phone: {
    label: "Phone",
    pillClass: "text-blue-700 bg-blue-50",
    pillIcon: <Phone className="mr-2 size-20 text-blue-600" />,
    dotBorder: "border-blue-200",
    dotIcon: <Phone className="size-12 text-blue-600" />,
    lineClass: "bg-blue-300",
  },
  video: {
    label: "Video",
    pillClass: "text-pink-700 bg-pink-50",
    pillIcon: <Video className="mr-2 h-4 w-4 text-pink-600" />,
    dotBorder: "border-pink-200",
    dotIcon: <Video className="size-12 text-pink-600" />,
    lineClass: "bg-pink-300",
  },
  "1st_review": {
    label: "1st Review",
    pillClass: "text-warning-700 bg-warning-50",
    pillIcon: <Image src={firstReviewIcon} alt="1st" width={12} height={12} className="mr-2" />,
    dotBorder: "border-warning-100",
    dotIcon: <Image src={firstReviewIcon} alt="1st" width={12} height={12} />,
    lineClass: "bg-yellow-300",
  },
  cam_review: {
    label: "CAM Review",
    pillClass: "text-purple-700 bg-purple-50",
    pillIcon: <Image src={camReview} alt="cam" width={12} height={12} className="mr-2" />,
    dotBorder: "border-purple-100",
    dotIcon: <Image src={camReview} alt="cam" width={12} height={12} />,
    lineClass: "bg-purple-300",
  },
  offer: {
    label: "Offered",
    pillClass: "text-orange-700 bg-orange-50",
    pillIcon: <Image src={offeredIcon} alt="offered" width={12} height={12} className="mr-2" />,
    dotBorder: "border-orange-100",
    dotIcon: <Image src={offeredIcon} alt="offered" width={12} height={12} />,
    lineClass: "bg-orange-300",
  },
  completed: {
    label: "Completed",
    pillClass: "text-success-700 bg-success-50",
    pillIcon: <Image src={approvedIcon} alt="approved" width={12} height={12} className="mr-2" />,
    dotBorder: "border-success-100",
    dotIcon: <Image src={approvedIcon} alt="approved" width={12} height={12} />,
    lineClass: "bg-green-300",
  },
  rejected: {
    label: "Rejected",
    pillClass: "text-error-700 bg-error-50",
    pillIcon: <XCircle className="mr-2 h-4 w-4 text-red-600" />,
    dotBorder: "border-red-200",
    dotIcon: <Image src={iconRejected} alt="rejected" width={12} height={12} />,
    lineClass: "bg-red-300",
  },
  cancelled: {
    label: "Cancelled",
    pillClass: "text-error-700 bg-error-50",
    pillIcon: <XCircle className="mr-2 h-4 w-4 text-red-600" />,
    dotBorder: "border-red-200",
    dotIcon: <Image src={iconRejected} alt="cancelled" width={12} height={12} />,
    lineClass: "bg-red-300",
  },
};

function normalizeStage(input?: string | Stage): Stage | undefined {
  if (!input) return undefined;
  if (typeof input !== "string") return input;
  const s = input.trim().toLowerCase();
  if (s === "phone") return "phone";
  if (s === "video") return "video";
  if (s === "1st review" || s === "1st_review" || s === "1streview" || s === "1st") return "1st_review";
  if (s === "cam review" || s === "cam_review" || s === "camreview" || s === "cam") return "cam_review";
  if (s === "offered" || s === "offer") return "offer";
  if (s === "completed" || s === "approved") return "completed";
  if (s === "rejected") return "rejected";
  if (s === "cancelled" || s === "canceled") return "cancelled";
  return undefined;
}

function TimelineDot({ name }: { name?: Stage | string }) {
  const key = normalizeStage(name);
  const meta = key ? stageMeta[key] : null;

  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-[28px] h-[28px] rounded-full flex items-center justify-center bg-white border shadow-sm ${meta ? meta.dotBorder : "border-gray-100"}`}
      >
        {meta?.dotIcon ?? <div className="w-3 h-3 rounded-full bg-gray-200" />}
      </div>
      <div className={`w-[2px] mt-2 flex-1 rounded ${meta ? meta.lineClass : "bg-gray-200"}`} />
    </div>
  );
}

function StageLabel({ stage }: { stage?: Stage | string }) {
  const key = normalizeStage(stage);
  if (!key) return null;
  const meta = stageMeta[key];

  return (
    <span className={`text-[14px] font-semibold px-[10px] py-[2px] rounded-sm border ${meta.pillClass}`}>
      <span>{meta.label}</span>
    </span>
  );
}

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  entries?: GetMemoResponse[];
  /**
   * NEW: pass revertItems from parent (DetailHeader).
   * DecisionHistory will only inject these into 1st_review card UI.
   */
  revertItems?: RevertHistory[] | undefined;
};

export default function DecisionHistory({
  open,
  onClose,
  title = "Decision History",
  entries,
  revertItems,
}: Props) {
  const queryClient = useQueryClient();
  // @ts-expect-error rija
  const accessToken = useSession()?.data?.accessToken ?? "";
  const { data: dataInitial } = useCaseDetailContext();
  const stage = dataInitial?.stage as Stage;
  const caseId = dataInitial?.id ?? "";
  const [revertModalOpen, setRevertModalOpen] = useState(false);
  const [revertReason, setRevertReason] = useState("");
  const [selectedEntryId, setSelectedEntryId] = useState<string | number | null>(null);

  const revertMutation = useMutation({
    mutationFn: async (reason: string) => {
      if (!caseId || !accessToken) throw new Error("Missing caseId or access token");
      return PostRevertCam({
        accessToken,
        caseId,
        body: { reason },
      });
    },
    onSuccess: () => {
      toast.success("Successfully reverted to 1st Review, refetching...");
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    },
    onError: (err: any) => {
      console.error("Revert failed", err);
      toast.error("Failed to revert. See console for details.");
    },
  });

  if (!open) return null;

  const openRevertModalForEntry = (entryId: string | number) => {
    setSelectedEntryId(entryId);
    setRevertReason("");
    setRevertModalOpen(true);
  };

  const submitRevert = () => {
    if (!revertReason.trim()) {
      alert("Please provide a reason to revert.");
      return;
    }
    revertMutation.mutate(revertReason.trim());
  };

  /**
   * RENDER: Revert items block to be injected inside 1st_review card
   */
  const renderRevertSection = (items?: RevertHistory[]) => {
    if (!Array.isArray(items) || items.length === 0) return null;

    return (
      <div className="mt-4 space-y-4">
        {items.map((r) => (
          <div key={r.id} className="rounded-md border mt-3 border-gray-200 bg-white">
            <div className="px-4 py-2 border-b text-sm text-slate-600 font-medium bg-gray-50 rounded-t-md">
              {/* Reverted Back • date */}
              <div className="flex items-center justify-between">
                <div>Reverted Back • {r.created_at ? new Date(r.created_at).toLocaleString() : ""}</div>
              </div>
            </div>

            <div className="px-4 py-4">
              <div className="flex items-start gap-3">
                <div>
                  {r.user?.pic ? (
                    // small avatar
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.user.pic} alt={r.user.first_name} className="w-[32px] h-[32px] rounded-full object-cover" />
                  ) : (
                    <img
                      // fallback avatar
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80"
                      alt={r.user?.first_name ?? "User"}
                      className="w-[32px] h-[32px] rounded-full object-cover"
                    />
                  )}
                </div>

                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-800">
                    {r.user?.first_name} {r.user?.last_name}
                  </div>

                  <div className="mt-3 rounded-md border border-gray-100 bg-slate-50 p-3">
                    <div className="text-xs text-slate-500 mb-1">Revert Reason</div>
                    <div className="text-sm text-slate-700">{r.reason}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div
        className="relative max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-auto p-[24px]"
        style={{ maxHeight: "90vh" }}
      >
        <div className="flex items-center justify-between mb-[20px]">
          <h3 className="text-lg font-semibold text-black">{title}</h3>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6l12 12" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-6">
            <div className="flex-1">
              <div className="space-y-6">
                {!entries?.length ? (
                  <div className="flex justify-center">Data is empty</div>
                ) : (
                  entries?.map((e) => {
                    const isFirstReview = normalizeStage(e.stage as string) === "1st_review";
                    return (
                      <div key={e.id} className="flex gap-4">
                        <div className="relative">
                          <div className="flex-shrink-0 mt-1 mr-[16px]">
                            <TimelineDot name={e?.stage as string} />
                          </div>
                        </div>

                        <div className="flex-1 border p-12 rounded-lg border-gray-200">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                <div>
                                  <div className="flex gap-1">
                                    {e.stage && <StageLabel stage={e.stage as string} />}
                                    {e.stage === "video" || e.stage === "phone" && (
                                      <div
                                        onClick={() => console.log("log")}
                                        className="bg-gray-100 text-14 text-gray-600 font-medium p-1 rounded-sm flex items-center justify-center gap-2"
                                      >
                                        Log <ChevronRight className="size-[14px]" />
                                      </div>
                                    )}
                                  </div>

                                  {e.stage !== "rejected" && e.stage !== "cancelled" && (
                                    <div className="flex gap-2 mt-[12px]">
                                      {e.user?.pic ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={e.user.pic} alt={e.user.first_name} className="w-[32px] h-[32px] rounded-full object-cover" />
                                      ) : (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80"
                                          alt={e.user?.first_name || "User"}
                                          className="w-[32px] h-[32px] rounded-full object-cover"
                                        />
                                      )}
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm font-medium text-slate-800">
                                            {(e as any).user?.first_name} {(e as any).user?.last_name}
                                          </span>
                                        </div>
                                        {e.created_at && <div className="text-xs text-slate-400">{e.created_at}</div>}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* RIGHT SIDE: show revert button when this entry is cam_review */}
                            <div>
                              {normalizeStage(e.stage as string) === "cam_review" && (
                                <button
                                  onClick={() => openRevertModalForEntry(e.id)}
                                  className="bg-gray-100 px-[10px] py-[2px] rounded-[6px] text-gray-600 text-[12px]"
                                  title="Revert to 1st Review"
                                >
                                  Revert to 1st Review
                                </button>
                              )}
                            </div>
                          </div>

                          {/* MAIN BODY */}
                          {e.stage !== "rejected" && e.stage !== "cancelled" ? (
                            <div className="mt-3">
                              {e.memo && (
                                <div className="rounded-md border border-gray-200 bg-slate-50 p-2 relative">
                                  <Image src={iconMemo} alt="memo" width={18} height={18} className="absolute left-2 top-2" />
                                  <p className="text-sm text-slate-700 pl-[24px]">{e.memo}</p>
                                </div>
                              )}

                              {/* INJECT revertItems only for 1st_review */}
                              {isFirstReview && renderRevertSection(revertItems)}
                            </div>
                          ) : (
                            <div className="bg-gray-50 p-12 border border-gray-300 rounded-lg mt-12">
                              <label className="text-gray-600 text-14">Reason</label>
                              <p className="text-gray-900 text-16 font-medium">{(e as any).reason}</p>

                              {/* memo */}
                              {e.memo && (
                                <div className="rounded-md border border-gray-200 bg-white p-2 relative mt-12">
                                  <Image src={iconMemo} alt="memo" width={18} height={18} className="absolute left-2 top-2" />
                                  <p className="text-sm text-slate-700 pl-[24px]">{e.memo}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revert modal */}
      {revertModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setRevertModalOpen(false)} />

          <div className="relative w-[400px] bg-white rounded-xl shadow-xl p-[24px] z-70">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start justify-start flex-col gap-3">
                <div className="w-[48px] h-[48px] rounded-full bg-orange-50 flex items-center justify-center">
                  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="4" width="48" height="48" rx="24" fill="#FFE1D6" />
                    <rect x="4" y="4" width="48" height="48" rx="24" stroke="#FFEFEB" strokeWidth="8" />
                    <path
                      d="M19 25H32.5C34.9853 25 37 27.0147 37 29.5C37 31.9853 34.9853 34 32.5 34H28M19 25L23 21M19 25L23 29"
                      stroke="#D92D20"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h4 className="text-[16px] text-gray-900 font-semibold">
                  Are you sure you want to revert this application back to “1st Review”?
                </h4>
              </div>

              <button onClick={() => setRevertModalOpen(false)} className="rounded-full p-1 hover:bg-gray-100">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <label className="block text-sm text-gray-700 mb-2 mt-[16px]">
              Revert Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              value={revertReason}
              onChange={(v) => setRevertReason((v.target as HTMLTextAreaElement).value)}
              className="w-full min-h-[120px] rounded-md border border-gray-200 p-3 resize-none mb-4"
              placeholder="Enter the reason..."
            />

            <div className="flex justify-between gap-3 mt-[32px]">
              <Button
                onClick={() => {
                  setRevertModalOpen(false);
                  setRevertReason("");
                  setSelectedEntryId(null);
                }}
                className="px-4 py-[10px] rounded-md bg-white border border-gray-200 flex-1"
              >
                Cancel
              </Button>

              <Button
                onClick={submitRevert}
                disabled={revertMutation.isPending}
                className="px-4 py-[10px] rounded-md bg-brand-500 text-white disabled:opacity-60 flex-1"
              >
                {revertMutation.isPending ? "Reverting..." : "Yes, Revert"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
