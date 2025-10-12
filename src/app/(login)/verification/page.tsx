"use client";

import React from "react";
import Image from "next/image";
import fundingBeeLogo from "./../../../../public/logo/fundingBeeLogo.svg";
import { Button } from "@/components/ui/button";
import Footer from "@/components/login/footer";
import useVerification from "@/hooks/useVerification";
import { useRouter } from "next/navigation";

const email = 'rija.sr@gmail.com'

export default function VerifyEmailPage() {
 const router = useRouter();
 const {
  setError,
  setIsVerifying,
  setDigits,
  setCanResend,
  setResendCooldown,
  inputRefs,
  codeLength: CODE_LENGTH,
  digits,
  canResend,
  error,
  isVerifying,
  resendCooldown
 } = useVerification()

 const handleBack = () => {
  router.back();
 }

 const handleChange = (idx: number, value: string) => {
  setError(null);
  const onlyDigit = value.replace(/[^0-9]/g, "");
  if (!onlyDigit) {
   setDigits((prev) => {
    const copy = [...prev];
    copy[idx] = "";
    return copy;
   });
   return;
  }

  if (onlyDigit.length === 1) {
   setDigits((prev) => {
    const copy = [...prev];
    copy[idx] = onlyDigit;
    return copy;
   });
   const next = idx + 1;
   if (next < CODE_LENGTH) inputRefs.current[next]?.focus();
   return;
  }

  const toFill = onlyDigit.split("").slice(0, CODE_LENGTH - idx);
  setDigits((prev) => {
   const copy = [...prev];
   for (let i = 0; i < toFill.length; i++) {
    copy[idx + i] = toFill[i];
   }
   return copy;
  });
  const last = Math.min(CODE_LENGTH - 1, idx + toFill.length - 1);
  inputRefs.current[last]?.focus();
 }

 const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
  setError(null);
  const key = e.key;
  if (key === "Backspace") {
   if (digits[idx] === "") {
    const prev = idx - 1;
    if (prev >= 0) {
     setDigits((p) => {
      const copy = [...p];
      copy[prev] = "";
      return copy;
     });
     inputRefs.current[prev]?.focus();
    }
   } else {
    // clear current
    setDigits((p) => {
     const copy = [...p];
     copy[idx] = "";
     return copy;
    });
   }
   e.preventDefault();
  } else if (key === "ArrowLeft") {
   const prev = idx - 1;
   if (prev >= 0) inputRefs.current[prev]?.focus();
   e.preventDefault();
  } else if (key === "ArrowRight") {
   const next = idx + 1;
   if (next < CODE_LENGTH) inputRefs.current[next]?.focus();
   e.preventDefault();
  } else if (/^[0-9]$/.test(key)) {
  } else if (key === "Tab") {
  } else {
   e.preventDefault();
  }
 }

 const onVerified = () => {
  console.log("on verified")
 }

 const handleVerify = async (e?: React.FormEvent) => {
  e?.preventDefault();
  setError(null);
  const code = digits.join("");
  if (code.length < CODE_LENGTH || digits.some((d) => d === "")) {
   setError("Please enter the full verification code.");
   return;
  }

  setIsVerifying(true);
  try {
   // TODO: replace with real API call
   await new Promise((r) => setTimeout(r, 700));

   const correct = "482914";
   if (code !== correct) {
    setError("The code you entered is incorrect. Please try again.");
    inputRefs.current[0]?.focus();
   } else {
    onVerified();
   }
  } catch (err) {
   setError("Something went wrong. Please try again.");
  } finally {
   setIsVerifying(false);
  }
 }

 const handleResend = () => {
  if (!canResend) return;
  setCanResend(false);
  setResendCooldown(30);
  setError(null);

  // start cooldown
  const timer = setInterval(() => {
   setResendCooldown((t) => {
    if (t <= 1) {
     clearInterval(timer);
     setCanResend(true);
     return 0;
    }
    return t - 1;
   });
  }, 1000);

  // TODO: call resend API here    
  console.log("Resend code requested for", email);
 }

 const inputBaseClass =
  "w-[64px] h-[64px] text-2xl font-medium text-center rounded-md border-[2px] outline-none focus:shadow-sm transition";
 const errorClass = error ? "border-red-400" : "border-orange-500";
 const filledClass = "bg-white";

 return (
  <div className="min-h-screen flex items-center justify-center p-6">
   <div className="w-full max-w-[420px]">
    <div className="flex justify-center mb-[80px]">
     <Image src={fundingBeeLogo} alt="fundingbee" width={154} height={28} />
    </div>

    <h2 className="text-3xl font-semibold text-slate-900 text-center mb-2">Verify your email</h2>
    <p className="text-sm text-slate-600 text-center mb-6">
     We&apos;ve sent your verification link to <span className="font-medium">{email}</span>
    </p>

    <form onSubmit={handleVerify} className="mt-[32px] flex flex-col items-center">
     <div className="flex items-center gap-3 mb-[32px]">
      {digits.map((d, idx) => (
       <React.Fragment key={idx}>
        <input
         aria-label={`Digit ${idx + 1}`}
         inputMode="numeric"
         maxLength={6} // allow paste longer but we handle distribution
         value={d}
         ref={(el) => (inputRefs.current[idx] = el)}
         onPaste={(ev) => {
          ev.preventDefault();
          const pasted = (ev.clipboardData || (window as any).clipboardData).getData("text");
          const onlyNums = pasted.replace(/[^0-9]/g, "");
          if (!onlyNums) return;
          // distribute across inputs starting at idx
          setDigits((prev) => {
           const copy = [...prev];
           for (let i = 0; i < onlyNums.length && idx + i < CODE_LENGTH; i++) {
            copy[idx + i] = onlyNums[i];
           }
           return copy;
          });
          const last = Math.min(CODE_LENGTH - 1, idx + onlyNums.length - 1);
          inputRefs.current[last]?.focus();
         }}
         onChange={(ev) => handleChange(idx, ev.target.value)}
         onKeyDown={(ev) => handleKeyDown(ev, idx)}
         className={`${inputBaseClass} ${errorClass} ${filledClass}`}
        />
        {/* Add hyphen between 3rd and 4th */}
        {idx === 2 && <div className="text-xl font-semibold text-slate-500 -ml-2 mr-2">-</div>}
       </React.Fragment>
      ))}
     </div>

     {error && <div className="text-sm text-red-500 mb-3">{error}</div>}

     <div className="w-full max-w-[360px]">
      <Button
       type="submit"
       className="w-full bg-orange-600 hover:bg-orange-700 text-white"
       disabled={isVerifying}
      >
       {isVerifying ? "Verifying..." : "Verify code"}
      </Button>
     </div>

     <div className="mt-[32px] text-sm text-slate-600">
      Didn’t receive the email?{" "}
      <button
       type="button"
       onClick={handleResend}
       disabled={!canResend}
       className={`underline ml-1 ${canResend ? "text-orange-600 hover:text-orange-700" : "text-slate-400 cursor-default"}`}
      >
       {canResend ? "Resend code" : `Resend in ${resendCooldown}s`}
      </button>
     </div>

     <div className="mt-[32px] text-sm">
      <button
       type="button"
       onClick={handleBack}
       className="flex items-center text-slate-600 hover:text-slate-800"
      >
       ← Back to log in
      </button>
     </div>
     <Footer />
    </form>
   </div>
  </div>
 );
}
