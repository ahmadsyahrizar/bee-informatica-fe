"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import UpdateEmailAndPhone from "@/services/UpdateEmailAndPhone";
import { useSession } from "next-auth/react";
import { OverviewPayloadRequest } from "@/types/api/overview.type";
import { useParams } from "next/navigation";
import iconEdit from "../../../public/icons/icon-edit.svg";
import iconApproved from "../../../public/icons/icon-white-approved.svg";
import Image from "next/image";
import { toast } from "sonner";

export type Stage =
  | "phone"
  | "video"
  | "1st_review"
  | "cam_review"
  | "offer"
  | "completed"
  | "rejected"
  | "cancelled";

interface ContactProps {
  defaultPhone?: string | number;
  defaultEmail?: string;
  stage: Stage;
}

export default function ContactInfoCard({
  defaultPhone = "",
  defaultEmail = "",
  stage,
}: ContactProps) {
  // @ts-expect-error rija
  const accessToken = useSession().data?.accessToken || "";
  const { id } = useParams();
  const [phone, setPhone] = useState<string | number>("");
  const [email, setEmail] = useState<string | number>("");

  const { mutate } = useMutation({
    mutationKey: ["updateContactInfo", id],
    mutationFn: (body: OverviewPayloadRequest) =>
      UpdateEmailAndPhone({ accessToken, caseId: id as string, body }),
  });

  const [isEditing, setIsEditing] = useState({
    phone: false,
    email: false,
  });

  const editableStages: Stage[] = ["phone", "video", "1st_review"];
  const isEditable = editableStages.includes(stage);

  const onEdit = (type: "phone" | "email") => {
    if (!isEditable) return; // safeguard
    setIsEditing((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const onUpdate = (type: "phone" | "email") => {
    mutate(
      type === "phone"
        ? { phone_number: Number(phone) }
        : { email: String(email) },
      {
        onSuccess: () => toast.success("Data successfully updated"),
        onError: (err) => toast.error(err.message),
        onSettled: () =>
          setIsEditing({
            phone: false,
            email: false,
          }),
      }
    );
  };

  useEffect(() => {
    if (defaultPhone) setPhone(defaultPhone);
    if (defaultEmail) setEmail(defaultEmail);
  }, [defaultPhone, defaultEmail]);

  return (
    <div className="flex gap-16 items-center justify-between border border-gray-200 rounded-xl p-16 bg-gray-50">
      {/* Left: Phone */}
      <div className="flex flex-1 flex-col">
        <Label className="mb-8" htmlFor="contact-phone">
          Phone Number
        </Label>
        <div className="flex items-center gap-8">
          <Input
            disabled={!isEditing.phone}
            className="bg-white"
            id="contact-phone"
            placeholder="+601234567890"
            value={phone}
            onChange={(e) => setPhone(Number(e.target.value))}
            readOnly={!isEditing.phone}
          />

          {isEditable &&
            (isEditing.phone ? (
              <button
                className="cursor-pointer rounded-md border border-gray-300 p-[8px] bg-[#17B26A]"
                onClick={() => onUpdate("phone")}
              >
                <Image src={iconApproved} alt="save" width={16} height={16} />
              </button>
            ) : (
              <div
                className="cursor-pointer rounded-md border border-gray-300 p-[8px] bg-white"
                onClick={() => onEdit("phone")}
              >
                <Image src={iconEdit} alt="edit" width={16} height={16} />
              </div>
            ))}
        </div>
      </div>

      {/* Right: Email */}
      <div className="flex flex-1 flex-col justify-center">
        <Label className="mb-8" htmlFor="contact-email">
          Email
        </Label>
        <div className="flex items-center gap-8">
          <Input
            disabled={!isEditing.email}
            className="bg-white"
            id="contact-email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            readOnly={!isEditing.email}
          />

          {isEditable &&
            (isEditing.email ? (
              <button
                className="cursor-pointer rounded-md border border-gray-300 p-[8px] bg-[#17B26A]"
                onClick={() => onUpdate("email")}
              >
                <Image src={iconApproved} alt="save" width={16} height={16} />
              </button>
            ) : (
              <div
                className="cursor-pointer rounded-md border border-gray-300 p-[8px] bg-white"
                onClick={() => onEdit("email")}
              >
                <Image src={iconEdit} alt="edit" width={16} height={16} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
