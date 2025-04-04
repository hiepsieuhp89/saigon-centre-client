"use client";

import { LiveChatDialog } from "@/components/LiveChatDialog";
import { ProfileUpdateDialog } from "@/components/ProfileUpdateDialog";
import { WithdrawDialog } from "@/components/WithdrawDialog";
import { useUser } from "@/context/useUserContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FaCloudUploadAlt,
  FaCreditCard,
  FaFolder,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaUserEdit,
  FaMoneyBillWave,
  FaHistory
} from "react-icons/fa";
import toast from 'react-hot-toast';
import SettingWithdrawPassword from "@/components/SettingWithdrawPassword";

export default function AccountOptions() {
  const router = useRouter();
  const { user, logout } = useUser();
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [isProfileUpdateOpen, setIsProfileUpdateOpen] = useState(false);

  const handleDeposit = () => {
    toast.custom('Vui lòng liên hệ CSKH để được hướng dẫn nạp tiền');
  };

  return (
    <div
      // style={{ backgroundImage: 'url(/images/background.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} 
      className="flex justify-center min-h-max flex-1 grow">
      <div className="w-full my-[10px] mx-5">
        {/** Profile Update */}
        <div
          onClick={() => setIsProfileUpdateOpen(true)}
          className="bg-gray-200 cursor-pointer p-4 flex items-center mb-2 rounded-lg hover:bg-gray-300 transition duration-200"
        >
          <FaUserEdit className="text-black mr-4" />
          <span className="text-black">Cập nhật thông tin cá nhân</span>
        </div>

        {/** Bank Account */}
        <div
          onClick={() => router.push("/ngan-hang")}
          className="bg-gray-200 cursor-pointer p-4 flex items-center mb-2 rounded-lg hover:bg-gray-300 transition duration-200"
        >
          <FaCreditCard className="text-black mr-4" />
          <span className="text-black">Tài khoản ngân hàng</span>
        </div>

        {/** Deposit */}
        {/* <div
          onClick={handleDeposit}
          className="bg-gray-200 cursor-pointer p-4 flex items-center mb-2 rounded-lg"
        >
          <FaMoneyBillWave className="text-black mr-4" />
          <span className="text-black">Nạp tiền</span>
        </div> */}

        {/** Withdrawal Password */}
        <div
          onClick={() => user?.isHaveWithdrawPassword ? setIsWithdrawOpen(true) : setIsWithdrawOpen(true)}
          className="bg-gray-200 cursor-pointer p-4 flex items-center mb-2 rounded-lg hover:bg-gray-300 transition duration-200"
        >
          <FaCloudUploadAlt className="text-black mr-4" />
          <span className="text-black">Rút tiền</span>
        </div>

        {/** History */}
        <div
          onClick={() => router.push("/lich-su")}
          className="bg-gray-200 cursor-pointer p-4 flex items-center mb-2 rounded-lg hover:bg-gray-300 transition duration-200"
        >
          <FaHistory className="text-black mr-4" />
          <span className="text-black">Lịch sử gửi đơn</span>
        </div>

        {/** Logout */}
        <div
          onClick={logout}
          className="bg-gray-200 cursor-pointer p-4 flex items-center rounded-lg hover:bg-gray-300 transition duration-200"
        >
          <FaSignOutAlt className="text-red-600 mr-4" />
          <span className="text-red-600">Đăng xuất</span>
        </div>
      </div>

      <WithdrawDialog
        open={isWithdrawOpen}
        onClose={() => {
          setIsWithdrawOpen(false);
        }}
        user={user}
      />

      <LiveChatDialog
        open={isLiveChatOpen}
        onClose={() => {
          setIsLiveChatOpen(false);
        }}
        user={user}
      />

      <ProfileUpdateDialog
        open={isProfileUpdateOpen}
        onClose={() => {
          setIsProfileUpdateOpen(false);
        }}
        user={user}
      />


    </div>
  );
}
