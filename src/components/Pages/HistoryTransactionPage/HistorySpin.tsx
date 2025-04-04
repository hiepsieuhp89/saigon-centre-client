/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { ISpinHistoryItem } from "@/api/services/auth.service";
import { useGetSpinHistory } from "@/hooks/useAuth";
import { useConfirmSpin } from "@/hooks/useProduct";
import { fNumberMoney } from "@/utils/format-number";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { Pagination } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

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

  const FALLBACK_IMAGE_URL =
    "images/product-default.webp";

  // Load lịch sử giao dịch
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
    <div className="bg-gray-900 p-4 shadow-sm w-full mb-14 pb-32 flex-1 grow">
      <Typography
        variant="h6"
        component="h2"
        sx={{ mb: 2, fontWeight: "bold", color: "#fff" }}
      >
        Lịch sử giao dịch
      </Typography>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange} textColor="inherit">
          <Tab label="TOÀN BỘ" value="all" sx={{ color: "white" }} />
          <Tab label="CHỜ XỬ LÝ" value="pending" sx={{ color: "white" }} />
          <Tab label="HOÀN THÀNH" value="success" sx={{ color: "white" }} />
        </Tabs>
      </Box>

      {isLoadingSpinHistory ? (
        <div className="text-center py-8 text-white">Đang tải dữ liệu...</div>
      ) : filteredData.length === 0 ? (
        <div className="text-center py-8 text-white">Không có dữ liệu</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredData.map((item) => (
            <div
              key={item.id}
              className={`border rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-800 ${
                item.isSuccess && !item.isFrozen ? 'border-green-600/30 bg-green-900/20' : 'border-yellow-300/30 bg-yellow-900/10'
              }`}
            >
              <div className="flex items-start gap-4 flex-col sm:flex-row">
                {/* Logo và thông tin cơ bản */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <img
                    src={item.product?.imageUrl || FALLBACK_IMAGE_URL}
                    alt="SaigonCentre"
                    className="w-12 h-12 rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_IMAGE_URL;
                    }}
                  />
                  <div>
                    <h3 className="font-medium text-white">SaigonCentre</h3>
                    <p className="text-sm text-gray-300">
                      {item.product?.name}
                    </p>
                  </div>
                </div>

                {/* Trạng thái */}
                <div className="flex items-center gap-2 w-full justify-end sm:w-auto sm:ml-auto mt-3 sm:mt-0">
                  <span
                    className={`px-3 py-1 rounded-sm text-sm font-medium ${
                      item.isFrozen
                        ? "bg-gray-600 text-gray-200"
                        : item.isSuccess
                        ? "bg-green-600 text-white"
                        : "bg-yellow-600 text-white"
                    }`}
                  >
                    {item.isFrozen ? "Chờ xử lý" : "Thành công"}
                  </span>
                  {item.isFrozen && (
                    <button
                      onClick={() => handleConfirmSpin(item.id)}
                      disabled={isConfirming}
                      className="px-3 py-1 rounded-sm text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isConfirming ? "Đang gửi..." : "Gửi lại"}
                    </button>
                  )}
                </div>
              </div>

              {/* Thông tin giao dịch */}
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-300">Giá trị sản phẩm</p>
                  <p className="text-lg font-semibold text-green-400">
                    ${fNumberMoney(Number(item.productPrice))}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-300">Lợi nhuận</p>
                  <p className="text-lg font-semibold text-orange-400">
                    ${fNumberMoney(Number(item.profit))}
                  </p>
                </div>
              </div>

              {/* Thời gian */}
              <div className="mt-3 text-sm text-gray-300">
                Thời gian: {dayjs(item.createdAt).format("DD/MM/YYYY HH:mm:ss")}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Phân trang */}
      <div className="mt-6 flex justify-end">
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
    </div>
  );
}
