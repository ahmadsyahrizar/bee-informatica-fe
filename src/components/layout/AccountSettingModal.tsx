"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/authContext";
import * as authService from "@/services/Auth";
import * as uploadService from "@/services/UserUpload";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Image as ImageIcon, Trash2 } from "lucide-react";
import CropModal from "./CropModal";
import { useSession } from "next-auth/react";

interface Props {
 open: boolean;
 onOpenChange: (v: boolean) => void;
}

const AccountSettingsModal: React.FC<Props> = ({ open, onOpenChange }) => {
 const queryClient = useQueryClient();
 const { user, setUserLocally } = useAuth();
 // @ts-expect-error rija
 const accessToken = useSession().data?.accessToken ?? ""
 const [firstName, setFirstName] = useState(user?.first_name ?? "");
 const [lastName, setLastName] = useState(user?.last_name ?? "");
 const [email, setEmail] = useState(user?.email ?? "");
 const [tempKey, setKey] = useState("");
 const [tempUrl, setUrl] = useState("");
 const [localPreview, setLocalPreview] = useState<string | null>(null);
 const [rawFile, setRawFile] = useState<File | null>(null);
 const [cropOpen, setCropOpen] = useState(false);

 useEffect(() => {
  setFirstName(user?.first_name ?? "");
  setLastName(user?.last_name ?? "");
  setEmail(user?.email ?? "");
 }, [user, open]);

 const updateMutation = useMutation({
  mutationFn: (payload: Partial<authService.User>) => authService.updateUser({ accessToken, body: payload } as any),
  onSuccess(data: any) {
   const updatedUser = (data as any).data ?? data;
   queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
   setUserLocally(updatedUser);
   toast.success("Profile updated");
   onOpenChange(false);
  },
  onError(err: any) {
   toast.error(err?.message || "Failed to update");
  },
 });

 const handleFilePick = (e: React.ChangeEvent<HTMLInputElement>) => {
  const f = e.target.files?.[0];
  if (!f) return;
  setRawFile(f);
  const url = URL.createObjectURL(f);
  setLocalPreview(url);
  setCropOpen(true);
 };

 const handleDeletePhoto = async () => {
  try {
   // Clear local preview / selected file / temp upload values
   setLocalPreview(null);
   setRawFile(null);
   setKey("");
   setUrl("");

   // Update user locally (no API call)
   // Keep other fields intact but set pic to empty string so UI shows fallback
   const updatedUser = {
    ...user,
    pic: "",
   };
   setUserLocally(updatedUser);

   // Invalidate cache so other components that depend on query see immediate change
   queryClient.invalidateQueries({ queryKey: ["auth", "user"] });

   toast.success("Photo removed locally");
  } catch (err: any) {
   toast.error(err?.message || "Failed to delete locally");
  }
 };


 const onCropConfirm = async (blob: Blob) => {
  try {
   const filename = `${Date.now()}-avatar.jpg`;
   const mime = blob.type || "image/jpeg";

   const signed = await uploadService.generateSignedUrl<{ data: uploadService.SignedUrlResult }>({ accessToken, filename, mime } as any);

   const url = (signed as any).data?.url?.url ?? (signed as any).url;
   const key = (signed as any).data?.url?.key ?? (signed as any).key;
   await uploadService.uploadToSignedUrl(url, blob);

   setKey(key)
   setUrl(url)

  } catch (err: any) {
   toast.error(err?.message || "Upload failed");
  }
 };

 return (
  <>
   <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl bg-white p-24">
     <DialogHeader>
      <DialogTitle>Account settings</DialogTitle>
     </DialogHeader>

     <div className="grid gap-4 pt-20">
      <span className="text-14 text-gray-700 font-medium mb-1">Profile Photo</span>

      <div className="flex justify-start items-center gap-10 mb-16">
       <div>
        <Avatar className="h-40 w-40 border border-gray-30">
         {localPreview ? (
          <AvatarImage src={localPreview} />
         ) : user?.pic ? (
          <AvatarImage src={user.pic} />
         ) : (
          <AvatarFallback>{(user?.first_name ?? "U")[0]}</AvatarFallback>
         )}
        </Avatar>
       </div>

       <div className="flex">
        <label htmlFor="avatarInput"
         className="text-brand-500 border border-brand-500 flex gap-1 justify-center items-center px-12 py-8 mr-8 cursor-pointer rounded-md hover:bg-brand-50 hover:border-brand-600">
         <ImageIcon />
         Upload
        </label>

        <input id="avatarInput" type="file" accept="image/*" className="hidden" onChange={handleFilePick} />

        <div className="border border-gray-300 justify-center items-center rounded-md px-12 py-8 cursor-pointer" onClick={handleDeletePhoto}>
         <Trash2 color="#4B5565" />
        </div>
       </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-16">
       <div>
        <label className="text-sm">First Name</label>
        <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
       </div>
       <div>
        <label className="text-sm">Last Name</label>
        <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
       </div>
      </div>

      <div className="mb-16">
       <label className="text-sm">Email</label>
       <Input value={email} readOnly disabled />
      </div>

      <div className="flex justify-end gap-2 mt-16">
       <Button className="p-16" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
       <Button className="p-16 text-white" onClick={() => {
        updateMutation.mutate({ first_name: firstName, last_name: lastName, pic: tempKey } as any)
       }

       } disabled={updateMutation.isPending}>
        {updateMutation.isPending ? "Saving..." : "Save Changes"}
       </Button>
      </div>
     </div>
    </DialogContent>
   </Dialog>

   <CropModal
    open={cropOpen}
    imageSrc={localPreview}
    onClose={() => setCropOpen(false)}
    onCropConfirm={onCropConfirm}
   />
  </>
 );
};

export default AccountSettingsModal;
