"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import iconInstagram from "./../../../public/icons/instagram.svg";
import iconFacebook from "./../../../public/icons/facebook.svg";
import iconLike from "./../../../public/icons/like.svg";
import iconComment from "./../../../public/icons/comment.svg";
import iconLink from "./../../../public/icons/link.svg";
import { Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Platform = "facebook" | "instagram";

export type SocialPost = {
  id: string | number;
  platform: Platform;
  username: string;
  date: string;
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
  onUpdateProfileUrl, // optional callback to persist
}: {
  facebook: SocialPost[];
  instagram: SocialPost[];
  facebookProfileUrl?: string;
  instagramProfileUrl?: string;
  className?: string;
  onUpdateProfileUrl?: (platform: Platform, url: string) => void;
}) {
  // modal state
  const [openFor, setOpenFor] = React.useState<Platform | null>(null);
  const [tempUrl, setTempUrl] = React.useState("");

  const openEdit = (platform: Platform) => {
    setOpenFor(platform);
    setTempUrl(platform === "facebook" ? (facebookProfileUrl ?? "") : (instagramProfileUrl ?? ""));
  };
  const closeEdit = () => setOpenFor(null);

  const handleSave = () => {
    if (!tempUrl.trim()) return;
    onUpdateProfileUrl?.(openFor as Platform, tempUrl.trim());
    closeEdit();
  };

  return (
    <section className={className}>
      <h2 className="text-[18px] font-semibold tracking-tight mb-6">Social Media</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Facebook Column */}
        <div>
          <div className="mb-12 flex items-center justify-between">
            <h3 className="text-[16px] font-semibold">Facebook</h3>
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => openEdit("facebook")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50"
                aria-label="Edit Facebook URL"
              >
                <Edit className="size-[18px]" />
              </button>

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
            <div className="flex items-center gap-5">
              <button
                type="button"
                onClick={() => openEdit("instagram")}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50"
                aria-label="Edit Instagram URL"
              >
                <Edit className="size-[18px]" />
              </button>

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {instagram.map((p) => (
              <SocialCard key={p.id} post={p} />
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={!!openFor} onOpenChange={(v) => (v ? null : closeEdit())}>
        <DialogContent className="max-w-640px] p-24 bg-white">
          <DialogHeader>
            <DialogTitle className="text-[18px]">
              {openFor === "facebook" ? "Facebook" : "Instagram"}
            </DialogTitle>
          </DialogHeader>

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
              onChange={(e) => setTempUrl(e.target.value)}
              className="h-40"
            />
          </div>

          <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" className="p-16" onClick={closeEdit}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-brand-500 p-16 text-white">
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

/* ----------------------- Card stays the same ----------------------- */
function SocialCard({ post }: { post: SocialPost }) {
  const { platform, username, date, text, imageUrl, likes, comments } = post;

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-12 p-12">
          <div className="relative h-32 w-32 rounded-full overflow-hidden ring-1 ring-slate-200">
            <Image src="/favicon.ico" alt="brand" fill className="object-cover" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <div className="truncate">
                <span className="font-semibold">@{username.replace(/^@/, "")}</span>
                <div className="text-xs text-slate-500">{date}</div>
              </div>

              <div>
                {platform === "facebook" ? (
                  <Image src={iconFacebook} alt="facebook" className="h-24 w-24" />
                ) : (
                  <Image src={iconInstagram} alt="ig" className="h-24 w-24" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="px-12">
          <p className="text-slate-700 text-[15px] leading-relaxed line-clamp-3">{text}</p>
        </div>

        {/* Image */}
        <div className="relative mt-3 h-[200px] w-full overflow-hidden">
          <Image src={imageUrl} alt="post image" fill className="object-cover" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-start gap-16 px-12 py-3 text-slate-600">
          <div className="flex items-center gap-2">
            <Image src={iconLike} alt="like" className="h-20 w-20" />
            <span className="text-sm">{likes}</span>
          </div>
          <div className="flex items-center gap-2">
            <Image src={iconComment} alt="comment" className="h-20 w-20" />
            <span className="text-sm">{comments}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
