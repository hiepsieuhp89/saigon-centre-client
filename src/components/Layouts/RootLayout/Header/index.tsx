"use client"

import { useUser } from "@/context/useUserContext";
import { fNumberMoney } from "@/utils/format-number";
import { Avatar, Button } from "antd";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";

export default function HeaderRootLayout() {
  const router = useRouter();
  const { user } = useUser();

  return (
    <div className="bg-[#0a192f] shadow-md p-4 flex items-center justify-between h-[74px]">
      {/* Logo on the left */}
      <div 
        className="flex items-center cursor-pointer" 
        onClick={() => router.push("/")}
      >
        <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          SaiGon Centre
        </h1>
      </div>

      {/* User info or login button on the right */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-2">
            <Avatar
              onClick={() => router.push("/tai-khoan")}
              className="cursor-pointer"
              size={45}
              icon={<FaUser className="text-[20px]" />}
            />
            <span className="text-white">{user?.fullName || ""}</span>
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
