import { withdraw } from "@/api/services/transaction.service";
import { useFormik } from "formik";
import * as Yup from "yup";
import { message } from "antd";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useGetProfileData } from "@/hooks/useAuth";

interface WithdrawDialogProps {
  open: boolean;
  onClose: () => void;
  user: any;
}

export function WithdrawDialog({ open, onClose, user }: WithdrawDialogProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const { profile, refetch: refetchProfile } = useGetProfileData();

  const formik = useFormik({
    initialValues: {
      amount: undefined,
      withdrawPassword: "",
    },
    validationSchema: Yup.object({
      amount: Yup.number()
        .required("Vui lòng nhập số tiền")
        .min(200, "Số tiền tối thiểu là 200 USD")
        .max(
          user?.balance || 0,
          `Số tiền rút không được vượt quá số dư (${user?.balance || 0} USD)`
        ),
      withdrawPassword: Yup.string().required("Vui lòng nhập mật khẩu rút tiền"),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          amount: values.amount || 0,
          withdrawPassword: values.withdrawPassword,
        };

        console.log('payload', payload);
        
        await withdraw(payload);
        messageApi.success(
          "Yêu cầu rút tiền đã được gửi! Chúng tôi sẽ xử lý trong vòng 30 phút đến 2 giờ."
        );

        setTimeout(() => {
          onClose();
        }, 5000);
      } catch (error: any) {
        messageApi.error(
          error.response?.data?.message ||
            "Có lỗi xảy ra khi rút tiền. Vui lòng thử lại!"
        );
      } finally {
        refetchProfile();
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        {contextHolder}
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-[#C00000]">
            Rút Tiền
          </DialogTitle>
          <DialogDescription className="text-center">
            Vui lòng điền đầy đủ thông tin để rút tiền từ tài khoản. Số dư hiện
            tại: {user?.balance || 0} USD
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Số tiền (USD)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Nhập số tiền cần rút"
              {...formik.getFieldProps("amount")}
            />
            {formik.touched.amount && formik.errors.amount && (
              <p className="text-red-500 text-sm">{formik.errors.amount}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdrawPassword">Mật khẩu rút tiền</Label>
            <Input
              id="withdrawPassword"
              type="password"
              placeholder="Nhập mật khẩu rút tiền"
              {...formik.getFieldProps("withdrawPassword")}
            />
            {formik.touched.withdrawPassword && formik.errors.withdrawPassword && (
              <p className="text-red-500 text-sm">{formik.errors.withdrawPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Đang xử lý..." : "Tiếp tục"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}