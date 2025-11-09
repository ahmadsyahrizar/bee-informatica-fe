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
import { on } from "events";
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
  const { data: session } = useSession();
  const { id } = useParams()
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

  useEffect(() => {
    if (instagramProfileUrl) setIgUrl(instagramProfileUrl || "");
    if (facebookProfileUrl) setFbUrl(facebookProfileUrl || "");
  }, [instagramProfileUrl, facebookProfileUrl]);


  const handleSave = (type: "ig" | "fb", url: string) => {
    mutate({
      type,
      url,
    }, {
      onError: (error) => {
        toast.error(`Failed to update social media. Reason: ${error.message} Please try again.`);
      },
      onSuccess: (data) => {
        console.log({ data })
        toast.success("Social media updated successfully.");
      }
    })
  };

  return (
    <section id="social-media" className="mt-32 scroll-mt-28 lg:scroll-mt-32">
      <h2 className="text-[18px] font-semibold tracking-tight mb-6">Social Media</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Facebook Column */}
        <div>
          <div className="mb-12 flex items-center justify-between">
            <h3 className="text-[16px] font-semibold">Facebook</h3>
            <div className="flex items-center gap-5">
              {facebookProfileUrl && (
                <Link
                  href={facebookProfileUrl}
                  target="_blank"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-brand-500 text-orange-600 hover:bg-orange-50 transition"
                  aria-label="Open Facebook Profile"
                >
                  <Image src={iconLink} width={20} height={20} alt="link" />
                </Link>
              )}
            </div>
          </div>
          <InputSocmed onBlur={handleSave} tempUrl={fbUrl} openFor="facebook" setTempUrl={setFbUrl} />
        </div>

        {/* Instagram Column */}
        <div>
          <div className="mb-12 flex items-center justify-between">
            <h3 className="text-[16px] font-semibold">Instagram</h3>
            <div className="flex items-center gap-5">
              {instagramProfileUrl && (
                <Link
                  href={instagramProfileUrl}
                  target="_blank"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-brand-500 text-orange-600 hover:bg-orange-50 transition"
                  aria-label="Open Instagram Profile"
                >
                  <Image src={iconLink} width={20} height={20} alt="link" />
                </Link>
              )}
            </div>
          </div>
          <InputSocmed onBlur={handleSave} tempUrl={igUrl} openFor="instagram" setTempUrl={setIgUrl} />
        </div>
      </div>
    </section>
  );
}

const InputSocmed = ({ openFor, tempUrl, setTempUrl, onBlur }: {
  openFor: string;
  tempUrl: string;
  onBlur: (type: "ig" | "fb", url: string) => void;
  setTempUrl: (param: string) => void;
}) => {

  return (
    <div className="space-y-2 mt-20 mb-20">
      <Label className="text-[14px]">
        Business Profile URL <span className="text-red-500">*</span>
      </Label>
      <Input
        placeholder={
          openFor === "facebook"
            ? "www.facebook.com/business"
            : "www.instagram.com/business"
        }
        value={tempUrl}
        onBlur={() => {
          onBlur(openFor === "facebook" ? "fb" : "ig", tempUrl)
        }}
        onChange={(e) => setTempUrl(e.target.value)}
        className="h-40"
      />
    </div>
  )
}