/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect, useState } from "react";
import { Table, Pagination } from "antd";
import dayjs from "dayjs";
import { fNumberMoney } from "@/utils/format-number";
import { useGetTransactionHistory } from "@/hooks/useTransaction";



export default function HistoryTransaction() {
    const [activeFilter, setActiveFilter] = useState<
    "all" | "pending" | "completed" | "rejected"
  >("all"); // Default active filter
  const [panigator, setPanigator] = useState({
    current: 1,
    limit: 10,
  });

  // Thêm state cho lịch sử quay
 
  
  const [spinPagination, setSpinPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const { mutate: getData, isError, isPending } = useGetTransactionHistory();
 
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [totalPage, setTotalPage] = useState(1);

  // Define columns for the table
  const columns = [
    // {
    //   title: "Tiêu đề",
    //   dataIndex: "description",
    //   key: "title",
    // },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createAt",
      render: (data: any) => dayjs(data).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: any) =>
        status === "pending" ? (
          <span className="text-yellow-500">Chờ xử lý</span>
        ) : status === "completed" ? (
          <span className="text-green-500">Hoàn thành</span>
        ) : (
          <span className="text-red-500">Từ chối</span>
        ),
    },
    {
      title: "Số tiền",
      dataIndex: "money",
      key: "money",
      render: (money: any) => fNumberMoney(money) + " USD", // Format money using your fNumberMoney function
    },
  ];

  // Handle pagination change
  const handlePaginationChange = (page: number, pageSize: number) => {
    setPanigator({
      current: page,
      limit: pageSize,
    });
  };

  

  useEffect(() => {
    if (panigator && activeFilter) {
      setPanigator({
        current: 1,
        limit: 10,
      });
    }
  }, [activeFilter]);

  useEffect(() => {
    if (panigator && activeFilter) {
      onChangeData();
    }
  }, [panigator]);

  

  const onChangeData = () => {
    getData(
      {
        status: activeFilter,
        page: panigator.current,
        limit: panigator.limit,
      },
      {
        onSuccess: (response: any) => {
          console.log(response?.data);
          setTransactionHistory(response?.data);
          setTotalPage(response?.meta?.total);
        },
        onError: (err: any) => {
          console.log(err);
          setTransactionHistory([]);
        },
      }
    );
  };

 


  return (
    <div className="flex flex-col justify-center min-h-screen bg-gray-50 py-8">
      <div className="bg-white rounded-xl p-2 shadow-sm w-full mb-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Lịch sử giao dịch
        </h1>

        <div className="flex space-x-3 mb-6">
          <button
            className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
              activeFilter === "all"
                ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveFilter("all")}
          >
            TOÀN BỘ
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
              activeFilter === "completed"
                ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveFilter("completed")}
          >
            HOÀN THÀNH
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
              activeFilter === "pending"
                ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActiveFilter("pending")}
          >
            CHỜ XỬ LÝ
          </button>
        </div>

        <div className="rounded-lg overflow-hidden border border-gray-200">
          <Table
            loading={isPending}
            columns={columns}
            dataSource={transactionHistory}
            pagination={false}
            size="middle"
            className="custom-table"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Pagination
            current={panigator.current}
            pageSize={panigator.limit}
            total={totalPage}
            onChange={handlePaginationChange}
            showSizeChanger
            pageSizeOptions={["5", "10", "20"]}
            className="custom-pagination"
          />
        </div>
      </div>

    </div>
  );
}