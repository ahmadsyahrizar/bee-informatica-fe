"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, Ban } from "lucide-react";
import { Separator } from "@/components/ui/separator"; // ← fix import
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

const items = [
  "Overview",
  "AI Highlight",
  "AI Financial Summary",
  "Sales Report",
  "Evaluation Details",
  "CCRIS",
  "Photos",
  "Social Media",
  "Documents",
];

export function OverviewSidebar({
  onConfirmCancel, // optional callback to actually cancel on your side
}: {
  onConfirmCancel?: () => void | Promise<void>;
}) {
  const [openCancel, setOpenCancel] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { push } = useRouter()

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      await onConfirmCancel?.(); // call your service if provided
      setOpenCancel(false);
    } finally {
      setSubmitting(false);
      push(`/cases`)
    }
  };

  return (
    <>
      <Button variant="link" className="h-8 rounded-xl px-3 gap-1 font-semibold text-14 mb-[40px]">
        <ArrowLeft className="size-[20px]" />{" "}
        <span className="text-gray-600">Back</span>
      </Button>

      <nav className="sticky top-20 hidden lg:block">
        <Separator className="mb-6" />
        <ul className="space-y-6">
          {items.map((t, i) => (
            <li key={i}>
              <Link
                href="#"
                className={`block rounded-lg px-10 py-6 text-14 text-gray-500 font-semibold hover:bg-gray-50 ${i === 0 ? "bg-gray-50 text-gray-700" : ""
                  }`}
              >
                {t}
              </Link>
            </li>
          ))}
        </ul>

        {/* Trigger */}
        <button
          type="button"
          onClick={() => setOpenCancel(true)}
          className="fixed bottom-40 text-[#D92D20] text-12 font-semibold underline cursor-pointer"
        >
          Cancel Application
        </button>
      </nav>

      {/* Modal */}
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
