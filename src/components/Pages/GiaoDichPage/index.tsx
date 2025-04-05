/* eslint-disable react-hooks/exhaustive-deps */
import BannerHomePage from "@/components/ui/BannerHomePage";
import { useUser } from "@/context/useUserContext";
import { useGetProfileData, useGetSpinHistory, useGetTransaction } from "@/hooks/useAuth";
import { fNumberMoney } from "@/utils/format-number";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
// Thêm import cho các component mới
import { ISpinHistoryItem } from "@/api/services/auth.service";
import ConfirmPrizeDialog from "@/components/ui/ConfirmPrizeDialog";
import LuckyWheelDialog from "@/components/ui/LuckyWheelDialog";
import { FaBoxOpen, FaChessKing, FaCoins, FaHeadset, FaPlus, FaSync, FaWallet } from "react-icons/fa";

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
  const [spinHistoryData, setSpinHistoryData] = useState<ISpinHistoryItem[]>([]);
  const { mutate: getSpinHistory, isPending: isLoadingSpinHistory } =
    useGetSpinHistory();


  // Load Lịch sử gửi đơn
  const loadSpinHistory = () => {
    getSpinHistory(
      {
        page: 1,
        take: 9999,
        order: "DESC",
      },
      {
        onSuccess: (response) => {
          setSpinHistoryData(response.data);
        },
        onError: (err) => {
          console.error("Error loading spin history:", err);
          setSpinHistoryData([]);
        },
      }
    );
  };

  useEffect(() => {
    loadSpinHistory();
  }, []);



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

  console.log(spinHistoryData);

  const isFrozen = useMemo(() => {
    return spinHistoryData.find((item) => item.isFrozen && item.isSuccess);
  }, [spinHistoryData]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-100">
      <BannerHomePage />

      <div className="flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md space-y-4 sm:space-y-6">
          {/* Thông báo cấp độ - Hiển thị dựa trên VIP level */}
          <div className="rounded-lg p-3 sm:p-4">
            {isVipUser ? (
              <>
                {isFrozen !== undefined && isFrozen !== null ? (
                  <button
                    onClick={handleOpenLuckyWheel}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium text-sm sm:text-base py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <FaChessKing className="h-16 w-16" />
                    <span>Chúc mừng bạn đã nhận được sản phẩm may mắn hoa hồng cao, bạn cần nạp thêm {fNumberMoney(Number(isFrozen?.productPrice || 0) - Number(profile?.data?.balance ?? 0))} điểm, vui lòng liên hệ CSKH để đổi điểm</span>
                  </button>
                ) : (
                  <button
                    onClick={handleOpenLuckyWheel}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium text-sm sm:text-base py-3 sm:py-4 px-6 sm:px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <FaPlus className="h-5 w-5" />
                    <span>Kết hợp gửi đơn</span>
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 font-semibold text-center text-sm sm:text-base mb-2 sm:mb-3">
                    Vui lòng liên hệ với CSKH để được hỗ trợ
                  </p>
                  <div className="flex justify-center">
                    <button
                      onClick={() => openChat()}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium text-sm sm:text-base py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg transition-colors flex items-center"
                    >
                      <FaHeadset className="mr-2" />
                      CSKH
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Refresh button */}
          <div className="flex justify-end">
            <button
              onClick={handleRefreshData}
              className="flex items-center text-gray-600 hover:text-red-600 transition-colors text-sm"
            >
              <FaSync className="mr-1" />
              Làm mới dữ liệu
            </button>
          </div>

          {/* Thông tin tài khoản */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 transition-all hover:shadow-md border border-gray-100">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <FaWallet className="text-blue-600 h-4 w-4" />
                </div>
                <p className="text-gray-600 text-xs sm:text-sm">Tổng Số điểm khả dụng</p>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-green-600 ml-10">
                {fNumberMoney(data?.balance || 0)}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 transition-all hover:shadow-md border border-gray-100">
              <div className="flex items-center mb-2">
                <div className="bg-green-100 rounded-full p-2 mr-3">
                  <FaCoins className="text-green-600 h-4 w-4" />
                </div>
                <p className="text-gray-600 text-xs sm:text-sm">Tổng điểm hoa hồng</p>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-green-600 ml-10">
                {fNumberMoney(data?.totalProfit || 0)}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 transition-all hover:shadow-md border border-gray-100">
              <div className="flex items-center mb-2">
                <div className="bg-purple-100 rounded-full p-2 mr-3">
                  <FaBoxOpen className="text-purple-600 h-4 w-4" />
                </div>
                <p className="text-gray-600 text-xs sm:text-sm">Sản phẩm đã gửi</p>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-green-600 ml-10">
                {(data?.totalTask?.completed) || 0}/{data?.totalTask?.all || 0}
              </p>
            </div>
          </div>

          {/* Recent transactions */}
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 transition-all hover:shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Sản phẩm mới thêm gần đây</h3>
              <button
                onClick={() => router.push('/lich-su')}
                className="text-red-600 text-sm hover:underline"
              >
                Xem tất cả
              </button>
            </div>

            {spinHistory.slice(0, 3).map((item) => (
              <div key={item.id} className="border-b border-gray-100 py-3 last:border-0">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{item.productName}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">${item.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
