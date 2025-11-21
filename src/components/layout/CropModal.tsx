"use client";
import React, { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getCroppedImg } from "@/lib/utils/crop"; // helper below
import { toast } from "sonner";

interface Props {
 open: boolean;
 imageSrc: string | null;
 onClose: () => void;
 onCropConfirm: (blob: Blob) => Promise<void>;
}

const CropModal: React.FC<Props> = ({ open, imageSrc, onClose, onCropConfirm }) => {
 const [zoom, setZoom] = useState(1);
 const [crop, setCrop] = useState({ x: 0, y: 0 });
 const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
 const [loading, setLoading] = useState(false);

 const onCropComplete = useCallback((_: any, croppedAreaPixelsLocal: any) => {
  setCroppedAreaPixels(croppedAreaPixelsLocal);
 }, []);

 const handleCrop = async () => {
  if (!imageSrc || !croppedAreaPixels) return;
  try {
   setLoading(true);
   const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
   await onCropConfirm(blob);
   setLoading(false);
   onClose();
  } catch (err: any) {
   setLoading(false);
   toast.error(err?.message || "Crop failed");
  }
 };

 return (
  <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
   <DialogContent className="max-w-md bg-white p-24" >
    <DialogHeader>
     <DialogTitle>Crop your photo</DialogTitle>
    </DialogHeader>

    <div className="w-full h-[420px] mt-20">
     {imageSrc && (
      <div className="relative h-[320px] bg-gray-50 rounded-lg overflow-hidden">
       <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        aspect={1}
        cropShape="round"
        showGrid={false}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={onCropComplete}
        objectFit="vertical-cover"
       />
       {/* Circular overlay */}
       <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
       >
        <div style={{
         width: 320,
         height: 320,
         borderRadius: "50%",
         boxShadow: "0 0 0 9999px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.6) inset",
        }} />
       </div>
      </div>
     )}

     <div className="mt-4 flex items-center gap-4">
      <button className="p-2" onClick={() => setZoom((z) => Math.max(1, z - 0.1))}>-</button>
      <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))}
       className="
    w-full h-2 appearance-none rounded-lg cursor-pointer bg-gray-300

    bg-gradient-to-r from-brand-500 to-brand-500 
    bg-[length:var(--fill-percent)_100%] bg-no-repeat

    [&::-webkit-slider-thumb]:appearance-none
    [&::-webkit-slider-thumb]:w-[20px]
    [&::-webkit-slider-thumb]:h-[20px]
    [&::-webkit-slider-thumb]:rounded-full
    [&::-webkit-slider-thumb]:bg-brand-500
    [&::-webkit-slider-thumb]:mt-[-4px]
  "
       style={{
        "--fill-percent": `${((zoom - 1) / (3 - 1)) * 100}%`,
       } as React.CSSProperties}
      />
      <button className="p-2" onClick={() => setZoom((z) => Math.min(3, z + 0.1))}>+</button>
     </div>

     <div className="mt-6 flex justify-end gap-2">
      <Button className="p-3" variant="outline" onClick={onClose}>Cancel</Button>
      <Button className="p-3 text-white" onClick={handleCrop} disabled={loading}>{loading ? "Cropping..." : "Crop"}</Button>
     </div>
    </div>
   </DialogContent>
  </Dialog>
 );
};

export default CropModal;
