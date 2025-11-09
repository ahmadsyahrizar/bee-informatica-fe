import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React from "react";
import iconMemo from "@/assets/icons/icon-memo.svg"
import { GetMemoResponse } from "@/types/api/memo.type";
import { Stage } from "@/types/case";



type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  entries?: GetMemoResponse[];
};

function Icon({ name }: { name?: Stage | string }) {
  switch (name) {
    case "phone":
      return (
        <div className="w-[28px] h-[28px] rounded-full bg-white border flex items-center justify-center shadow-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-blue-600">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.09 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72c.12.9.38 1.78.76 2.6a2 2 0 0 1-.45 2.11L8.91 9.91a14 14 0 0 0 6 6l.48-.48a2 2 0 0 1 2.11-.45c.82.38 1.7.64 2.6.76A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
    case "video":
      return (
        <div className="w-[28px] h-[28px] rounded-full bg-white border flex items-center justify-center shadow-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-600">
            <path d="M23 7l-7 5 7 5V7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="1" y="5" width="15" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </div>
      );
    case "rejected":
      return (
        <div className="w-[28px] h-[28px] rounded-full bg-red-50 border border-red-200 flex items-center justify-center shadow-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-red-500">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="w-[28px] h-[28px] rounded-full bg-white border flex items-center justify-center shadow-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </div>
      );
  }
}

function StageLabel({ stage }: { stage: Stage }) {
  const classNameLabel = {
    "phone": "text-blue-70 border-blue-200 bg-blue-50",
    "video": " bg-pink-50 text-pink-700 border-pink-200",
    "1st_review": "",
    "cam_review": "",
    "offered": "",
    "rejected": "bg-error-50 border-error-200 text-error-700",
    "cancelled": "bg-error-50 border-error-200 text-error-700",
    "default": "border-gray-300 text-gray-700 bg-gray-50"
  }

  return <span className={`text-[14px] font-semibold px-[10px] py-[2px] rounded-sm border ${classNameLabel[stage as keyof typeof classNameLabel]}`}>{stage}</span>
}

export default function DecisionHistory({ open, onClose, title = "Decision History", entries }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-auto p-[24px]" style={{ maxHeight: '90vh' }}>
        <div className="flex items-center justify-between mb-[20px]">
          <h3 className="text-lg font-semibold text-black">{title}</h3>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-gray-100">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-6">
            <div className="flex-1">
              <div className="space-y-6">
                {entries?.map((e, idx) => (
                  <div key={e.id} className="flex gap-4">
                    <div className="relative">
                      <div className="flex-shrink-0 mt-1 mr-[16px]">
                        <Icon name={e?.stage as string} />
                      </div>
                      <div className="h-full absolute w-px bg-slate-200 left-3" style={{ transform: 'translateY(8px)' }} />
                    </div>

                    <div className="flex-1 border p-12 rounded-lg border-gray-200">
                      {/* header with badge, author, timestamp */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <div>
                              <div className="flex gap-1">
                                {e.stage && <StageLabel stage={e.stage as Stage} />}
                                {e.stage !== 'rejected' && e.stage !== "cancelled" && <div onClick={() => console.log("log")} className="bg-gray-100 text-14 text-gray-600 font-medium p-1 rounded-sm  flex items-center justify-center gap-2">Log <ChevronRight className="size-[14px]" />
                                </div>}
                              </div>
                              {
                                e.stage !== 'rejected' && e.stage !== "cancelled" &&
                                <div className="flex gap-2 mt-[12px]">
                                  {e.user?.pic ? (
                                    <img src={e.user.pic} alt={e.user.first_name} className="w-[32px] h-[32px] rounded-full object-cover" />
                                  ) :
                                    <img src={"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80"} alt={e.user.first_name} className="w-[32px] h-[32px] rounded-full object-cover" />
                                  }
                                  <div>

                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium text-slate-800">{e.user.first_name} {e.user.last_name}</span>
                                    </div>
                                    {e.created_at && <div className="text-xs text-slate-400">{e.created_at}</div>}
                                  </div>
                                </div>
                              }
                            </div>
                          </div>
                        </div>
                        <div />
                      </div>

                      {
                        (e.stage !== "rejected" && e.stage !== "cancelled") ? (
                          <div className="mt-3">
                            {e.memo && (
                              <div className="rounded-md border  border-gray-200 bg-slate-50 p-2 relative">
                                <Image src={iconMemo} alt="memo" width={18} height={18} className="absolute left-2 top-2" />
                                <p className="text-sm text-slate-700 pl-[24px]">{e.memo}</p>
                              </div>
                            )}
                          </div>
                        )
                          : (
                            <div className="bg-gray-50 p-12 border border-gray-300 rounded-lg mt-12">
                              <label className="text-gray-600 text-14">Reason</label>
                              <p className="text-gray-900 text-16 font-medium">{e.reason}</p>

                              {/* memo */}
                              {e.memo && (
                                <div className="rounded-md border border-gray-200 bg-white p-2 relative mt-12">
                                  <Image src={iconMemo} alt="memo" width={18} height={18} className="absolute left-2 top-2" />
                                  <p className="text-sm text-slate-700 pl-[24px]">{e.memo}</p>
                                </div>
                              )}
                            </div>
                          )
                      }

                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

// Example default props to help you test quickly
DecisionHistory.defaultProps = {
  entries: [
    {
      id: 1,
      stage: "Phone",
      type: "phone",
      author: { name: "Jane Cooper", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80" },
      timestamp: "2025/09/15 10:20AM",
      summary: "Everything seems good",
      badge: "Phone",
    },
    { id: 2, stage: "Video", type: "video" },
    { id: 3, stage: "1st Review", type: "review" },
    { id: 4, stage: "CAM Review", type: "bookmark" },
    { id: 5, stage: "Offered", type: "offered" },
    {
      id: 6,
      stage: "Rejected",
      type: "rejected",
      reason: "High interest",
      reasonTitle: "High interest",
      docNote: "Cannot proceed to the video stage",
    },
  ],
};
