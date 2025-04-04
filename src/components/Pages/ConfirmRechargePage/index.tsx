/* eslint-disable @next/next/no-img-element */
import { recharge } from "@/api/services/transaction.service";
import { useUser } from "@/context/useUserContext";
import { Button, Card, Descriptions, Divider, message, Modal } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

export default function ConfirmRechargePage() {
  const { loadingGlobal, setLoadingGlobal } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");
  const bankName = searchParams.get("bankName");
  const accountNumber = searchParams.get("accountNumber");
  const accountName = searchParams.get("accountName");
  const url = `https://img.vietqr.io/image/vietinbank-113366668888-qr_only.jpg?amount=${amount}&addInfo=dong%20qop%20quy%20vac%20xin&accountName=Quy%20Vac%20Xin%20Covid`;

  const showConfirmModal = () => {
    Modal.confirm({
      title: 'Xác nhận nạp tiền',
      centered: true,
      content: (
        <div>
          <p>Bạn xác nhận đã chuyển khoản Số điểm <strong>{amount ? `${Number(amount).toLocaleString("vi-VN")} điểm` : "N/A"}</strong> vào tài khoản:</p>
          {/* <p><strong>Tên ngân hàng:</strong> {bankName || "N/A"}</p>
          <p><strong>Số tài khoản:</strong> {accountNumber || "N/A"}</p>
          <p><strong>Tên tài khoản:</strong> {accountName || "N/A"}</p> */}
          <p className="text-red-500 mt-2">Lưu ý: Việc xác nhận sai sẽ ảnh hưởng đến quá trình xử lý giao dịch của bạn.</p>
        </div>
      ),
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: onSubmit,
    });
  };

  const onSubmit = async () => {
    setLoadingGlobal(true);
    try {
      if (Number(amount) > 0) {
        const payload = {
          amount: Number(amount || 0),
          // bankName: bankName || "00000000",
          // accountNumber: accountNumber || "00000000",
          // accountName: accountName || "00000000",
        };

        await recharge(payload);
        message.success(
          "Yêu cầu nạp tiền đã được gửi! Chúng tôi sẽ xử lý trong vòng 5-15 phút."
        );
        router.push("/");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi nạp tiền. Vui lòng thử lại!");
    } finally {
      setLoadingGlobal(false);
    }
  };

  return (
    <div className="h-[86vh] bg-gray-100 overflow-y-hidden overflow-hidden flex items-center justify-center p-4 mb-8">
      <Card
        className="w-full max-w-2xl shadow-lg"
        title={
          <h2 className="text-xl font-bold text-center">Xác Nhận Nạp Tiền</h2>
        }
      >
        <div className="flex flex-col gap-6">
          {/* Transaction Details */}
          <Descriptions
            title="Thông Tin Giao Dịch"
            bordered
            column={1}
            size="small"
            labelStyle={{ fontWeight: "bold" }}
          >
            <Descriptions.Item label="Số điểm">
              {amount ? `${Number(amount).toLocaleString("vi-VN")} điểm` : "N/A"}
            </Descriptions.Item>
          </Descriptions>

          {/* QR Code */}
          {/* <div className="flex justify-center">
            <img
              src={url}
              alt="QR Code Thanh Toán"
              className="max-w-full h-auto rounded-lg shadow-md"
              style={{ maxWidth: "300px" }}
            />
          </div> */}

          {/* Instructions */}
          {/* <div className="text-center text-gray-600">
            <p>Vui lòng quét mã QR bằng ứng dụng ngân hàng của bạn</p>
            <p>để thực hiện chuyển khoản.</p>
          </div> */}

          {/* Submit Button */}
          <Button
            type="primary"
            loading={loadingGlobal}
            disabled={loadingGlobal}
            size="large"
            onClick={showConfirmModal}
            className="w-full mt-4"
          >
            Tôi Đã Nạp Tiền
          </Button>
        </div>
      </Card>
    </div>
  );
}
