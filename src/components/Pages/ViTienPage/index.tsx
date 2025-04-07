"use client";

import { useUser } from "@/context/useUserContext";
import { useGetProfileData, useGetTransaction } from "@/hooks/useAuth";
import { useGetTransactionHistory, useWithdraw } from "@/hooks/useTransaction";
import { fNumberMoney } from "@/utils/format-number";
import CloseIcon from '@mui/icons-material/Close';
import { Button, Dialog, DialogContent, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Fake data for the chart
const chartData = [
  { name: "T1", thu: 4000, chi: 3000 },
  { name: "T2", thu: 3000, chi: 2500 },
  { name: "T3", thu: 5000, chi: 4500 },
  { name: "T4", thu: 2780, chi: 2000 },
  { name: "T5", thu: 1890, chi: 1700 },
  { name: "T6", thu: 2390, chi: 2100 },
  { name: "T7", thu: 3490, chi: 3000 },
  { name: "T8", thu: 2000, chi: 1800 },
  { name: "T9", thu: 2780, chi: 2500 },
  { name: "T10", thu: 4890, chi: 4000 },
  { name: "T11", thu: 3490, chi: 3200 },
  { name: "T12", thu: 4000, chi: 3500 },
];

export default function ViTienPage() {
  const { setLoadingGlobal } = useUser();
  const { data, isFetching, refetch: refetchTransaction } = useGetTransaction();
  const { profile, refetch: refetchProfile } = useGetProfileData();

  // State for dialogs
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawHistoryDialogOpen, setWithdrawHistoryDialogOpen] = useState(false);

  // Add transaction history state and API call
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [pagination, setPagination] = useState({
    current: 1,
    limit: 10,
  });
  const [activeFilter, setActiveFilter] = useState<"all" | "pending" | "completed" | "rejected">("all");
  const { mutate: getTransactionHistory, isPending: isLoadingHistory } = useGetTransactionHistory();

  // Add withdraw mutation
  const { mutate: withdrawMutation, isPending: isWithdrawing } = useWithdraw();

  // State for withdraw form
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  // Add state for error message
  const [withdrawError, setWithdrawError] = useState("");

  // Add transaction type filter
  const [transactionType, setTransactionType] = useState<string>("all");

  // Replace separate dialogs with a single transaction history dialog
  const [transactionHistoryDialogOpen, setTransactionHistoryDialogOpen] = useState(false);

  useEffect(() => {
    if (isFetching) {
      setLoadingGlobal(true);
    } else {
      setLoadingGlobal(false);
    }
  }, [isFetching, setLoadingGlobal]);

  // Handle open withdraw dialog with pre-filled values
  const handleOpenWithdrawDialog = () => {
    // Pre-fill bank information from profile
    if (profile?.data) {
      setBankName(profile.data.bankName || "");
      setBankCode(profile.data.bankCode || "");
      setAccountNumber(profile.data.bankNumber || "");
      setAccountName(profile.data.fullName || "");
    }
    setWithdrawDialogOpen(true);
  };
  const handleCloseWithdrawDialog = () => setWithdrawDialogOpen(false);

  const handleOpenWithdrawHistoryDialog = () => {
    setTransactionType("withdraw");
    setWithdrawHistoryDialogOpen(true);
  };
  const handleCloseWithdrawHistoryDialog = () => setWithdrawHistoryDialogOpen(false);

  // Fetch transaction history
  const fetchTransactionHistory = () => {
    const params: any = {
      page: pagination.current,
      limit: pagination.limit,
      type: transactionType == "all" ? undefined : transactionType,
    };
    
    // Only add status if not "all"
    if (activeFilter !== "all") {
      params.status = activeFilter;
    }
    
    // Add type filter if not "all"
    if (transactionType !== "all") {
      params.type = transactionType;
    }
    
    getTransactionHistory(
      params,
      {
        onSuccess: (response: any) => {
          setTransactionHistory(response?.data || []);
          setTotalPages(response?.meta?.total || 0);
        },
        onError: (err: any) => {
          console.log(err);
          setTransactionHistory([]);
        },
      }
    );
  };

  // Handle dialog open/close
  const handleOpenTransactionHistoryDialog = () => {
    setTransactionHistoryDialogOpen(true);
  };
  
  const handleCloseTransactionHistoryDialog = () => {
    setTransactionHistoryDialogOpen(false);
  };

  // Handle filter change
  const handleFilterChange = (filter: "all" | "pending" | "completed" | "rejected") => {
    setActiveFilter(filter);
    setPagination({
      current: 1,
      limit: 10,
    });
  };

  // Handle transaction type change
  const handleTypeChange = (type: string) => {
    setTransactionType(type);
    setPagination({
      current: 1,
      limit: 10,
    });
  };

  // Handle pagination change
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setPagination({
      ...pagination,
      current: page,
    });
  };

  // Fetch transaction history when dialog opens or filter/pagination/type changes
  useEffect(() => {
    if (transactionHistoryDialogOpen) {
      fetchTransactionHistory();
    }
  }, [transactionHistoryDialogOpen, activeFilter, pagination, transactionType]);

  // Handle withdraw form submission
  const handleWithdrawSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset error message
    setWithdrawError("");
    
    // Call the withdraw API
    withdrawMutation({
      amount: Number(withdrawAmount),
      bankName: bankName,
      bankCode: bankCode || bankName, // Use bankCode if available, otherwise use bankName
      accountNumber: accountNumber,
      accountName: accountName || profile?.data?.fullName || "" // Use accountName if available, otherwise use profile fullName
    }, {
      onSuccess: (data: any) => {
        alert(`Yêu cầu rút ${withdrawAmount} đã được gửi và đang chờ xử lý`);
        handleCloseWithdrawDialog();
        // Reset form
        setWithdrawAmount("");
        setBankName("");
        setBankCode("");
        setAccountNumber("");
        setAccountName("");
        // Refresh profile data to get updated balance
        refetchProfile();
      },
      onError: (error: any) => {
        // Display the error message from the API response if available
        if (error.response?.data?.message) {
          setWithdrawError(error.response.data.message);
        } else {
          setWithdrawError(`Có lỗi xảy ra: ${error.message || 'Không thể kết nối đến máy chủ'}`);
        }
      }
    });
  };

  console.log("profile", profile)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-[70px]">
      {/* Chart area with red background */}
      <div className="bg-red-600 p-4 pb-16">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.2)" />
            <XAxis dataKey="name" tick={{ fill: 'white', fontSize: 10 }} />
            <YAxis tick={{ fill: 'white', fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="thu" fill="#8dd1e1" radius={[3, 3, 0, 0]} />
            <Bar dataKey="chi" fill="#a4a1fb" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Income Analysis Card */}
      <div className="bg-white rounded-lg shadow-md mx-4 -mt-10 p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Phân Tích Thu Nhập</h2>

        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-2xl font-bold">{fNumberMoney(data?.totalProfit || 0)}</span>
            <div className="bg-purple-100 rounded-full w-16 h-16 flex justify-center items-center">
              <span className="text-red-600 font-bold">Điểm</span>
            </div>
          </div>
          <p className="text-gray-600">Thu Nhập Hoa Hồng</p>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-red-600 h-2 rounded-full" style={{ width: '70%' }}></div>
        </div>
      </div>

      {/* Detailed Information Card */}
      <div className="bg-white rounded-lg shadow-md mx-4 mt-4 p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Thông Tin Chi Tiết Quỹ</h2>

        {/* Balance */}
        <div className="flex items-center py-3 border-b">
          <div className="bg-purple-100 rounded-lg w-12 h-12 flex justify-center items-center mr-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div className="flex-1">
            <h3 className="font-semibold">Số điểm Khả Dụng</h3>
            <p className="text-gray-600 text-lg font-bold">{fNumberMoney(profile?.data?.balance || 0)}</p>
          </div>
        </div>

        {/* Transaction History Button */}
        <div
          onClick={handleOpenTransactionHistoryDialog}
          className="flex items-center py-3 border-b cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="bg-purple-100 rounded-lg w-12 h-12 flex justify-center items-center mr-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Lịch Sử Giao Dịch</h3>
            <p className="text-gray-600 text-sm">Xem Lịch Sử Nạp/Rút Tiền</p>
          </div>
        </div>

        {/* Withdraw Button */}
        <div
          onClick={handleOpenWithdrawDialog}
          className="flex items-center py-3 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="bg-purple-100 rounded-lg w-12 h-12 flex justify-center items-center mr-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Rút Tiền</h3>
            <p className="text-gray-600 text-sm">Rút Tiền Về Tài Khoản Ngân Hàng Của Bạn</p>
          </div>
        </div>
      </div>

      {/* Transaction History Dialog */}
      <Dialog
        open={transactionHistoryDialogOpen}
        onClose={handleCloseTransactionHistoryDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="flex justify-between items-center">
          <span>Lịch Sử Giao Dịch</span>
          <IconButton onClick={handleCloseTransactionHistoryDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Transaction Type Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại Giao Dịch
            </label>
            <select
              value={transactionType}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="all">Tất cả</option>
              <option value="recharge">Nạp tiền</option>
              <option value="withdraw">Rút tiền</option>
              <option value="bonus">Thưởng</option>
              <option value="payment">Thanh toán</option>
              <option value="spin_reward">Phần thưởng quay</option>
            </select>
          </div>
          
          {/* Status Filter */}
          <div className="flex space-x-3 mb-6 overflow-x-auto">
            <button
              className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                activeFilter === "all"
                  ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => handleFilterChange("all")}
            >
              TOÀN BỘ
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                activeFilter === "completed"
                  ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => handleFilterChange("completed")}
            >
              HOÀN THÀNH
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                activeFilter === "pending"
                  ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => handleFilterChange("pending")}
            >
              CHỜ XỬ LÝ
            </button>
            <button
              className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
                activeFilter === "rejected"
                  ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => handleFilterChange("rejected")}
            >
              TỪ CHỐI
            </button>
          </div>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Loại</TableCell>
                  <TableCell>Số Điểm</TableCell>
                  <TableCell>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoadingHistory ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">Đang tải...</TableCell>
                  </TableRow>
                ) : transactionHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">Không có dữ liệu</TableCell>
                  </TableRow>
                ) : (
                  transactionHistory.map((row: any) => (
                    <TableRow key={row.id}>
                      <TableCell>{new Date(row.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                      <TableCell>
                        {row.type === 'recharge' ? 'Nạp tiền' : 
                         row.type === 'withdraw' ? 'Rút tiền' : 
                         row.type === 'bonus' ? 'Thưởng' : 
                         row.type === 'payment' ? 'Thanh toán' : 
                         row.type === 'spin_reward' ? 'Phần thưởng quay' : row.type}
                      </TableCell>
                      <TableCell>{fNumberMoney(row.money)}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          row.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          row.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {row.status === 'completed' ? 'Thành công' : 
                           row.status === 'pending' ? 'Đang xử lý' : 'Từ chối'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          
          <div className="mt-4 flex justify-center">
            <Pagination 
              count={Math.ceil(totalPages / pagination.limit)} 
              page={pagination.current}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
          
          <div className="mt-4 flex justify-center">
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenWithdrawDialog}
              className="mr-2"
            >
              Rút Tiền
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                toast.error("Chức năng nạp tiền đang được phát triển. Vui lòng liên hệ CSKH để được hỗ trợ.");
              }}
            >
              Nạp Tiền
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog
        open={withdrawDialogOpen}
        onClose={handleCloseWithdrawDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="flex justify-between items-center">
          <span>Rút Tiền</span>
          <IconButton onClick={handleCloseWithdrawDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Display error message if there is one */}
          {withdrawError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
              <p className="font-medium">Lỗi:</p>
              <p>{withdrawError}</p>
            </div>
          )}
          
          <form onSubmit={handleWithdrawSubmit} className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số Điểm Khả Dụng
              </label>
              <div className="p-3 bg-gray-100 rounded-md">
                {fNumberMoney(profile?.data?.balance || 0)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số Điểm Muốn Rút *
              </label>
              <input
                type="number"
                required
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Nhập Số Điểm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên Ngân Hàng *
              </label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => {
                  setBankName(e.target.value);
                  setBankCode(e.target.value); // Set bankCode same as bankName
                }}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="VD: Vietcombank, Techcombank..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số Tài Khoản *
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Nhập số tài khoản"
              />
            </div>

            {/* Hidden account name field */}
            <input
              type="hidden"
              value={accountName || profile?.data?.fullName || ""}
            />

            <div className="pt-2">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isWithdrawing}
              >
                {isWithdrawing ? "Đang xử lý..." : "Xác Nhận Rút Tiền"}
              </Button>
            </div>
          </form>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
            <p className="font-medium">Lưu ý:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Số Điểm tối thiểu để rút là 100,000 VND</li>
              <li>Thời gian xử lý từ 1-3 ngày làm việc</li>
              <li>Phí rút tiền: 0%</li>
              <li>Bạn cần có đủ số lần quay để rút tiền</li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 