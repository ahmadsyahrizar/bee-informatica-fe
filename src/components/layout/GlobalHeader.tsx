import * as React from "react";
import Image from "next/image";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import fundingBeeLogo from "@/assets/logo/fundingBeeLogo.svg"
import AvatarMenu from "./AvatarMenu";

export const GlobalHeader: React.FC = () => {
 return (
  <header className="flex items-center justify-between w-full border-b border-gray-200 bg-white h-[72px]" >
   <div className="flex items-center">
    <Image src={fundingBeeLogo} alt="Fundingbee" width={120} height={32} />
   </div>
   <div className="flex items-center gap-12">
    {/* <Avatar className="h-40 w-40 cursor-pointer">
     <AvatarImage className="object-cover" width={40} height={40} src="https://placehold.co/600x400" alt="user" />
     <AvatarFallback>U</AvatarFallback>
    </Avatar> */}
    <AvatarMenu />
   </div>
  </header>
 );
};

export default GlobalHeader