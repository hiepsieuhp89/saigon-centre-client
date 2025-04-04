"use client"

import { useUser } from "@/context/useUserContext";
import { fNumberMoney } from "@/utils/format-number";
import { Avatar } from "antd";
import { useRouter } from "next/navigation";
import { FaUser, FaWallet } from "react-icons/fa";

export default function HeaderRootLayout() {
  const router = useRouter();
  const { user } = useUser();

  return (
    <div className="bg-black p-2 flex items-center justify-between h-[74px]">
      <div className="flex items-center gap-[5px]">
        <div className="flex items-center gap-2">
          <Avatar
            onClick={() => router.push("/tai-khoan")}
            className="cursor-pointer"
            size={50}
            icon={<FaUser className="text-[30px]" />}
          />
          <span className="text-white text-sm">{user?.fullName || ""}</span>
        </div>
        <div className="w-[max-content] min-w-28 h-[55px] rounded-full bg-[#7D7B7F] text-white flex items-center">
          <div className="mx-[10px] flex gap-2 items-center">
            <div>
              <FaWallet className="text-[30px]" />
            </div>
            <div className="flex flex-col">
              <div className="font-bold">{fNumberMoney(user?.balance || 0)}$</div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-yellow-500 font-bold ml-3">
        {user?.vipLevel ? "Đại lý cấp "+ user?.vipLevel : "Chưa có cấp độ"}
      </div>
    </div>
  );
}
