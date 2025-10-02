"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";  

export default function ContactInfoCard() {
 const [phone, setPhone] = React.useState("");
 const [email, setEmail] = React.useState("");

 // Inline edit state
 const [isEditing, setIsEditing] = React.useState(false);
 const [draftPhone, setDraftPhone] = React.useState(phone);
 const [draftEmail, setDraftEmail] = React.useState(email);

 const beginEdit = () => {
  setDraftPhone(phone);
  setDraftEmail(email);
  setIsEditing(true);
 };

 // will use later
 // const cancelEdit = (e?: React.MouseEvent) => {
 //  e?.stopPropagation();
 //  setIsEditing(false);
 // };

 // const saveEdit = (e?: React.MouseEvent) => {
 //  e?.stopPropagation();
 //  setPhone(draftPhone);
 //  setEmail(draftEmail);
 //  setIsEditing(false);
 // };

 return (
  <div
   role="button"
   tabIndex={0}
   onClick={() => !isEditing && beginEdit()}
   onKeyDown={(e) => {
    if (!isEditing && (e.key === "Enter" || e.key === " ")) beginEdit();
   }}
   className="flex gap-16 items-center justify-between border border-gray-200 rounded-xl p-16 cursor-pointer bg-gray-50"
  >
   {/* Left: Phone */}
   <div className="flex flex-1 flex-col">
    <Label className="mb-8" htmlFor="contact-phone">Phone Number</Label>
    <Input
     className="bg-white"
     id="contact-phone"
     placeholder="+601234567890"
     value={isEditing ? draftPhone : phone}
     onChange={(e) => isEditing && setDraftPhone(e.target.value)}
     readOnly={!isEditing}
    />
   </div>

   {/* Right: Email */}
   <div className="flex flex-1 flex-col justify-center">
    <Label className="mb-8" htmlFor="contact-email">Email</Label>
    <Input
     className="bg-white"
     id="contact-email"
     placeholder="example@email.com"
     value={isEditing ? draftEmail : email}
     onChange={(e) => isEditing && setDraftEmail(e.target.value)}
     readOnly={!isEditing}
    />
   </div>

   {/* {isEditing && (
    <div className="flex justify-end gap-2 ml-auto">
     <div className="flex gap-2">
      <Button
       className="p-16"
       variant="outline"
       onClick={cancelEdit}
      >
       Cancel
      </Button>
      <Button
       className="p-16 text-white"
       onClick={saveEdit}
      >
       Save
      </Button>
     </div>
    </div>
   )} */}
  </div>
 );
}
