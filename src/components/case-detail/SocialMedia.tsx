"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import iconInstagram from "./../../../public/icons/instagram.svg"
import iconFacebook from "./../../../public/icons/facebook.svg"
import iconLike from "./../../../public/icons/like.svg"
import iconComment from "./../../../public/icons/comment.svg"
import iconLink from "./../../../public/icons/link.svg"
import { Edit } from "lucide-react";

type Platform = "facebook" | "instagram";

export type SocialPost = {
  id: string | number;
  platform: Platform;
  username: string;         // e.g. @emon_kitchen
  date: string;             // already formatted (e.g., "August 24, 2025")
  text: string;
  imageUrl: string;
  likes: number;
  comments: number;
  postUrl?: string;
};

export function SocialMedia({
  facebook,
  instagram,
  facebookProfileUrl,
  instagramProfileUrl,
  className = "",
}: {
  facebook: SocialPost[];
  instagram: SocialPost[];
  facebookProfileUrl?: string;
  instagramProfileUrl?: string;
  className?: string;
}) {
  return (
    <section className={className}>
      <h2 className="text-[18px] font-semibold tracking-tight mb-6">Social Media</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Facebook Column */}
        <div>
          <div className="mb-12 flex items-center justify-between">
            <h3 className="text-[16px] font-semibold">Facebook</h3>
            {facebookProfileUrl && (
              <div className="flex items-center gap-5">
                <Edit className="size-[20px]" />
                <Link href={facebookProfileUrl} target="_blank" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-brand-500 text-orange-600 hover:bg-orange-50 transition">
                  <Image src={iconLink} width={20} height={20} alt="link" />
                </Link>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {facebook.map((p) => (
              <SocialCard key={p.id} post={p} />
            ))}
          </div>
        </div>

        {/* Instagram Column */}
        <div>
          <div className="mb-12 flex items-center justify-between">
            <h3 className="text-[16px] font-semibold">Instagram</h3>
            {instagramProfileUrl && (
              <div className="flex items-center gap-5">
                <Edit className="size-[20px]" />
                <Link href={instagramProfileUrl} target="_blank" className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-brand-500 text-orange-600 hover:bg-orange-50 transition">
                  <Image src={iconLink} width={20} height={20} alt="link" />
                </Link>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {instagram.map((p) => (
              <SocialCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialCard({ post }: { post: SocialPost }) {
  const { platform, username, date, text, imageUrl, likes, comments, postUrl } = post;

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center gap-3 mb-12 p-12">
          <div className="relative h-32 w-32 rounded-full overflow-hidden ring-1 ring-slate-200">
            {/* Brand avatar placeholder (use your brand logo if you have it) */}
            <Image src="/favicon.ico" alt="brand" fill className="object-cover" />
          </div>

          <div className="min-w-0 flex-1 px-12">
            <div className="flex items-center justify-between">
              <div className="truncate">
                <span className="font-semibold">@{username.replace(/^@/, "")}</span>
                <div className="text-xs text-slate-500">{date}</div>
              </div>

              <div>
                {platform === "facebook" ?
                  <Image src={iconFacebook} alt="facebook" className="h-24 w-24" />
                  : <Image src={iconInstagram} alt="ig" className="h-24 w-24" />}
              </div>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="px-12">
          <p className="text-slate-700 text-[15px] leading-relaxed line-clamp-3">
            {text}
          </p>
        </div>

        {/* Image */}
        <div className="relative mt-3 h-[200px] w-full overflow-hidden">
          <Image src={imageUrl} alt="post image" fill className="object-cover" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-start gap-16 px-12 py-3 text-slate-600">
          <div className="flex items-center gap-2">
            <Image src={iconLike} alt="facebook" className="h-20 w-20" />
            <span className="text-sm">{likes}</span>
          </div>
          <div className="flex items-center gap-2">
            <Image src={iconComment} alt="facebook" className="h-20 w-20" />
            <span className="text-sm">{comments}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}  