"use client";

import { useUser } from "@/context/useUserContext";
import { useGetProfileData, useGetTransaction } from "@/hooks/useAuth";
import { fNumberMoney } from "@/utils/format-number";
import Link from "next/link";
import { useEffect } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

// Fake data for the chart
const chartData = [
  { name: "T1", thu: 4000, chi: 3000 },
  { name: "T2", thu: 3000, chi: 2500 },
  { name: "T3", thu: 5000, chi: 4500 },
  { name: "T4", thu: 2780, chi: 2000 },
  { name: "T5", thu: 1890, chi: 1700 },
  { name: "T6", thu: 2390, chi: 2100 },
  { name: "T7", thu: 3490, chi: 3000 },
  { name: "T8", thu: 2000, chi: 1800 },
  { name: "T9", thu: 2780, chi: 2500 },
  { name: "T10", thu: 4890, chi: 4000 },
  { name: "T11", thu: 3490, chi: 3200 },
  { name: "T12", thu: 4000, chi: 3500 },
];

export default function ViTienPage() {
  const { setLoadingGlobal } = useUser();
  const { data, isFetching, refetch: refetchTransaction } = useGetTransaction();
  const { profile, refetch: refetchProfile } = useGetProfileData();

  useEffect(() => {
    if (isFetching) {
      setLoadingGlobal(true);
    } else {
      setLoadingGlobal(false);
    }
  }, [isFetching, setLoadingGlobal]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-[70px]">
      {/* Chart area with red background */}
      <div className="bg-red-600 p-4 pb-16">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.2)" />
            <XAxis dataKey="name" tick={{ fill: 'white', fontSize: 10 }} />
            <YAxis tick={{ fill: 'white', fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="thu" fill="#8dd1e1" radius={[3, 3, 0, 0]} />
            <Bar dataKey="chi" fill="#a4a1fb" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Income Analysis Card */}
      <div className="bg-white rounded-lg shadow-md mx-4 -mt-10 p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Phân Tích Thu Nhập</h2>
        
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-2xl font-bold">{fNumberMoney(data?.totalProfit || 0)}</span>
            <div className="bg-purple-100 rounded-full w-16 h-16 flex justify-center items-center">
              <span className="text-red-600 font-bold">Điểm</span>
            </div>
          </div>
          <p className="text-gray-600">Thu Nhập Hoa Hồng</p>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-red-600 h-2 rounded-full" style={{ width: '70%' }}></div>
        </div>
      </div>

      {/* Detailed Information Card */}
      <div className="bg-white rounded-lg shadow-md mx-4 mt-4 p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Thông Tin Chi Tiết Quỹ</h2>
        
        {/* Balance */}
        <div className="flex items-center py-3 border-b">
          <div className="bg-purple-100 rounded-lg w-12 h-12 flex justify-center items-center mr-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold">Số điểm Khả Dụng</h3>
            <p className="text-gray-600 text-lg font-bold">{fNumberMoney(profile?.data?.balance || 0)}</p>
          </div>
        </div>
        
        {/* Deposit Records Button */}
        <Link href="#">
          <div className="flex items-center py-3 border-b cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="bg-purple-100 rounded-lg w-12 h-12 flex justify-center items-center mr-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Hồ Sơ Nạp Tiền</h3>
              <p className="text-gray-600 text-sm">Xem Lịch Sử Nạp Tiền</p>
            </div>
          </div>
        </Link>
        
        {/* Withdraw Button */}
        <Link href="#">
          <div className="flex items-center py-3 border-b cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="bg-purple-100 rounded-lg w-12 h-12 flex justify-center items-center mr-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Rút Tiền</h3>
              <p className="text-gray-600 text-sm">Rút Tiền Về Tài Khoản Ngân Hàng Của Bạn</p>
            </div>
          </div>
        </Link>
        
        {/* Withdrawal History Button */}
        <Link href="#">
          <div className="flex items-center py-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="bg-purple-100 rounded-lg w-12 h-12 flex justify-center items-center mr-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Lịch Sử Rút Tiền</h3>
              <p className="text-gray-600 text-sm">Xem Lịch Sử Rút Tiền</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
} 