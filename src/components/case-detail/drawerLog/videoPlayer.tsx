"use client";

import { useEffect, useState } from "react";

export const UPLOADED_IMAGE = "/mnt/data/60ba39c6-8c0e-430e-8058-fd7776d9b12c.png";

export default function VideoPlayer({
 src,
 type,
 subtitleUrl,
 subtitleText,
 isLoading = false,
}: {
 src?: string;
 type?: "video" | "phone";
 subtitleUrl?: string | null;
 subtitleText?: string | null;
 isLoading?: boolean;
}) {
 const [trackBlob, setTrackBlob] = useState<string | null>(null);

 /** Convert text → blob URL when needed */
 useEffect(() => {
  let createdUrl: string | null = null;

  // If subtitleUrl is provided we should not create blob
  if (!subtitleUrl && subtitleText) {
   const blob = new Blob([subtitleText], { type: "text/vtt" });
   createdUrl = URL.createObjectURL(blob);
   setTrackBlob(createdUrl);
  }

  return () => {
   // cleanup only the blob we created in this effect
   if (createdUrl) {
    URL.revokeObjectURL(createdUrl);
   }
  };
  // NOTE: we intentionally do not revoke previously created blob synchronously here,
  // cleanup happens inside return so the current blob remains valid during render.
 }, [subtitleText, subtitleUrl]);

 const finalTrack = subtitleUrl || trackBlob || undefined;

 if (!src) {
  return (
   <div className="rounded-xl border bg-muted/10 p-6 text-sm text-muted-foreground">
    No recording available.
   </div>
  );
 }

 const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative rounded-xl overflow-hidden">
   {children}
  </div>
 );

 /** AUDIO */
 if (type === "phone") {
  return (
   <Wrapper>
    <audio controls className="w-full" src={src}>
     {finalTrack && <track kind="subtitles" src={finalTrack} label="EN" default />}
    </audio>
   </Wrapper>
  );
 }

 /** VIDEO */
 return (
  <Wrapper>
   <video controls playsInline className="w-full rounded-xl" src={src}>
    {finalTrack && <track kind="subtitles" src={finalTrack} label="EN" default />}
   </video>
  </Wrapper>
 );
}
