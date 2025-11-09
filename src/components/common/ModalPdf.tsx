"use client";
import React from "react";
import { ExternalLink, Download } from "lucide-react";

type Props = {
 isOpen: boolean;
 onClose: () => void;
 pdfUrl: string;
 pdfFilename?: string;
};

export default function PdfModal({ isOpen, onClose, pdfUrl, pdfFilename = "document.pdf" }: Props) {
 if (!isOpen) return null;

 const safeUrl = pdfUrl || "";

 return (
  <div style={overlay}>
   <div style={modal}>
    {/* header toolbar */}
    <div style={header}>
     <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button onClick={onClose} aria-label="Close" style={closeBtn}>
       ✕
      </button>
     </div>

     <div style={{ display: "flex", gap: 8 }}>
      {safeUrl ? (
       <>
        <a
         href={safeUrl}
         target="_blank"
         rel="noopener noreferrer"
         title="Open in new tab"
         style={toolbarBtn}
        >
         <ExternalLink />
        </a>

        <a
         href={safeUrl}
         download={pdfFilename}
         title="Download"
         style={toolbarBtn}
        >
         <Download />
        </a>
       </>
      ) : (
       <div style={{ color: "#666", fontSize: 13 }}>No document available</div>
      )}
     </div>
    </div>

    <div style={{ height: "80vh", width: "100%", marginTop: 8 }}>
     {safeUrl ? (
      // Use iframe so browser's native PDF viewer handles zoom/print/download.
      // Keep sandboxing disabled so the browser PDF UI works.
      <iframe
       src={safeUrl}
       title="Document preview"
       style={{ width: "100%", height: "80vh", border: "none", borderRadius: 8 }}
       allowFullScreen
      />
     ) : (
      <div style={{ padding: 24 }}>No preview available for this document.</div>
     )}
    </div>
   </div>
  </div>
 );
}

/* styles */
const overlay: React.CSSProperties = {
 position: "fixed",
 inset: 0,
 background: "rgba(0,0,0,0.6)",
 display: "flex",
 alignItems: "center",
 justifyContent: "center",
 zIndex: 9999,
};

const modal: React.CSSProperties = {
 width: "90%",
 maxWidth: 1100,
 background: "#fff",
 borderRadius: 8,
 padding: 12,
 position: "relative",
 boxSizing: "border-box",
 display: "flex",
 flexDirection: "column",
};

const header: React.CSSProperties = {
 display: "flex",
 justifyContent: "space-between",
 alignItems: "center",
 gap: 8,
 padding: "8px 12px",
};

const closeBtn: React.CSSProperties = {
 border: "none",
 background: "transparent",
 fontSize: 20,
 cursor: "pointer",
 padding: 6,
};

const toolbarBtn: React.CSSProperties = {
 display: "inline-flex",
 alignItems: "center",
 justifyContent: "center",
 width: 36,
 height: 36,
 borderRadius: 6,
 border: "1px solid #e6e6e6",
 background: "#fff",
 textDecoration: "none",
 color: "inherit",
};
