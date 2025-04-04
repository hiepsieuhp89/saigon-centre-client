/* eslint-disable @next/next/no-img-element */
"use client";

import BannerHomePage from "@/components/ui/BannerHomePage";
import InvestmentLevels from "@/components/ui/ThuongDaiLy";
import { WithdrawDialog } from "@/components/WithdrawDialog";
import { useUser } from "@/context/useUserContext";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  FaCloudUploadAlt
} from "react-icons/fa";

export default function HomePage() {
  const { user } = useUser();
  const router = useRouter();
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  if (!user) {
    router.push("/dang-nhap");
  }

  return (
    <div className="bg-gray-100 min-h-screen pb-16">
      <div className="p-4">
        <BannerHomePage />

        {/* Buttons */}
        <div className="flex justify-center mt-4 w-full">
          {/* <Button 
            variant="contained" 
            onClick={() => setIsDepositOpen(true)}
            sx={{ 
              width: '50%', 
              mr: 1, 
              py: 1.5,
              backgroundColor: '#2E7D32',
              '&:hover': {
                backgroundColor: '#1B5E20',
              }
            }}
            startIcon={<FaCloudDownloadAlt size={24} />}
          >
            Nạp tiền
          </Button> */}
          <Button 
            variant="contained" 
            onClick={() => setIsWithdrawOpen(true)}
            sx={{ 
              width: '50%', 
              ml: 1, 
              py: 1.5,
              backgroundColor: '#C00000',
              '&:hover': {
                backgroundColor: '#A00000',
              }
            }}
            startIcon={<FaCloudUploadAlt size={24} />}
          >
            Rút tiền
          </Button>
        </div>

        {/* Banners */}
        <div className="mt-4">
          <div className="flex flex-col gap-[10px]">
            <img src="/images/banner/home-1.1.png" alt="" />
            <img src="/images/banner/home-2.1-1.png" alt="" />
          </div>
        </div>

        {/* Investment Section */}
        <div className="bg-gray-100 flex justify-center items-center gap-2 mt-2 text-black">
          <div className="w-full max-w-md bg-white shadow-md rounded-lg overflow-hidden">
            <InvestmentLevels />
          </div>
        </div>
      </div>

      {/* <DepositDialog
        open={isDepositOpen}
        onClose={() => {
          setIsDepositOpen(false);
        }}
        user={user}
      /> */}

      <WithdrawDialog
        open={isWithdrawOpen}
        onClose={() => {
          setIsWithdrawOpen(false);
        }}
        user={user}
      />
    </div>
  );
}
