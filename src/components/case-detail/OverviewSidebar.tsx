"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Ban } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { usePathname, useRouter } from "next/navigation";

// map text → id
const navItems = [
  { label: "Overview", id: "overview" },
  { label: "AI Highlight", id: "ai-highlight" },
  { label: "AI Financial Summary", id: "ai-financial-summary" },
  { label: "Sales Report", id: "sales-report" },
  { label: "Evaluation Details", id: "evaluation-details" },
  { label: "CCRIS", id: "ccris" },
  { label: "Social Media", id: "social-media" },
  { label: "Photos", id: "photos" },
  { label: "Documents", id: "documents" },
];

export function OverviewSidebar({
  onConfirmCancel,
}: {
  onConfirmCancel?: () => void | Promise<void>;
}) {
  const [openCancel, setOpenCancel] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { push, replace } = useRouter();
  const pathname = usePathname();

  const [activeId, setActiveId] = useState<string>(navItems[0].id);

  // Smooth scroll function
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    replace(`${pathname}#${id}`, { scroll: false });
    setActiveId(id);
  };

  // Handle initial load with hash (deep link)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash?.replace("#", "");
    if (hash) {
      // slight delay so layout/height are ready
      setTimeout(() => scrollToId(hash), 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1));
        if (visible[0]?.target?.id) setActiveId(visible[0].target.id);
      },
      {
        rootMargin: "-30% 0px -60% 0px",
        threshold: [0, 0.2, 0.6],
      }
    );

    const ids = navItems.map((n) => n.id);
    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      await onConfirmCancel?.();
      setOpenCancel(false);
    } finally {
      setSubmitting(false);
      push(`/cases`);
    }
  };

  return (
    <>
      <Button variant="link" className="h-8 rounded-xl px-3 gap-1 font-semibold text-14 mb-[40px]">
        <ArrowLeft className="size-[20px]" />
        <span className="text-gray-600">Back</span>
      </Button>

      <nav className="sticky top-20 hidden lg:block">
        <Separator className="mb-6" />
        <ul className="space-y-2">
          {navItems.map(({ label, id }) => {
            const isActive = activeId === id;
            return (
              <li key={id}>
                {/* Link used for semantics & right-click copy link; onClick does smooth scroll */}
                <Link
                  href={`#${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId(id);
                  }}
                  className={[
                    "block rounded-lg px-10 py-4 text-14 font-semibold hover:bg-gray-50 transition-colors",
                    isActive ? "bg-gray-50 text-gray-700" : "text-gray-500",
                  ].join(" ")}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          onClick={() => setOpenCancel(true)}
          className="fixed bottom-40 text-[#D92D20] text-12 font-semibold underline cursor-pointer"
        >
          Cancel Application
        </button>
      </nav>

      <Dialog open={openCancel} onOpenChange={setOpenCancel}>
        <DialogContent className="max-w-[460px] bg-white p-24">
          <DialogHeader>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFECE8]">
              <Ban className="h-5 w-5 text-[#D92D20]" />
            </div>
            <DialogTitle className="text-[18px] mt-16">Cancel This Application?</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-600">
            This will cancel the application. You will still be able to view its details,
            but no further changes can be made. This action cannot be undone.
          </p>

          <DialogFooter className="mt-4 gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="p-16">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={submitting}
              className="bg-[#E04B2E] hover:bg-[#CF442A] p-16"
            >
              {submitting ? "Cancelling..." : "Yes, Cancel Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
