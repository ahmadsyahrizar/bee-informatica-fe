"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import iconLink from "./../../../public/icons/link.svg";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import UpdateSocialMedia from "@/services/UpdateSocialMedia";
import { PayloadUpdateSocialMedia } from "@/types/api/social-media.type";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import iconEdit from "@/assets/icons/icon-edit.svg";
import iconApproved from "@/assets/icons/icon-white-approved.svg";
import { toast, Toaster } from "sonner";

type Props = {
  facebookProfileUrl?: string;
  instagramProfileUrl?: string;
};

export default function SocialMedia({ facebookProfileUrl, instagramProfileUrl }: Props) {
  // local typing values
  const [fbValue, setFbValue] = useState<string>(facebookProfileUrl ?? "");
  const [igValue, setIgValue] = useState<string>(instagramProfileUrl ?? "");

  // saved (last-success) values to detect "changed" state
  const [savedFb, setSavedFb] = useState<string>(facebookProfileUrl ?? "");
  const [savedIg, setSavedIg] = useState<string>(instagramProfileUrl ?? "");

  // validation errors (null => valid)
  const [fbError, setFbError] = useState<string | null>(null);
  const [igError, setIgError] = useState<string | null>(null);

  const { data: session } = useSession();
  const { id } = useParams();
  // @ts-expect-error rija
  const accessToken = session?.accessToken;

  const mutation = useMutation({
    mutationKey: ["updateSocmed", id],
    mutationFn: (body: PayloadUpdateSocialMedia) =>
      UpdateSocialMedia({
        accessToken,
        caseId: id as string,
        body,
      }),
    onError: (error: any) => {
      toast.error(`Failed to update social media. Reason: ${error?.message ?? "Unknown"}.`);
    },
    onSuccess: (data, variables) => {
      toast.success("Social media updated successfully.");
      // update saved value to the latest saved URL so UI reflects saved state
      if (variables.type === "fb") setSavedFb(variables.url);
      if (variables.type === "ig") setSavedIg(variables.url);
    },
  });

  // keep local state in sync if parent props change externally
  useEffect(() => {
    setFbValue(facebookProfileUrl ?? "");
    setSavedFb(facebookProfileUrl ?? "");
  }, [facebookProfileUrl]);

  useEffect(() => {
    setIgValue(instagramProfileUrl ?? "");
    setSavedIg(instagramProfileUrl ?? "");
  }, [instagramProfileUrl]);

  // validation util - returns { ok, message }
  const validateSocialUrl = (type: "fb" | "ig", raw: string) => {
    if (!raw || raw.trim() === "") {
      return { ok: false, message: "URL is required." };
    }

    let candidate = raw.trim();
    if (!/^https?:\/\//i.test(candidate)) {
      candidate = "https://" + candidate;
    }

    try {
      const parsed = new URL(candidate);
      const host = parsed.hostname.toLowerCase();

      if (type === "ig") {
        if (host === "instagram.com" || host.endsWith(".instagram.com")) {
          return { ok: true, message: "" };
        }
        return { ok: false, message: "URL must be an instagram.com profile." };
      }

      if (type === "fb") {
        if (host === "facebook.com" || host.endsWith(".facebook.com") || host === "fb.me") {
          return { ok: true, message: "" };
        }
        return { ok: false, message: "URL must be a facebook.com profile." };
      }

      return { ok: false, message: "Invalid social media URL." };
    } catch (err) {
      return { ok: false, message: "Invalid URL format." };
    }
  };

  // live-validate whenever typed
  useEffect(() => {
    const { ok, message } = validateSocialUrl("fb", fbValue);
    setFbError(ok ? null : message);
  }, [fbValue]);

  useEffect(() => {
    const { ok, message } = validateSocialUrl("ig", igValue);
    setIgError(ok ? null : message);
  }, [igValue]);

  // derived flags    
  const fbIsValid = fbError === null;
  const igIsValid = igError === null;

  // changed from saved
  const fbChanged = useMemo(() => fbValue.trim() !== savedFb.trim(), [fbValue, savedFb]);
  const igChanged = useMemo(() => igValue.trim() !== savedIg.trim(), [igValue, savedIg]);

  // when both valid AND changed -> show save button (check icon)
  const canSaveFb = fbIsValid && fbChanged && !mutation.isPending;
  const canSaveIg = igIsValid && igChanged && !mutation.isPending;

  // handlers
  const handleSave = (type: "fb" | "ig", url: string) => {
    // guard validation (redundant but safe)
    const { ok, message } = validateSocialUrl(type, url);
    if (!ok) {
      if (type === "fb") setFbError(message);
      if (type === "ig") setIgError(message);
      toast.error(`Invalid URL: ${message}`);
      return;
    }

    mutation.mutate({ type, url });
  };

  return (
    <section id="social-media" className="mt-32 scroll-mt-28 lg:scroll-mt-32">
      <Toaster />
      <h2 className="text-[18px] font-semibold tracking-tight mb-6">Social Media</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Facebook */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[16px] font-semibold">Facebook</h3>

            <div className="flex items-center gap-2">
              {canSaveFb ? (
                <button
                  className="cursor-pointer rounded-md border p-[8px] bg-[#17B26A] disabled:opacity-60"
                  onClick={() => handleSave("fb", fbValue)}
                  aria-label="Save Facebook URL"
                >
                  <Image src={iconApproved} alt="save" width={16} height={16} />
                </button>
              ) : (
                <div
                  className="cursor-default rounded-md border h-9 w-9 flex justify-center items-center bg-white"
                  title={fbChanged ? (fbError ? "Invalid URL" : "Fix & save to update") : "Edit Facebook URL"}
                  aria-hidden
                >
                  <Image src={iconEdit} alt="edit" width={16} height={16} />
                </div>
              )}

              {/* show link to saved profile when exists */}
              {savedFb && savedFb.trim() !== "" && (
                <Link
                  href={savedFb}
                  target="_blank"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-brand-500 text-orange-600 hover:bg-orange-50 transition"
                  aria-label="Open Facebook Profile"
                >
                  <Image src={iconLink} width={16} height={16} alt="link" />
                </Link>
              )}
            </div>
          </div>

          <div className="space-y-2 mt-2">
            <Label className="text-[14px]">
              Business Profile URL <span className="text-red-500">*</span>
            </Label>

            <Input
              placeholder="www.facebook.com/business"
              value={fbValue}
              onChange={(e) => setFbValue(e.target.value)}
              className={`h-40 ${fbError ? "border-red-500" : ""}`}
              aria-invalid={!!fbError}
              aria-describedby={fbError ? `facebook-error` : undefined}
            />

            {fbError && (
              <p id="facebook-error" className="text-sm text-red-600">
                {fbError}
              </p>
            )}
          </div>
        </div>

        {/* Instagram */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[16px] font-semibold">Instagram</h3>

            <div className="flex items-center gap-2">
              {canSaveIg ? (
                <button
                  className="cursor-pointer rounded-md border p-[8px] bg-[#17B26A] disabled:opacity-60"
                  onClick={() => handleSave("ig", igValue)}
                  aria-label="Save Instagram URL"
                >
                  <Image src={iconApproved} alt="save" width={16} height={16} />
                </button>
              ) : (
                <div
                  className="cursor-default rounded-md border h-9 w-9 flex justify-center items-center bg-white"
                  title={igChanged ? (igError ? "Invalid URL" : "Fix & save to update") : "Edit Instagram URL"}
                  aria-hidden
                >
                  <Image src={iconEdit} alt="edit" width={16} height={16} />
                </div>
              )}

              {savedIg && savedIg.trim() !== "" && (
                <Link
                  href={savedIg}
                  target="_blank"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-brand-500 text-orange-600 hover:bg-orange-50 transition"
                  aria-label="Open Instagram Profile"
                >
                  <Image src={iconLink} width={20} height={20} alt="link" />
                </Link>
              )}
            </div>
          </div>

          <div className="space-y-2 mt-2">
            <Label className="text-[14px]">
              Business Profile URL <span className="text-red-500">*</span>
            </Label>

            <Input
              placeholder="www.instagram.com/business"
              value={igValue}
              onChange={(e) => setIgValue(e.target.value)}
              className={`h-40 ${igError ? "border-red-500" : ""}`}
              aria-invalid={!!igError}
              aria-describedby={igError ? `instagram-error` : undefined}
            />

            {igError && (
              <p id="instagram-error" className="text-sm text-red-600">
                {igError}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
