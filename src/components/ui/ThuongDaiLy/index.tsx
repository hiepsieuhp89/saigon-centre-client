/* eslint-disable @next/next/no-img-element */
'use client';

import { fNumberMoney } from '@/utils/format-number';
import ThuNhap from '../ThuNhap';

const investmentLevels = [
  { level: 'Đại lý cấp 5', profit: '0.4%', amount: '$200' },
  { level: 'Đại lý cấp 4', profit: '0.6%', amount: '$1000' },
  { level: 'Đại lý cấp 3', profit: '0.8%', amount: '$3000' },
  { level: 'Đại lý cấp 2', profit: '1%', amount: '$5000' },
  { level: 'Đại lý cấp 1', profit: '1.2%', amount: '$10000' },
];

export default function InvestmentLevels() {
  // Function to determine color based on profit percentage
  const getProfitColor = (profitStr: string) => {
    const profitValue = parseFloat(profitStr.replace('%', ''));
    
    // Color mapping based on new profit values
    if (profitValue <= 0.4) return { bg: 'bg-green-50', text: 'text-green-500' };
    if (profitValue <= 0.6) return { bg: 'bg-green-100', text: 'text-green-600' };
    if (profitValue <= 0.8) return { bg: 'bg-green-200', text: 'text-green-700' };
    if (profitValue <= 1.0) return { bg: 'bg-green-300', text: 'text-green-800' };
    return { bg: 'bg-green-400', text: 'text-green-900' };
  };

  // Function to determine level name style based on level
  const getLevelNameStyle = (level: string) => {
    if (level === 'Đại lý cấp 5') return 'text-gray-800 font-normal';
    if (level === 'Đại lý cấp 4') return 'text-red-500 font-medium';
    if (level === 'Đại lý cấp 3') return 'text-red-600 font-semibold';
    if (level === 'Đại lý cấp 2') return 'text-red-700 font-bold';
    if (level === 'Đại lý cấp 1') return 'text-red-800 font-bold';
    return 'text-gray-800 font-normal';
  };

  return (
    <div className="max-w-4xl mx-auto mb-8 bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-center py-4">
        <h2 className="text-white font-bold text-xl">MỨC VỐN ĐẦU TƯ</h2>
      </div>

      <div className="p-6 space-y-4">
        {investmentLevels.map((item, index) => {
          const profitColor = getProfitColor(item.profit);
          const levelNameStyle = getLevelNameStyle(item.level);
          
          return (
            <div 
              key={index} 
              className="flex justify-between items-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-all duration-200 border-b last:border-b-0"
            >
              <div className="flex items-center space-x-3">
                <span className="w-8 h-8 flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-full font-medium">
                  {index + 1}
                </span>
                <div>
                  <span className={levelNameStyle}>{item.level}</span>
                  <span className="text-yellow-600 font-bold ml-2">{item.amount}</span>
                </div>
              </div>
              <div className={`${profitColor.bg} px-3 py-1 rounded-full w-36`}>
                <span className={`${profitColor.text} font-medium`}>Lợi nhuận: {item.profit}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative w-full h-64 overflow-hidden">
        <img
          src="/images/background.jpg"
          alt="SaigonCentre logo"
          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-center py-4">
        <h2 className="text-white font-bold text-xl">THU NHẬP ĐẠI LÝ</h2>
      </div>
      <ThuNhap />
    </div>
  );
}
