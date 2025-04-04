import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  FaHome,
  FaPlaneDeparture,
  FaHistory,
  FaPhoneVolume,
  FaRegUser,
} from "react-icons/fa";

declare global {
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart?: Date;
  }
}

export default function Footer() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Tawk_API) {
      window.Tawk_API = {};
    }
  }, []);

  const openChat = () => {
    window.open('https://t.me/tttmvincomplaza', '_blank');
  };

  return (
    <div className="fixed z-50 bottom-0 left-0 right-0 bg-white text-gray-500 grid grid-cols-4 justify-around h-[60px] rounded-t-2xl shadow-lg">
      {[
        { icon: FaHome, label: "Trang chủ", link: '/' },
        { icon: FaPlaneDeparture, label: "Gửi đơn", link: '/giao-dich' },
        { icon: FaHistory, label: "Ví tiền", link: '/vi-tien' },
        { icon: FaRegUser, label: "Tài khoản", link: '/tai-khoan' },
      ].map((item, index) => {
        const isActive = pathname === item.link || 
                        (item.link !== '/' && pathname.startsWith(item.link));
        
        return (
          <Link 
            href={item.link} 
            key={index} 
            // onClick={item.event && item.event}
            className={`text-center p-[5px] flex flex-col items-center justify-center ${isActive ? '' : ''}`}
          >
            <div className="w-full h-1/2 flex justify-center items-center">
              <item.icon className={`text-base ${isActive ? 'text-red-500' : ''}`} />
            </div>
            <div className={`text-xs w-full h-1/2 flex justify-center items-center ${isActive ? 'text-red-500 font-bold' : ''}`}>
              {item.label}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
