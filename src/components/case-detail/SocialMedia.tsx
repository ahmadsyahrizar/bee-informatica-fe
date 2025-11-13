"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
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

export function SocialMedia(
  {
    facebookProfileUrl,
    instagramProfileUrl,
  }: {
    facebookProfileUrl?: string;
    instagramProfileUrl?: string;
  }) {
  const [igUrl, setIgUrl] = useState("");
  const [fbUrl, setFbUrl] = useState("");
  const [isEditing, setIsEditing] = useState({
    fb: false,
    ig: false
  });

  const [igError, setIgError] = useState<string | null>(null);
  const [fbError, setFbError] = useState<string | null>(null);

  const { data: session } = useSession();
  const { id } = useParams();
  // @ts-expect-error rija
  const accessToken = session?.accessToken;
  const { mutate } = useMutation({
    mutationKey: ["updateSocmed", id],
    mutationFn: (body: PayloadUpdateSocialMedia) => UpdateSocialMedia({
      accessToken,
      caseId: id as string,
      body
    }),
  });

  const isValidSocialUrl = (type: "ig" | "fb", rawUrl: string) => {
    if (!rawUrl || rawUrl.trim() === "") {
      return { ok: false, message: "URL is required." };
    }

    let candidate = rawUrl.trim();
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
        if (
          host === "facebook.com" ||
          host.endsWith(".facebook.com") ||
          host === "fb.me"
        ) {
          return { ok: true, message: "" };
        }
        return { ok: false, message: "URL must be a facebook.com profile." };
      }

      return { ok: false, message: "Invalid social media URL." };
    } catch (err) {
      return { ok: false, message: "Invalid URL format." };
    }
  };

  const handleSave = (type: "ig" | "fb", url: string) => {
    const { ok, message } = isValidSocialUrl(type, url);
    if (!ok) {
      if (type === "ig") setIgError(message);
      if (type === "fb") setFbError(message);
      toast.error(`Invalid URL: ${message}`);
      return;
    }

    if (type === "ig") setIgError(null);
    if (type === "fb") setFbError(null);

    mutate({
      type,
      url,
    }, {
      onError: (error: any) => {
        toast.error(`Failed to update social media. Reason: ${error?.message ?? "Unknown"}. Please try again.`);
      },
      onSuccess: (data) => {
        console.log({ data })
        toast.success("Social media updated successfully.");
      },
      onSettled: () => {
        setIsEditing({
          fb: false,
          ig: false
        });
      }
    });
  };

  const onEdit = (type: "fb" | "ig") => {
    setIsEditing(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    if (type === "fb") setFbError(null);
    if (type === "ig") setIgError(null);
  };

  const onUpdate = (type: "ig" | "fb", url: string) => {
    handleSave(type, url);
  };

  useEffect(() => {
    if (instagramProfileUrl) setIgUrl(instagramProfileUrl || "");
    if (facebookProfileUrl) setFbUrl(facebookProfileUrl || "");
  }, [instagramProfileUrl, facebookProfileUrl]);

  return (
    <section id="social-media" className="mt-32 scroll-mt-28 lg:scroll-mt-32">
      <Toaster />
      <h2 className="text-[18px] font-semibold tracking-tight mb-6">Social Media</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Facebook Column */}
        <div>
          <div className="mb-12 flex items-center justify-between">
            <h3 className="text-[16px] font-semibold">Facebook</h3>
            <div className="flex items-center gap-2">
              {
                isEditing.fb ?
                  <button
                    className={`cursor-pointer rounded-md border border-gray-300 p-[8px] ${fbError ? "bg-gray-300 pointer-events-none opacity-60" : "bg-[#17B26A]"}`}
                    onClick={() => onUpdate("fb", fbUrl)}
                    aria-disabled={!!fbError}
                    title={fbError ?? "Save Facebook URL"}
                  >
                    <Image src={iconApproved} alt="save" width={16} height={16} />
                  </button> :
                  <div
                    className="cursor-pointer rounded-md border border-gray-30 h-9 w-9 flex justify-center items-center bg-white"
                    onClick={() => onEdit("fb")}
                    role="button"
                    aria-label="Edit Facebook URL"
                  >
                    <Image src={iconEdit} alt="edit" width={16} height={16} />
                  </div>
              }
              {facebookProfileUrl && (
                <Link
                  href={facebookProfileUrl}
                  target="_blank"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-brand-500 text-orange-600 hover:bg-orange-50 transition"
                  aria-label="Open Facebook Profile"
                >
                  <Image src={iconLink} width={16} height={16} alt="link" />
                </Link>
              )}
            </div>
          </div>
          <InputSocmed
            disabled={isEditing.fb}
            tempUrl={fbUrl}
            openFor="facebook"
            setTempUrl={(v) => {
              setFbUrl(v);
              // live-validate
              const { ok, message } = isValidSocialUrl("fb", v);
              setFbError(ok ? null : message);
            }}
            error={fbError}
          />
        </div>

        {/* Instagram Column */}
        <div>
          <div className="mb-12 flex items-center justify-between">
            <h3 className="text-[16px] font-semibold">Instagram</h3>
            <div className="flex items-center gap-2">
              {
                isEditing.ig ?
                  <button
                    className={`cursor-pointer rounded-md border border-gray-300 p-[8px] ${igError ? "bg-gray-300 pointer-events-none opacity-60" : "bg-[#17B26A]"}`}
                    onClick={() => onUpdate("ig", igUrl)}
                    aria-disabled={!!igError}
                    title={igError ?? "Save Instagram URL"}
                  >
                    <Image src={iconApproved} alt="save" width={16} height={16} />
                  </button> :
                  <div
                    className="cursor-pointer rounded-md border border-gray-30 h-9 w-9 flex justify-center items-center bg-white"
                    onClick={() => onEdit("ig")}
                    role="button"
                    aria-label="Edit Instagram URL"
                  >
                    <Image src={iconEdit} alt="edit" width={16} height={16} />
                  </div>
              }
              {instagramProfileUrl && (
                <Link
                  href={instagramProfileUrl}
                  target="_blank"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-brand-500 text-orange-600 hover:bg-orange-50 transition"
                  aria-label="Open Instagram Profile"
                >
                  <Image src={iconLink} width={20} height={20} alt="link" />
                </Link>
              )}
            </div>
          </div>
          <InputSocmed
            disabled={isEditing.ig}
            tempUrl={igUrl}
            openFor="instagram"
            setTempUrl={(v) => {
              setIgUrl(v);
              // live-validate
              const { ok, message } = isValidSocialUrl("ig", v);
              setIgError(ok ? null : message);
            }}
            error={igError}
          />
        </div>
      </div>
    </section>
  );
}

const InputSocmed = ({ openFor, tempUrl, setTempUrl, disabled, error }: {
  openFor: string;
  tempUrl: string;
  setTempUrl: (param: string) => void;
  disabled: boolean;
  error?: string | null;
}) => {

  return (
    <div className="space-y-2 mt-20 mb-20">
      <Label className="text-[14px]">
        Business Profile URL <span className="text-red-500">*</span>
      </Label>
      <Input
        readOnly={!disabled}
        disabled={!disabled}
        placeholder={
          openFor === "facebook"
            ? "www.facebook.com/business"
            : "www.instagram.com/business"
        }
        value={tempUrl}
        onChange={(e) => setTempUrl(e.target.value)}
        className={`h-40 ${error ? "border-red-500" : ""}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${openFor}-error` : undefined}
      />
      {error && (
        <p id={`${openFor}-error`} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
