"use client"

import { useUser } from "@/context/useUserContext";
import { fNumberMoney } from "@/utils/format-number";
import { Avatar, Button } from "antd";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import Image from "next/image";

export default function HeaderRootLayout() {
  const router = useRouter();
  const { user } = useUser();

  return (
    <div className="bg-white shadow-md p-4 flex items-center justify-between h-[74px]">
      {/* Logo on the left */}
      <div 
        className="flex items-center cursor-pointer" 
        onClick={() => router.push("/")}
      >
        <Image
          src="/images/logo.png" // Update this path to your actual logo file
          alt="SaiGon Centre Logo"
          width={150}
          height={40}
          className="object-contain"
        />
      </div>

      {/* User info or login button on the right */}
      <div className="flex items-center gap-4 max-w-28 truncate line-clamp-22 md:max-w-52">
        {user ? (
          <div className="flex items-center gap-2">
            <Avatar
              onClick={() => router.push("/tai-khoan")}
              className="cursor-pointer"
              size={45}
              icon={<FaUser className="text-[20px]" />}
            />
            <span className="text-black">{user?.fullName || ""}</span>
          </div>
        ) : (
          <Button 
            type="primary" 
            onClick={() => router.push("/dang-nhap")} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            Đăng nhập
          </Button>
        )}
      </div>
    </div>
  );
}
