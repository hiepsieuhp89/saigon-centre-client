/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { ISpinHistoryItem } from "@/api/services/auth.service";
import { useGetSpinHistory } from "@/hooks/useAuth";
import { useConfirmSpin } from "@/hooks/useProduct";
import { fNumberMoney } from "@/utils/format-number";
import { Box, Tab, Tabs } from "@mui/material";
import { Pagination } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaCheckCircle, FaHistory, FaSpinner } from "react-icons/fa";

// Định nghĩa các trạng thái tab
type TabStatus = "all" | "pending" | "success";

export default function HistorySpin() {
  const { mutate: getSpinHistory, isPending: isLoadingSpinHistory } =
    useGetSpinHistory();
  const { mutate: confirmSpin, isPending: isConfirming } = useConfirmSpin();
  const [currentTab, setCurrentTab] = useState<TabStatus>("all");

  const [spinHistoryMeta, setSpinHistoryMeta] = useState({
    page: 1,
    take: 10,
    itemCount: 0,
    pageCount: 1,
  });

  const [spinPagination, setSpinPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [spinHistoryData, setSpinHistoryData] = useState<ISpinHistoryItem[]>(
    []
  );

  const FALLBACK_IMAGE_URL = "images/white-image.png";

  // Load Lịch sử gửi đơn
  const loadSpinHistory = () => {
    getSpinHistory(
      {
        page: spinPagination.current,
        take: spinPagination.pageSize,
        order: "DESC",
      },
      {
        onSuccess: (response) => {
          setSpinHistoryData(response.data);
          setSpinHistoryMeta(response.meta);
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
  }, [spinPagination]);

  // Xử lý thay đổi trang
  const handlePaginationChange = (page: number, pageSize: number) => {
    setSpinPagination({
      current: page,
      pageSize: pageSize,
    });
  };

  // Xử lý thay đổi tab
  const handleTabChange = (_: React.SyntheticEvent, newValue: TabStatus) => {
    setCurrentTab(newValue);
  };

  // Lọc dữ liệu theo tab
  const filteredData = spinHistoryData.filter((item) => {
    switch (currentTab) {
      case "pending":
        return item.isFrozen;
      case "success":
        return !item.isFrozen;
      default:
        return true;
    }
  });

  const handleConfirmSpin = (spinHistoryId: string) => {
    confirmSpin(
      {
        spinHistoryId,
        note: "Xác nhận phần thưởng quay sản phẩm",
      },
      {
        onSuccess: () => {
          // Show success message
          toast.success("Gửi lại thành công!", {
            position: "top-right",
            duration: 3000,
          });
          // Reload the spin history after confirmation
          loadSpinHistory();
        },
        onError: (err) => {
          console.error("Error confirming spin:", err);
          // Show error message
          toast.error("Có lỗi xảy ra. Vui lòng thử lại!", {
            position: "top-right",
            duration: 3000,
          });
        },
      }
    );
  };

  return (
    <div className="flex flex-col min-h-screen pb-[70px]">
      {/* Header with red background */}
      <div className="bg-red-600 p-4 flex flex-col items-center">
        <div className="flex items-center mb-2">
          <FaHistory className="text-white mr-2" />
          <h2 className="text-white text-xl font-bold">Lịch sử gửi đơn</h2>
        </div>
        <p className="text-white text-sm">Xem lịch sử các đơn hàng đã gửi</p>
      </div>

      {/* Tabs */}
      <div className="mx-4 mt-4">
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs 
            value={currentTab} 
            onChange={handleTabChange} 
            textColor="primary"
            indicatorColor="primary"
            variant="fullWidth"
          >
            <Tab 
              label="TOÀN BỘ" 
              value="all" 
              sx={{ 
                fontWeight: currentTab === "all" ? "bold" : "normal",
                color: currentTab === "all" ? "#ef4444" : "inherit"
              }} 
            />
            <Tab 
              label="CHỜ XỬ LÝ" 
              value="pending" 
              sx={{ 
                fontWeight: currentTab === "pending" ? "bold" : "normal",
                color: currentTab === "pending" ? "#ef4444" : "inherit"
              }} 
            />
            <Tab 
              label="HOÀN THÀNH" 
              value="success" 
              sx={{ 
                fontWeight: currentTab === "success" ? "bold" : "normal",
                color: currentTab === "success" ? "#ef4444" : "inherit"
              }} 
            />
          </Tabs>
        </Box>

        {isLoadingSpinHistory ? (
          <div className="flex justify-center items-center py-8">
            <FaSpinner className="animate-spin text-red-600 mr-2" />
            <span className="text-gray-700">Đang tải dữ liệu...</span>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-8 text-gray-700">Không có dữ liệu</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredData.map((item) => (
              <div
                key={item.id}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow bg-white ${
                  item.isSuccess && !item.isFrozen ? 'border-green-600/30' : 'border-yellow-300/30'
                }`}
              >
                <div className="flex items-start gap-4 flex-col sm:flex-row">
                  {/* Logo và thông tin cơ bản */}
                  <div className="flex items-center gap-3 w-full sm:w-auto line-clamp-2 truncate">
                    <div className="relative">
                      <img
                        src={item.product?.imageUrls?.[0] || FALLBACK_IMAGE_URL}
                        alt="SaigonCentre"
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_IMAGE_URL;
                        }}
                      />
                      {!item.isFrozen && item.isSuccess && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                          <FaCheckCircle className="text-white text-xs" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">SaigonCentre</h3>
                      <p className="text-sm text-gray-600">
                        {item.product?.name}
                      </p>
                    </div>
                  </div>

                  {/* Trạng thái */}
                  <div className="flex items-center gap-2 w-full justify-end sm:w-auto sm:ml-auto mt-3 sm:mt-0">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.isFrozen
                          ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                          : item.isSuccess
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-gray-100 text-gray-800 border border-gray-200"
                      }`}
                    >
                      {item.isFrozen ? "Chờ xử lý" : "Thành công"}
                    </span>
                    {item.isFrozen && (
                      <button
                        onClick={() => handleConfirmSpin(item.id)}
                        disabled={isConfirming}
                        className="px-3 py-1 rounded-full text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
                      >
                        {isConfirming ? "Đang gửi..." : "Gửi lại"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Thông tin giao dịch */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Giá trị sản phẩm</p>
                    <p className="text-lg font-semibold text-green-600">
                      {fNumberMoney(Number(item.productPrice))}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Lợi nhuận</p>
                    <p className="text-lg font-semibold text-red-600">
                      {fNumberMoney(Number(item.profit))}
                    </p>
                  </div>
                </div>

                {/* Thời gian */}
                <div className="mt-3 text-sm text-gray-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Phân trang */}
        {filteredData.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              current={spinPagination.current}
              pageSize={spinPagination.pageSize}
              total={spinHistoryMeta.itemCount}
              onChange={handlePaginationChange}
              showSizeChanger
              pageSizeOptions={["5", "10", "20"]}
              className="custom-pagination"
            />
          </div>
        )}
      </div>
    </div>
  );
}
