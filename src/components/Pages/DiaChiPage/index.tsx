import { useUser } from "@/context/useUserContext";
import { useUpdateInfoUser } from "@/hooks/useAuth";
import { message } from "antd";
import { useForm } from "react-hook-form"; // Import React Hook Form

export default function AddressForm() {
  const { user } = useUser();
  const { mutate: updateInfoUser, isError, isPending } = useUpdateInfoUser();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      address: "", // Default value for the address field
    },
  });

  // Handle form submission
  const onSubmit = (data: any) => {
    console.log("Form data:", data); // Replace with your submission logic
    // Example: Send `data.address` to an API or update state/context
    try {
      updateInfoUser(
        {
          address: data.address,
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
    } catch (error) {}
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-50 py-8 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-2xl mx-auto transition-all duration-300 hover:shadow-2xl">
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-800">
          Thông Tin Địa Chỉ
        </h2>

        {/** Account Name */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <label className="block text-gray-700 font-medium mb-2">Tên tài khoản</label>
          <p className="text-gray-800 font-semibold">{user?.fullName || "Không có"}</p>
        </div>

        {/** Phone Number */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <label className="block text-gray-700 font-medium mb-2">Số điện thoại</label>
          <p className="text-gray-800 font-semibold">
            {user?.phone.replace(/./g, "*") || "Không có"}
          </p>
        </div>

        {/** Address Input with React Hook Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <label className="block text-gray-700 font-medium mb-2">Địa chỉ</label>
            <input
              type="text"
              placeholder="Nhập địa chỉ của bạn"
              {...register("address", { required: "Địa chỉ là bắt buộc" })}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                errors.address ? "border-red-500" : "border-gray-300 hover:border-blue-400"
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-2 font-medium">
                {errors.address.message}
              </p>
            )}
          </div>

          {/** Update Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium text-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? "ĐANG CẬP NHẬT..." : "CẬP NHẬT"}
          </button>
        </form>
      </div>
    </div>
  );
}
