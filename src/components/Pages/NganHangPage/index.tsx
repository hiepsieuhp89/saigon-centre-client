/* eslint-disable react-hooks/exhaustive-deps */
import { useUser } from "@/context/useUserContext";
import { useGetListBank, useUpdateBankUser } from "@/hooks/useAuth";
import { message } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function BankAccountInfo() {
  const { user } = useUser();
  const { listBank } = useGetListBank();
  const { mutate: updateBankUser, isPending } = useUpdateBankUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch, // Add watch to monitor form values
  } = useForm({
    defaultValues: {
      accountNumber: "",
      bankCode: "",
    },
  });

  const [bankOptions, setBankOptions] = useState<
    Array<{ code: string; name: string }>
  >([]);

  // Populate bank options
  useEffect(() => {
    if (listBank) {
      const formattedBanks = listBank.map((bank) => ({
        code: bank.bankCode,
        name: `${bank.bankCode} - ${bank.bankName}`,
      }));
      setBankOptions(formattedBanks);
    }
  }, [listBank]);

  // Sync user data with form when user or bankOptions change
  useEffect(() => {
    if (user && bankOptions.length > 0) {
      setValue("accountNumber", user.bankNumber || "");
      setValue("bankCode", user.bankCode || "");
    }
  }, [user, bankOptions, setValue]);

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    try {
      updateBankUser(
        {
          bankCode: data.bankCode,
          bankNumber: data.accountNumber,
        },
        {
          onSuccess: (response) => {
            message.success(response?.data?.message);
          },
          onError: (err: any) => {
            message.error(err?.response?.data?.message);
          },
        }
      );
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  // Optional: Watch the bankCode value for debugging
  const selectedBankCode = watch("bankCode");

  return (
    <div className="min-h-screen max-w-3xl mx-auto py-8 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Thông tin tài khoản ngân hàng
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {user?.bankNumber && user?.bankCode && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium text-blue-800 mb-2">
                Thông tin ngân hàng hiện tại:
              </h3>
              <p className="text-blue-700">
                Số tài khoản: {user.bankNumber}
                <br />
                Mã ngân hàng: {user.bankCode}
              </p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên tài khoản
            </label>
            <p className="text-gray-900 font-medium">{user?.fullName}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <p className="text-gray-900 font-medium">{user?.phone.replace(/./g, '*')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số tài khoản
            </label>
            <input
              type="text"
              placeholder="Nhập số tài khoản ngân hàng"
              {...register("accountNumber", {
                required: "Số tài khoản là bắt buộc",
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Số tài khoản chỉ được chứa số",
                },
                minLength: {
                  value: 8,
                  message: "Số tài khoản phải có ít nhất 8 chữ số",
                },
              })}
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.accountNumber ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.accountNumber && (
              <p className="mt-2 text-sm text-red-600">
                {errors.accountNumber.message?.toString()}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên ngân hàng
            </label>
            <select
              {...register("bankCode", {
                required: "Vui lòng chọn ngân hàng",
              })}
              className={`w-full px-4 py-3 rounded-lg border bg-white focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.bankCode ? "border-red-500" : "border-gray-300"
              }`}
              value={selectedBankCode} // Ensure the select is controlled
            >
              <option value="">--Chọn ngân hàng--</option>
              {bankOptions.map((bank) => (
                <option key={bank.code} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </select>
            {errors.bankCode && (
              <p className="mt-2 text-sm text-red-600">
                {errors.bankCode.message?.toString()}
              </p>
            )}
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">
              <span className="font-semibold">Lưu ý an ninh:</span> Vì mục đích
              an ninh và bảo mật, quý khách vui lòng không điền hoặc cung cấp
              bất kỳ thông tin tài khoản và mật khẩu đăng nhập ngân hàng như
              Internet Banking, Mobile Banking cho bất kỳ ai, nhân viên CSKH
              SaigonCentre cũng sẽ không yêu cầu bạn cung cấp trong suốt quá
              trình sử dụng dịch vụ!
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50"
          >
            {isPending ? "ĐANG CẬP NHẬT..." : "CẬP NHẬT"}
          </button>
        </form>
      </div>
    </div>
  );
}
