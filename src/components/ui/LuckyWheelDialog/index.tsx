import { useGetAvailableSpinProducts, useSpinProduct } from "@/hooks/useAuth";
import { fNumberMoney } from "@/utils/format-number";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  Snackbar,
  Typography,
} from "@mui/material";
import { ArcElement, Chart, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useUser } from "@/context/useUserContext";

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface LuckyWheelDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirmPrize: () => void;
  onWinnerSelected: (index: number) => void;
  onSpinResult?: (result: any) => void;
}

export default function LuckyWheelDialog({
  open,
  onClose,
  onConfirmPrize,
  onWinnerSelected,
  onSpinResult,
}: LuckyWheelDialogProps) {
  const theme = useTheme();
  const { profile } = useUser();
  const [spinning, setSpinning] = useState(false);
  const [countdown, setCountdown] = useState<number>(5);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [randomRotation, setRandomRotation] = useState<number>(0);
  const [winningAmount, setWinningAmount] = useState<number>(0);
  const chartRef = useRef<Chart<
    "doughnut",
    (number | [number, number] | any | any | any)[],
    unknown
  > | null>(null);
  const [isStarted, setIsStarted] = useState(false);

  // Thêm state cho toast
  const [openToast, setOpenToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  // Thêm state cho thông tin spin
  const [spinInfo, setSpinInfo] = useState<{
    profit: number;
    newBalance: number;
    totalSpins: number;
    isFrozen: boolean;
  } | null>(null);

  // Sử dụng hooks để lấy dữ liệu và thực hiện spin
  const { spinProducts, isLoading: isLoadingProducts } =
    useGetAvailableSpinProducts();
  const {
    mutate: spin,
    data: spinResult,
    isPending: isSpinning,
    reset: resetSpinMutation,
  } = useSpinProduct();

  // Màu sắc cho các phần của vòng quay
  const wheelColors = [
    "#FF5252",
    "#FF4081",
    "#E040FB",
    "#7C4DFF",
    "#536DFE",
    "#448AFF",
    "#40C4FF",
    "#18FFFF",
  ];

  // Reset tất cả trạng thái
  const resetAllStates = () => {
    setCountdown(5);
    setWinnerIndex(null);
    setSpinning(false);
    setIsStarted(false);
    setSpinInfo(null);
    setOpenToast(false);
    resetSpinMutation();

    // Reset giá trị ngẫu nhiên
    let value = Math.random() * 20000;
    setWinningAmount(parseFloat(value.toString()));

    // Reset rotation
    setRandomRotation(0);
    if (chartRef.current) {
      chartRef.current.update();
    }
  };

  // Reset khi dialog mở
  useEffect(() => {
    if (open) {
      resetAllStates();
    }
  }, [open]);

  // Xử lý kết quả spin khi có dữ liệu trả về
  useEffect(() => {
    if (spinResult && spinResult.data && spinResult.data.data) {
      const { product, profit, newBalance, totalSpins, isFrozen, vipLevelUpgrade } =
        spinResult.data.data;

      // Cập nhật thông tin spin
      setSpinInfo({
        profit,
        newBalance,
        totalSpins,
        isFrozen,
      });

      // Tìm index của sản phẩm trúng trong danh sách
      const index = spinProducts ? spinProducts.findIndex((item) => item.id === product.id) : -1;

      // Set winning product info regardless of whether it's in spinProducts
      setWinnerIndex(0); // Use 0 as default index for display purposes
      onWinnerSelected(0);
      setWinningAmount(parseFloat(product.price.toString()));

      // Hiển thị toast thông báo
      setToastMessage(
        vipLevelUpgrade
          ? "Chúc mừng bạn đã tìm được sản phẩm cao cấp, gửi sản phẩm này để nâng cấp đại lý của bạn!"
          : "Kết hợp gửi đơn thành công!"
      );
      setToastSeverity(vipLevelUpgrade ? "info" : "success");
      setOpenToast(true);

      // Gửi kết quả quay lên component cha
      if (onSpinResult) {
        onSpinResult(spinResult.data.data);
      }
    }
  }, [spinResult, spinProducts, onWinnerSelected, onSpinResult]);

  const handleStartSpin = () => {
    setIsStarted(true);
  };

  function rotateWheel() {
    const chart = chartRef.current;
    if (chart) {
      const randomRotation = Math.random() * 3333;
      setRandomRotation(randomRotation);
      chart.update();
    }
  }

  useEffect(() => {
    if (!open || !isStarted) return;

    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setSpinning(true);
      rotateWheel();

      // Gọi API spin thay vì random
      spin();
      setIsStarted(false)
    }
  }, [countdown, open, isStarted, spin]);

  // Xử lý đóng toast
  const handleCloseToast = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenToast(false);
  };

  // Xử lý đóng dialog
  const handleClose = () => {
    resetAllStates();
    onClose();
  };

  // Kiểm tra nếu không có dữ liệu sản phẩm
  if (!isLoadingProducts && (!spinProducts || spinProducts.length === 0)) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm">
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            Không có sản phẩm nào khả dụng để tìm kiếm. Vui lòng thử lại sau.
          </Alert>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" onClick={handleClose}>Đóng</Button>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  // Data for the Doughnut chart - chỉ tạo khi có dữ liệu
  // const chartData = spinProducts ? {
  //   datasets: [
  //     {
  //       data: spinProducts.map(() => 1), // Equal segments
  //       backgroundColor: spinProducts.map(
  //         (_, index) => wheelColors[index % wheelColors.length]
  //       ),
  //       borderColor: spinProducts.map(() => "white"),
  //       borderWidth: 2,
  //       cutout: "67%", // Adjusted for a larger gap
  //       rotation: randomRotation,
  //     },
  //   ],
  //   labels: spinProducts.map((item) => item.name),
  //   hoverOffset: 3,
  // } : null;

  const circleSize = 200; // Size of the countdown circle
  const circleRadius = circleSize / 2;
  const circumference = 2 * Math.PI * circleRadius; // Circumference of the circle
  const progress = ((5 - countdown) / 5) * circumference; // Progress based on countdown

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent
          sx={{ padding: 4, textAlign: "center", bgcolor: "#1a1a1a" }}
        >
          <Typography
            variant="h4"
            component="h2"
            sx={{ mb: 3, fontWeight: "bold", color: "#fff", fontSize: { xs: "1.5rem", sm: "2rem", md: "2.25rem" } }}
          >
            Kết hợp gửi đơn
          </Typography>

          {/* Hiển thị tổng số sản phẩm có sẵn */}
          {!isLoadingProducts && spinProducts && (
            <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
              <Chip
                label={`Có ${spinProducts.length} sản phẩm khả dụng`}
                color="primary"
                sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" }, fontWeight: "medium" }}
              />
            </Box>
          )}

          {isLoadingProducts ? (
            <Box sx={{ display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", my: { xs: 5, sm: 8, md: 10 } }}>
              <CircularProgress
                color="primary"
                size={40}
                sx={{
                  [theme.breakpoints.up('sm')]: {
                    width: 50,
                    height: 50
                  },
                  [theme.breakpoints.up('md')]: {
                    width: 60,
                    height: 60
                  },
                  color: (theme) => theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
                  animationDuration: '1.2s',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    border: '4px solid transparent',
                    borderTopColor: '#f3f3f3',
                    animation: 'spin 2s linear infinite'
                  }
                }}
              />
              <Typography
                variant="body1"
                sx={{
                  mt: 2,
                  color: '#f3f3f3',
                  fontWeight: 'medium',
                  animation: 'pulse 1.5s infinite ease-in-out',
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Đang tải sản phẩm...
              </Typography>
            </Box>
          ) : !spinProducts || spinProducts.length === 0 ? (
            <Alert severity="error" sx={{ my: { xs: 3, sm: 4, md: 5 } }}>
              Không có sản phẩm nào khả dụng. Vui lòng thử lại sau.
            </Alert>
          ) : (
            <div className="relative w-full max-w-[300px] h-[300px] sm:max-w-[340px] sm:h-[340px] md:max-w-[410px] md:h-[410px] flex items-center justify-center p-2 sm:p-4 mx-auto">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-white w-full flex items-center justify-center">
                {countdown > 0 && isStarted ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="text-base sm:text-xl text-yellow-400">
                      Đang tìm kiếm... {countdown}s
                    </div>
                  </div>
                ) : winnerIndex !== null && spinResult?.data?.data ? (
                  <div className="flex flex-col items-center space-y-2 bg-gray-800 p-3 sm:p-4 rounded-lg w-full max-w-[260px] sm:max-w-[280px] md:max-w-[300px]">
                    <div className="text-xl sm:text-2xl font-bold text-green-400">
                      {fNumberMoney(winningAmount)}
                    </div>
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2">
                      <img
                        src={spinResult.data.data.product.imageUrls?.[0]}
                        alt={spinResult.data.data.product.name}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "images/white-image.png";
                        }}
                      />
                    </div>
                    <div className="text-base sm:text-xl font-bold text-yellow-400 line-clamp-2 truncate w-full line-clamp-1">
                      {spinResult.data.data.product.name}
                    </div>

                    {/* Hiển thị thông tin sản phẩm */}
                    {spinInfo && (
                      <div className="mt-1 sm:mt-2 space-y-1 text-xs sm:text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-300">Lợi nhuận dự kiến:</span>
                          <span className="text-green-400">
                            {fNumberMoney(spinInfo.profit)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">
                            Số điểm sau giao dịch:
                          </span>
                          <span className="text-green-400">
                            {fNumberMoney(spinInfo.newBalance)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-300">
                            Tổng giao dịch:
                          </span>
                          <span className="text-blue-400">
                            {spinInfo.totalSpins}
                          </span>
                        </div>
                        {spinInfo.isFrozen && (
                          <div className="text-amber-400 text-xs mt-1 font-semibold bg-gray-900 p-1.5 rounded-md shadow-inner">
                            ✨ Chúc mừng bạn nhận được đơn hàng may mắn hoa hồng cao! Bạn thiếu {(profile?.data?.balance || 0) - (spinInfo.newBalance || 0)} điểm, vui lòng liên hệ CSKH để đổi điểm
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      onClick={onConfirmPrize}
                      className="mt-3 sm:mt-4 bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-bold transition-colors text-sm sm:text-base"
                    >
                      Xác nhận
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2">
                    {!isStarted ? (
                      <button
                        onClick={handleStartSpin}
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-5 py-2.5 rounded-full font-bold hover:from-yellow-500 hover:to-yellow-700 transform hover:scale-105 transition-all text-base"
                        disabled={isSpinning}
                      >
                        {isSpinning ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          "Gửi đơn ngay!"
                        )}
                      </button>
                    ) : (
                      <div className="text-base sm:text-xl font-bold text-yellow-400 animate-pulse">
                        Đang tìm kiếm...
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="relative w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] md:w-[368px] md:h-[368px] p-2 sm:p-4">
                <svg
                  className="absolute top-0 left-0 w-full h-full pointer-events-none -rotate-90"
                  viewBox={`0 0 ${circleSize + 11} ${circleSize + 11}`}
                >
                  <circle
                    className="fill-none stroke-gray-500"
                    cx="50%"
                    cy="50%"
                    r={circleRadius}
                    strokeWidth="2"
                  />
                  <circle
                    className="fill-none stroke-white transition-all duration-1000"
                    cx="50%"
                    cy="50%"
                    r={circleRadius}
                    strokeWidth="2"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - progress}
                  />
                </svg>
              </div>
            </div>
          )}

          <Box
            sx={{ mt: { xs: 2, sm: 3 }, display: "flex", justifyContent: "center", gap: 2 }}
          >
            {/* Only show the close button when no product has been selected */}
            {winnerIndex === null && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleClose}
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  padding: { xs: "6px 16px", sm: "8px 24px" },
                  borderRadius: "8px",
                }}
              >
                Đóng
              </Button>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Toast thông báo */}
      <Snackbar
        open={openToast}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toastSeverity}
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
