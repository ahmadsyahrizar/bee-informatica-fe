import * as React from "react";

export const Pill: React.FC<{
 tone?: "gray" | "success" | "warning" | "error" | "blue";
 className?: string;
 children: React.ReactNode;
}> = ({ tone = "gray", className, children }) => {
 const map: Record<string, string> = {
  gray: "bg-gray-50 text-gray-700 border border-gray-200",
  success: "bg-success-50 text-success-700 border border-success-50",
  warning: "bg-warning-50 text-warning-700 border border-warning-200",
  error: "bg-error-50 text-error-700 border border-red-50",
  blue: "bg-blue-50 text-blue-700 border border-blue-50",
 };
 return (
  <span className={`inline-flex items-center rounded-xl px-3 py-1 text-12 ${map[tone]} ${className ?? ""}`}>
   {children}
  </span>
 );
};