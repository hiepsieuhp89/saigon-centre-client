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
  const { user, profile, logout } = useUser();
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [isProfileUpdateOpen, setIsProfileUpdateOpen] = useState(false);

  const handleDeposit = () => {
    toast.custom('Vui lòng liên hệ CSKH để được hướng dẫn nạp tiền');
  };

  console.log(profile);
  return (
    <div className="flex flex-col min-h-screen pb-[70px] bg-gray-50">
      {/* Header with red background */}
      <div className="bg-red-600 p-4 flex flex-col items-center">
        <h2 className="text-white text-xl font-bold mb-2">Thông tin cá nhân</h2>
        <p className="text-white text-lg">{profile?.data?.username || ""}</p>
        <div className="flex items-center mt-1">
          <span className="text-white"> {profile?.data?.vipLevel ? `VIP ${profile?.data?.vipLevel}` : "Chưa có cấp độ vip"}</span>
          {profile?.data?.vipLevel ? <img src="/images/vip-icon.png" alt="VIP" className="w-8 h-8 ml-2" /> : null}
        </div>
      </div>

      {/* QR Code Button */}
      <div className="mx-4 my-4">
        <button className="w-full bg-white border border-blue-300 text-blue-500 py-2 px-4 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          Mã mời
        </button>
      </div>

      {/* Section Title */}
      <div className="mx-4 mb-2">
        <h3 className="text-gray-700 font-semibold">Thiết Lập Cá Nhân</h3>
      </div>

      {/* Menu Card */}
      <div className="bg-white rounded-lg shadow-sm mx-4">
        {/* Order History */}
        <div
          onClick={() => router.push("/lich-su")}
          className="flex items-center p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="bg-purple-100 rounded-lg w-10 h-10 flex justify-center items-center mr-4">
            <FaFolder className="text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Hồ Sơ Đặt Hàng</h3>
            <p className="text-gray-500 text-sm">Xem Lịch Sử Đặt Hàng</p>
          </div>
        </div>

        {/* Notifications */}
        <div
          onClick={() => setIsLiveChatOpen(true)}
          className="flex items-center p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="bg-purple-100 rounded-lg w-10 h-10 flex justify-center items-center mr-4">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Thông Báo Tin Nhắn</h3>
            <p className="text-gray-500 text-sm">Xem Tin Nhắn Hệ Thống</p>
          </div>
        </div>

        {/* Bank Account */}
        <div
          onClick={() => router.push("/ngan-hang")}
          className="flex items-center p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="bg-purple-100 rounded-lg w-10 h-10 flex justify-center items-center mr-4">
            <FaCreditCard className="text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Tài Khoản Ngân Hàng</h3>
            <p className="text-gray-500 text-sm">Sửa Thông Tin Tài Khoản</p>
          </div>
        </div>

        {/* Address */}
        <div
          onClick={() => setIsProfileUpdateOpen(true)}
          className="flex items-center p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="bg-purple-100 rounded-lg w-10 h-10 flex justify-center items-center mr-4">
            <FaMapMarkerAlt className="text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Địa Chỉ Nhận Hàng</h3>
            <p className="text-gray-500 text-sm">Sửa Thông Tin Địa Chỉ</p>
          </div>
        </div>

        {/* Logout */}
        <div
          onClick={logout}
          className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="bg-red-100 rounded-lg w-10 h-10 flex justify-center items-center mr-4">
            <FaSignOutAlt className="text-red-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-500">Đăng Xuất</h3>
            <p className="text-gray-500 text-sm">Thoát Khỏi Hệ Thống</p>
          </div>
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
