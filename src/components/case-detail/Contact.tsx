"use client";

import * as React from "react";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ContactInfoCard() {
 const [phone, setPhone] = React.useState("");
 const [email, setEmail] = React.useState("");

 return (
  <Dialog>
   <DialogTrigger asChild>
    <div
     className="flex gap-16 items-center justify-between border border-gray-200 rounded-xl p-16 cursor-pointer bg-gray-50"
    >
     <div className="flex flex-1 flex-col">
      <Label className="mb-8" htmlFor="phone">Phone Number</Label>
      <Input
       className="bg-white"
       id="phone"
       placeholder="+601234567890"
       value={phone}
      />
     </div>
     <div className="flex flex-1 flex-col">
      <Label className="mb-8" htmlFor="email">Email</Label>
      <Input
       className="bg-white"
       id="email"
       placeholder="example@email.com"
       value={email}
      />
     </div>
    </div>
   </DialogTrigger>

   {/* Modal */}
   <DialogContent className="sm:max-w-[425px] p-24 rounded-xl bg-white">
    <DialogHeader>
     <DialogTitle>Contact Information</DialogTitle>
    </DialogHeader>

    <div className="grid gap-4 py-20 ">
     <div className="flex flex-col gap-2 mb-24">
      <Label htmlFor="phone">Phone Number</Label>
      <Input
       id="phone"
       placeholder="+601234567890"
       value={phone}
       onChange={(e) => setPhone(e.target.value)}
      />
     </div>

     <div className="flex flex-col gap-2">
      <Label htmlFor="email">Email</Label>
      <Input
       id="email"
       placeholder="example@email.com"
       value={email}
       onChange={(e) => setEmail(e.target.value)}
      />
     </div>
    </div>

    <div className="flex justify-end gap-2">
     <DialogFooter>
      <DialogClose asChild>
       <Button className="p-24" variant="outline">Cancel</Button>
      </DialogClose>

      <DialogClose asChild>

       <Button
        className="p-24 text-white"
        onClick={() => {

         // For now just close, values already set in state
        }}
       >
        Save
       </Button>
      </DialogClose>
     </DialogFooter>
    </div>
   </DialogContent>
  </Dialog >
 );
}
