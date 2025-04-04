/* eslint-disable react-hooks/exhaustive-deps */
import BannerHomePage from "@/components/ui/BannerHomePage";
import InvestmentLevels from "@/components/ui/ThuongDaiLy";
import { useUser } from "@/context/useUserContext";
import { useGetProfileData, useGetTransaction } from "@/hooks/useAuth";
import { fNumberMoney, formatNumber } from "@/utils/format-number";
import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// Thêm import cho các component mới
import ConfirmPrizeDialog from "@/components/ui/ConfirmPrizeDialog";
import LuckyWheelDialog from "@/components/ui/LuckyWheelDialog";

// Add this after luckyWheelItems constant
const spinHistory = [
  {
    id: 1,
    productName: "iPhone 15 Pro",
    price: 999,
    status: "pending",
    date: "2024-03-20 15:30:22",
  },
  {
    id: 2,
    productName: "MacBook Pro",
    price: 1999,
    status: "confirmed",
    date: "2024-03-19 12:45:10",
  },
  {
    id: 3,
    productName: "Apple Watch",
    price: 399,
    status: "frozen",
    date: "2024-03-18 09:15:33",
  },
  {
    id: 4,
    productName: "AirPods",
    price: 199,
    status: "insufficient_balance",
    date: "2024-03-17 16:20:45",
  },
  {
    id: 5,
    productName: "iPad Pro",
    price: 799,
    status: "cancelled",
    date: "2024-03-16 11:05:18",
  },
];

export default function GiaoDichPage() {
  const { setLoadingGlobal } = useUser();
  const { data, isFetching, refetch: refetchTransaction } = useGetTransaction();
  const { profile, refetch: refetchProfile } = useGetProfileData();
  const router = useRouter();
  const [openLuckyWheel, setOpenLuckyWheel] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [spinResult, setSpinResult] = useState(null);

  // Kiểm tra VIP level của người dùng
  const vipLevel = profile?.data?.vipLevel || 0;
  const isVipUser = vipLevel >= 1;

  useEffect(() => {
    if (isFetching) {
      setLoadingGlobal(true);
    } else {
      setLoadingGlobal(false);
    }
  }, [isFetching]);

  const handleOpenLuckyWheel = () => {
    setOpenLuckyWheel(true);
  };

  const handleCloseLuckyWheel = () => {
    setOpenLuckyWheel(false);
    setWinnerIndex(null);
    setSpinResult(null);
  };

  const handleConfirmPrize = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirmDialog(false);
    handleCloseLuckyWheel();
  };

  const handleWinnerSelected = (index: number) => {
    setWinnerIndex(index);
  };

  // Chuyển đến trang chủ để nạp tiền
  const navigateToHomePage = () => {
    router.push("/");
  };

  // Thêm hàm để nhận kết quả quay từ LuckyWheelDialog
  const handleSpinResult = (result: any) => {
    setSpinResult(result);
  };

  const openChat = () => {
    if (window.Tawk_API && window.Tawk_API.maximize) {
      window.Tawk_API.maximize(); // Opens the chat widget
    } else {
      console.log('Tawk.to is not loaded yet.');
    }
  };

  // Thêm hàm refresh data
  const handleRefreshData = async () => {
    setLoadingGlobal(true);
    try {
      await Promise.all([
        refetchTransaction(),
        refetchProfile()
      ]);
    } finally {
      setLoadingGlobal(false);
    }
  };

  
  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      <BannerHomePage />

      <div className="flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md space-y-4 sm:space-y-6">
          {/* Thông báo cấp độ - Hiển thị dựa trên VIP level */}
          <div
            className={`${
              isVipUser
                ? "bg-blue-50 border border-blue-200"
                : "bg-red-50 border border-red-200"
            } rounded-lg p-3 sm:p-4`}
          >
            {isVipUser ? (
              <>
                <div className="flex justify-center">
                  <button
                    onClick={handleOpenLuckyWheel}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium text-sm sm:text-base py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg transition-colors"
                  >
                    Tìm kiếm sản phẩm
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-red-600 font-semibold text-center text-sm sm:text-base mb-2 sm:mb-3">
                  Vui lòng liên hệ với CSKH 
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => openChat()}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium text-sm sm:text-base py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg transition-colors"
                  >
                    CSKH
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Thông tin tài khoản */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 transition-all hover:shadow-md">
              <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">Tổng số dư khả dụng</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">
                ${fNumberMoney(data?.balance || 0)}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 transition-all hover:shadow-md">
              <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">
                Tổng lợi nhuận
              </p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">
                ${fNumberMoney(data?.totalProfit || 0)}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 transition-all hover:shadow-md">
              <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">Tiến độ công việc</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">
                {(data?.totalTask?.completed+1) || 0}/{data?.totalTask?.all || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

<div className="flex justify-center h-24">
</div>

      {/* Đổi tên biến để phản ánh đúng chức năng */}
      <LuckyWheelDialog
        open={openLuckyWheel}
        onClose={handleCloseLuckyWheel}
        onConfirmPrize={handleConfirmPrize}
        onWinnerSelected={handleWinnerSelected}
        onSpinResult={handleSpinResult}
        key={openLuckyWheel ? 'open' : 'closed'}
      />

      <ConfirmPrizeDialog
        open={openConfirmDialog}
        onClose={handleCloseConfirm}
        winnerIndex={winnerIndex}
        spinResult={spinResult}
      />
    </div>
  );
}
