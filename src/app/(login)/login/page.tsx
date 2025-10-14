
"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import smartLoginImage from "./../../../../public/logo/smartFunding.svg"
import fundingBeeLogo from "./../../../../public/logo/fundingBeeLogo.svg"
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
 Form,
 FormControl,
 FormField,
 FormItem,
 FormLabel,
 FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Footer from "@/components/login/footer";
import useLogin from "@/hooks/useLogin";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const loginSchema = z.object({
 email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
 remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
 const router = useRouter()
 const { mutate: loginNow, isPending } = useLogin()
 const form = useForm<LoginFormValues>({
  resolver: zodResolver(loginSchema),
  defaultValues: {
   email: "",
   remember: false,
  },
 });

 async function onSubmit(values: LoginFormValues) {
  loginNow({ email: values.email, remember: values.remember || false }, {
   onSuccess: ({ ok, data }) => {
    toast.success("Login success, redirecting to OTP")

    if (ok && data?.data.token) {
     sessionStorage.setItem("tempAuthToken", data.data.token);
     router.push(`/verification?email=${encodeURIComponent(values.email)}`);
    }
   }
  })
 }

 return (
  <div className="grid md:grid-cols-12 w-full items-center justify-center">
   {/* Left side */}
   <div className="col-span-5 flex flex-col justify-start items-center">
    <div className="p-0 w-[360px] mb-[32px]">
     <div className="mb-[80px]">
      <Image
       src={fundingBeeLogo}
       alt="fundingbee"
       width={154}
       height={28}
      />
     </div>
     <div className="text-3xl mb-12 font-semibold text-gray-900">Log in</div>
     <p className="text-16 text-muted-foreground text-gray-600">
      Please enter your email to sign in.
     </p>
    </div>

    <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="w-[360px]">
      <FormField
       control={form.control}
       name="email"
       render={({ field }) => (
        <FormItem>
         <FormLabel>Email</FormLabel>
         <FormControl>
          <Input
           placeholder="Enter your email"
           type="email"
           {...field}
          />
         </FormControl>
         <FormMessage />
        </FormItem>
       )}
      />

      <FormField
       control={form.control}
       name="remember"
       render={({ field }) => (
        <FormItem className="flex flex-row items-center space-x-3 justify-start py-24">
         <FormControl>
          <Checkbox
           className="size-16 mt-2"
           checked={field.value}
           onCheckedChange={field.onChange}
          />
         </FormControl>
         <FormLabel className="font-normal">Remember me</FormLabel>
        </FormItem>
       )}
      />

      <Button disabled={isPending} type="submit" className="w-full bg-orange-600 text-white hover:bg-orange-700">
       Sign in
      </Button>
     </form>
    </Form>

    <Footer />
   </div>

   {/* Right side illustration */}
   <div className="p-11 flex flex-col col-span-7 w-full min-h-screen items-center justify-center relative bg-[#0033C6]">
    <h1 className="text-white text-[48px] font-semibold mb-[60px]">Smart Funding for Business <br /> Success</h1>
    <Image src={smartLoginImage} alt="login" width={740} height={525} />
   </div >
  </div >
 );
}
