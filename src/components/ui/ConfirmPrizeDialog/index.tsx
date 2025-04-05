import { useGetAvailableSpinProducts, useGetTransaction } from "@/hooks/useAuth";
import { fNumberMoney } from "@/utils/format-number";
import { Alert, Button, CircularProgress, Dialog, DialogContent, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ConfirmPrizeDialogProps {
  open: boolean;
  onClose: () => void;
  winnerIndex: number | null;
  spinResult?: any; // Prop để nhận kết quả quay từ LuckyWheelDialog
}

export default function ConfirmPrizeDialog({
  open,
  onClose,
  winnerIndex,
  spinResult
}: ConfirmPrizeDialogProps) {
  const { spinProducts, isLoading: isLoadingProducts } = useGetAvailableSpinProducts();
  const { data: transactionData } = useGetTransaction();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const router = useRouter();

  // Lấy thông tin sản phẩm trúng thưởng từ API
  const winnerProduct = winnerIndex !== null && spinProducts ? spinProducts[winnerIndex] : null;

  // Đảm bảo chuyển đổi chuỗi thành số
  const productPrice = spinResult?.product?.price
    ? parseFloat(spinResult.product.price)
    : (winnerProduct?.price ? parseFloat(String(winnerProduct.price)) : 0);

  const profit = spinResult?.profit || 0;

  // Đảm bảo chuyển đổi chuỗi thành số
  const userBalance = transactionData?.balance
    ? parseFloat(String(transactionData.balance))
    : 0;

  // console.log("Product Price (number):", productPrice);
  // console.log("User Balance (number):", userBalance);
  // console.log("Is balance sufficient:", userBalance >= productPrice);

  const handleConfirm = () => {
    // Kiểm tra Số điểm trước khi xác nhận - đảm bảo so sánh số với số
    if (userBalance < productPrice) {
      const shortageAmount = productPrice - userBalance;
      setErrorMessage(`Số điểm của bạn không đủ. Bạn cần nạp thêm {fNumberMoney(shortageAmount)} điểm để gửi đi sản phẩm này.`);
      return;
    }

    setErrorMessage(null);
    setIsConfirming(true);

    // Giả lập xác nhận thành công sau 1 giây
    setTimeout(() => {
      setIsConfirming(false);
      onClose();
    }, 1000);
  };

  // Chuyển đến trang chủ để nạp tiền
  const navigateToHomePage = () => {
    onClose();
    router.push("/");
  };

  const openChat = () => {
    if (window.Tawk_API && window.Tawk_API.maximize) {
      window.Tawk_API.maximize();
    } else {
      console.log('Tawk.to is not loaded yet.');
    }
  };

  const handleChatAndClose = () => {
    openChat();
    onClose();
  };

  // Reset error message khi dialog mở lại
  useEffect(() => {
    if (open) {
      setErrorMessage(null);
      setIsConfirming(false);
    }
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      {/* {console.log("spinResult", spinResult)}
      {console.log("transactionData", transactionData)} */}
      <DialogContent sx={{ padding: 4, textAlign: 'center' }}>
        {isLoadingProducts ? (
          <CircularProgress />
        ) : !spinProducts || spinProducts.length === 0 ? (
          <Alert severity="error">Không thể tải dữ liệu sản phẩm</Alert>
        ) : (
          <div className="flex flex-col items-center space-y-4 max-w-full overflow-hidden">
            <div className="text-green-500 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {/* Ưu tiên hiển thị thông tin từ spinResult nếu có */}
            <div className="text-gray-600 w-full overflow-hidden">
              <p>Sản phẩm của bạn là:</p>
              <img
                src={spinResult?.product?.imageUrls?.[0] || (winnerIndex !== null && spinProducts ? spinProducts[winnerIndex].imageUrls?.[0] : "images/white-image.png")}
                alt={spinResult?.product?.name || (winnerIndex !== null && spinProducts ? spinProducts[winnerIndex].name : "images/white-image.png")}
                className="w-16 h-16 mx-auto my-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "images/white-image.png";
                }}
              />

              <p className="font-bold mt-2 line-clamp-2 truncate max-w-full overflow-hidden">
                {spinResult?.product?.name || (winnerIndex !== null && spinProducts ? spinProducts[winnerIndex].name : "")}
              </p>

              {/* Hiển thị thông tin giá và lợi nhuận */}
              <div className="mt-3 p-3 bg-gray-50 rounded-lg w-full">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Giá sản phẩm:</span>
                  <span className="text-sm font-semibold">{fNumberMoney(productPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tiền lãi:</span>
                  <span className="text-sm font-semibold text-green-600">+{fNumberMoney(profit)}</span>
                </div>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Số điểm hiện tại:</span>
                  <span className="text-sm font-semibold">{fNumberMoney(userBalance)}</span>
                </div>
              </div>
            </div>

            {/* Hiển thị thông báo lỗi nếu có */}
            {errorMessage && (
              <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                {errorMessage}
                <Button
                  color="error"
                  size="small"
                  onClick={navigateToHomePage}
                  sx={{ mt: 1 }}
                >
                  Nạp tiền ngay
                </Button>
              </Alert>
            )}

            <p className="text-sm text-gray-500">
              {spinResult?.data?.isFrozen
                ? "Vui lòng liên hệ CSKH để mở khóa sản phẩm"
                : "Hệ thống đã gửi đi sản phẩm"
              }
            </p>
            <Button
              variant="contained"
              color="primary"
              onClick={spinResult?.data?.isFrozen ? handleChatAndClose : handleConfirm}
              disabled={isConfirming}
              sx={{ mt: 2 }}
            >
              {isConfirming ? <CircularProgress size={24} /> : (
                spinResult?.data?.isFrozen ? "CSKH" : "Đóng"
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
} 