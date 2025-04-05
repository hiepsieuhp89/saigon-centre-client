"use client";

import { useUser } from "@/context/useUserContext";
import { useGetProfileData, useGetTransaction } from "@/hooks/useAuth";
import { fNumberMoney } from "@/utils/format-number";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Dialog, DialogContent, DialogTitle, IconButton, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

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

// Fake data for deposit history
const depositHistoryData = [
  { id: 1, date: "2023-10-15", amount: 5000000, status: "Thành công", method: "Chuyển khoản ngân hàng" },
  { id: 2, date: "2023-09-28", amount: 3000000, status: "Thành công", method: "Ví điện tử" },
  { id: 3, date: "2023-08-17", amount: 2000000, status: "Thành công", method: "Chuyển khoản ngân hàng" },
  { id: 4, date: "2023-07-05", amount: 1500000, status: "Thành công", method: "Thẻ tín dụng" },
];

// Fake data for withdrawal history
const withdrawalHistoryData = [
  { id: 1, date: "2023-10-10", amount: 2000000, status: "Thành công", bank: "Vietcombank", account: "****5678" },
  { id: 2, date: "2023-09-15", amount: 1500000, status: "Thành công", bank: "Techcombank", account: "****1234" },
  { id: 3, date: "2023-08-20", amount: 3000000, status: "Đang xử lý", bank: "Vietcombank", account: "****5678" },
];

export default function ViTienPage() {
  const { setLoadingGlobal } = useUser();
  const { data, isFetching, refetch: refetchTransaction } = useGetTransaction();
  const { profile, refetch: refetchProfile } = useGetProfileData();

  // State for dialogs
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawHistoryDialogOpen, setWithdrawHistoryDialogOpen] = useState(false);

  // State for withdraw form
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  useEffect(() => {
    if (isFetching) {
      setLoadingGlobal(true);
    } else {
      setLoadingGlobal(false);
    }
  }, [isFetching, setLoadingGlobal]);

  // Handle dialog open/close
  const handleOpenDepositDialog = () => setDepositDialogOpen(true);
  const handleCloseDepositDialog = () => setDepositDialogOpen(false);

  const handleOpenWithdrawDialog = () => setWithdrawDialogOpen(true);
  const handleCloseWithdrawDialog = () => setWithdrawDialogOpen(false);

  const handleOpenWithdrawHistoryDialog = () => setWithdrawHistoryDialogOpen(true);
  const handleCloseWithdrawHistoryDialog = () => setWithdrawHistoryDialogOpen(false);

  // Handle withdraw form submission
  const handleWithdrawSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert(`Yêu cầu rút ${withdrawAmount} đã được gửi và đang chờ xử lý`);
    handleCloseWithdrawDialog();
    // Reset form
    setWithdrawAmount("");
    setBankName("");
    setAccountNumber("");
    setAccountName("");
  };

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

        {/* Deposit Records Button */}
        <div
          onClick={handleOpenDepositDialog}
          className="flex items-center py-3 border-b cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="bg-purple-100 rounded-lg w-12 h-12 flex justify-center items-center mr-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Hồ Sơ Nạp Tiền</h3>
            <p className="text-gray-600 text-sm">Xem Lịch Sử Nạp Tiền</p>
          </div>
        </div>

        {/* Withdraw Button */}
        <div
          onClick={handleOpenWithdrawDialog}
          className="flex items-center py-3 border-b cursor-pointer hover:bg-gray-50 transition-colors"
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

        {/* Withdrawal History Button */}
        <div
          onClick={handleOpenWithdrawHistoryDialog}
          className="flex items-center py-3 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="bg-purple-100 rounded-lg w-12 h-12 flex justify-center items-center mr-4">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Lịch Sử Rút Tiền</h3>
            <p className="text-gray-600 text-sm">Xem Lịch Sử Rút Tiền</p>
          </div>
        </div>
      </div>

      {/* Deposit History Dialog */}
      <Dialog
        open={depositDialogOpen}
        onClose={handleCloseDepositDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="flex justify-between items-center">
          <span>Lịch Sử Nạp Tiền</span>
          <IconButton onClick={handleCloseDepositDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Số tiền</TableCell>
                  <TableCell>Phương thức</TableCell>
                  <TableCell>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {depositHistoryData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{fNumberMoney(row.amount)}</TableCell>
                    <TableCell>{row.method}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                        {row.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="mt-4 flex justify-center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => alert("Chức năng nạp tiền đang được phát triển. Vui lòng liên hệ CSKH để được hỗ trợ.")}
            >
              Nạp Tiền Mới
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
                Số Tiền Muốn Rút *
              </label>
              <input
                type="number"
                required
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Nhập số tiền"
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
                onChange={(e) => setBankName(e.target.value)}
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên Chủ Tài Khoản *
              </label>
              <input
                type="text"
                required
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Nhập tên chủ tài khoản"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Xác Nhận Rút Tiền
              </Button>
            </div>
          </form>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
            <p className="font-medium">Lưu ý:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Số tiền tối thiểu để rút là 100,000 VND</li>
              <li>Thời gian xử lý từ 1-3 ngày làm việc</li>
              <li>Phí rút tiền: 0%</li>
            </ul>
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdrawal History Dialog */}
      <Dialog
        open={withdrawHistoryDialogOpen}
        onClose={handleCloseWithdrawHistoryDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="flex justify-between items-center">
          <span>Lịch Sử Rút Tiền</span>
          <IconButton onClick={handleCloseWithdrawHistoryDialog} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ngày</TableCell>
                  <TableCell>Số tiền</TableCell>
                  <TableCell>Ngân hàng</TableCell>
                  <TableCell>Trạng thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {withdrawalHistoryData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{fNumberMoney(row.amount)}</TableCell>
                    <TableCell>{row.bank}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 ${row.status === 'Thành công' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} rounded-full text-xs`}>
                        {row.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </div>
  );
} 