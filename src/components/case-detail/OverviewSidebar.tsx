"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { usePathname, useRouter } from "next/navigation";
import Cancellation from "./Cancellation";

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

export function OverviewSidebar() {
  const { replace } = useRouter();
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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash?.replace("#", "");
    if (hash) {
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

        <Cancellation />
      </nav>
    </>
  );
}
