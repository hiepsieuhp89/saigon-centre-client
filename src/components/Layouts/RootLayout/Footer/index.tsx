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
    <div className="fixed z-50 bottom-0 left-0 right-0 bg-black text-white grid grid-cols-5 justify-around h-[60px]">
      {[
        { icon: FaHome, label: "Trang chủ", link: '/' },
        { icon: FaHistory, label: "Lịch sử", link: '/lich-su' },
        { icon: FaPlaneDeparture, label: "Giao dịch", link: '/giao-dich' },
        { icon: FaPhoneVolume, label: "CSKH", link: "#", event: openChat },
        { icon: FaRegUser, label: "Tài khoản", link: '/tai-khoan' },
      ].map((item, index) => {
        const isActive = pathname === item.link || 
                        (item.link !== '/' && pathname.startsWith(item.link));
        
        return (
          <Link 
            href={item.link} 
            key={index} 
            onClick={item.event && item.event}
            className={`text-center p-[5px] flex flex-col items-center justify-center ${isActive ? 'bg-gray-800 font-bold' : ''}`}
          >
            <div className="w-full h-1/2 flex justify-center items-center">
              <item.icon className={`text-base ${isActive ? 'text-blue-400' : ''}`} />
            </div>
            <div className={`text-xs w-full h-1/2 flex justify-center items-center ${isActive ? 'font-bold' : ''}`}>
              {item.label}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
