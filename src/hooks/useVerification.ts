import { useEffect, useRef, useState } from "react";
const CODE_LENGTH = 6;

const useVerification = () => {
 const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
 const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
 const [error, setError] = useState<string | null>(null);
 const [isVerifying, setIsVerifying] = useState(false);

 const [resendCooldown, setResendCooldown] = useState<number>(30);
 const [canResend, setCanResend] = useState(false);

 useEffect(() => {
  // start cooldown on mount (simulate code already sent)
  setCanResend(false);
  setResendCooldown(30);
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
  return () => clearInterval(timer);
 }, []);

 useEffect(() => {
  const firstEmpty = digits.findIndex((d) => d === "");
  const targetIdx = firstEmpty === -1 ? CODE_LENGTH - 1 : firstEmpty;
  inputRefs.current[targetIdx]?.focus();
 }, []);

 return {
  setDigits,
  setError,
  setIsVerifying,
  setCanResend,
  setResendCooldown,
  isVerifying,
  error,
  resendCooldown,
  canResend,
  digits,
  inputRefs,
  codeLength: CODE_LENGTH
 }

}


export default useVerification