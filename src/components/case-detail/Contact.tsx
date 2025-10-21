"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactProps {
 defaultPhone?: string | number;
 defaultEmail?: string | number;
}

export default function ContactInfoCard({ defaultPhone = "", defaultEmail = "" }: ContactProps) {
 const [phone, setPhone] = React.useState<string | number>("");
 const [email, setEmail] = React.useState<string | number>("");

 // Inline edit state  
 const [isEditing, setIsEditing] = React.useState(false);
 const [draftPhone, setDraftPhone] = React.useState(phone);
 const [draftEmail, setDraftEmail] = React.useState(email);

 const beginEdit = () => {
  setDraftPhone(phone);
  setDraftEmail(email);
  setIsEditing(true);
 };

 React.useEffect(() => {
  if (defaultPhone && defaultEmail) {
   setPhone(defaultPhone);
   setEmail(defaultEmail);
  }
 }, [defaultPhone, defaultEmail]);

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
  </div>
 );
}
