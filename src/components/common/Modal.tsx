"use client";

import React, { useEffect } from "react";

type ModalLayoutProps = {
 open: boolean;
 title?: string;
 onClose: () => void;
 /**
  * element to focus when the modal opens (ref.current)
  */
 initialFocusRef?: React.RefObject<HTMLElement | null>;
 children?: React.ReactNode;
 /**
  * Optional footer area. Caller can provide buttons/footer markup.
  */
 footer?: React.ReactNode;
 /**
  * width control (tailwind w-[] or percentage)
  */
 className?: string;
};

export default function ModalLayout({
 open,
 title,
 onClose,
 initialFocusRef,
 children,
 footer,
 className = "w-[720px] max-w-[95%]",
}: ModalLayoutProps) {
 useEffect(() => {
  if (!open) return;

  const handleKey = (e: KeyboardEvent) => {
   if (e.key === "Escape") onClose();
  };

  window.addEventListener("keydown", handleKey);
  // focus initial element if provided
  if (initialFocusRef?.current) {
   // delay to allow rendering
   setTimeout(() => initialFocusRef.current?.focus(), 0);
  }

  return () => window.removeEventListener("keydown", handleKey);
 }, [open, onClose, initialFocusRef]);

 if (!open) return null;

 return (
  <div
   className="fixed inset-0 z-50 flex items-center justify-center"
   role="dialog"
   aria-modal="true"
   aria-labelledby={title ? "modal-title" : undefined}
  >
   {/* backdrop */}
   <div
    className="absolute inset-0 bg-black/40"
    onClick={onClose}
    aria-hidden
   />

   {/* dialog box */}
   <div
    className={`relative ${className} bg-white rounded-2xl shadow-2xl p-5 z-10`}
   >
    <div className="flex items-start justify-between gap-4">
     <div>
      {title ? (
       <h2 id="modal-title" className="text-lg font-semibold">
        {title}
       </h2>
      ) : null}
     </div>

     <button
      onClick={onClose}
      aria-label="Close"
      className="rounded-full p-2 hover:bg-gray-100"
     >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
       <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
       />
      </svg>
     </button>
    </div>

    {/* content */}
    <div className="mt-4">{children}</div>

    {/* footer */}
    {footer ? <div className="mt-6 flex justify-end items-center gap-3">{footer}</div> : null}
   </div>
  </div>
 );
}
