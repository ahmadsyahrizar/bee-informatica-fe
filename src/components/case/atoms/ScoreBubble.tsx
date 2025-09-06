import * as React from "react";

function scoreTone(score?: number): "gray" | "success" | "warning" | "error" {
    if (score == null) return "gray";
    if (score >= 85) return "success";
    if (score >= 70) return "warning";
    return "error";
}

export const ScoreBubble: React.FC<{ score?: number }> = ({ score }) => {
    const tone = scoreTone(score);
    let toneCls = "";
    if (tone === "success") {
        toneCls = "bg-success-50 text-success-700 border-success-200";
    } else if (tone === "warning") {
        toneCls = "bg-warning-50 text-warning-700 border-warning-200";
    } else if (tone === "error") {
        toneCls = "bg-red-50 text-error-700 border-error-200";
    } else {
        toneCls = `bg-error-50 text-error-700 border-error-200`;
    }
    return (
        <div className={`h-[32px] w-[44px] rounded-[16px] grid place-items-center border font-medium text-[16px] ${toneCls}`}>
            {score != null ? score : ""}
        </div>
    );
};   