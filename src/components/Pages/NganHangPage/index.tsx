/* eslint-disable react-hooks/exhaustive-deps */
import { useUser } from "@/context/useUserContext";
import { useGetListBank, useUpdateBankUser } from "@/hooks/useAuth";
import { message } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaCreditCard, FaInfoCircle, FaLock } from "react-icons/fa";

export default function BankAccountInfo() {
  const { user } = useUser();
  const { listBank } = useGetListBank();
  const { mutate: updateBankUser, isPending } = useUpdateBankUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      accountNumber: "",
      bankCode: "",
    },
  });

  // Sync user data with form when user changes
  useEffect(() => {
    if (user) {
      setValue("accountNumber", user.bankNumber || "");
      setValue("bankCode", user.bankCode || "");
    }
  }, [user, setValue]);

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

  return (
    <div className="flex flex-col min-h-screen pb-[70px]">
      {/* Header with red background */}
      <div className="bg-red-600 p-4 flex flex-col items-center">
        <h2 className="text-white text-xl font-bold mb-2">Tài Khoản Ngân Hàng</h2>
        <p className="text-white text-lg">Sửa Thông Tin Tài Khoản</p>
      </div>

      <div className="mx-4 my-4">
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          {user?.bankNumber && user?.bankCode && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
              <div className="flex items-center mb-2">
                <FaInfoCircle className="text-blue-600 mr-2" />
                <h3 className="font-medium text-blue-800">
                  Thông tin ngân hàng hiện tại:
                </h3>
              </div>
              <p className="text-blue-700 ml-6">
                Số tài khoản: {user.bankNumber}
                <br />
                Mã ngân hàng: {user.bankCode}
              </p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-lg w-10 h-10 flex justify-center items-center mr-3">
                <FaCreditCard className="text-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tên tài khoản
                </label>
                <p className="text-gray-900 font-medium">{user?.fullName}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <input
                type="text"
                placeholder="Nhập mã ngân hàng"
                {...register("bankCode", {
                  required: "Mã ngân hàng là bắt buộc",
                })}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.bankCode ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.bankCode && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.bankCode.message?.toString()}
                </p>
              )}
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <div className="flex">
                <FaLock className="text-red-600 mt-1 mr-2 flex-shrink-0" />
                <p className="text-red-700 text-sm">
                  <span className="font-semibold">Lưu ý an ninh:</span> Vì mục đích
                  an ninh và bảo mật, quý khách vui lòng không điền hoặc cung cấp
                  bất kỳ thông tin tài khoản và mật khẩu đăng nhập ngân hàng như
                  Internet Banking, Mobile Banking cho bất kỳ ai, nhân viên CSKH
                  SaigonCentre cũng sẽ không yêu cầu bạn cung cấp trong suốt quá
                  trình sử dụng dịch vụ!
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:opacity-50"
            >
              {isPending ? "ĐANG CẬP NHẬT..." : "CẬP NHẬT"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
