/* eslint-disable @next/next/no-img-element */
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Marquee from "react-fast-marquee";
import { FaChevronLeft, FaChevronRight, FaVolumeUp } from "react-icons/fa";
import { useRef } from "react";
import { Swiper as SwiperType } from "swiper";

export default function BannerHomePage() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <>
      <div className="relative w-full h-[300px]">
        {/* Custom Previous Button */}
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10  text-white p-2 rounded-full"
        >
          <FaChevronLeft className="w-6 h-6" />
        </button>

        {/* Custom Next Button */}
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10  text-white p-2 rounded-full"
        >
          <FaChevronRight className="w-6 h-6" />
        </button>

        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)} // Store swiper instance
          cssMode={true}
          pagination={true}
          loop={true}
          modules={[Navigation]}
          className="mySwiper w-full h-[300px]"
        >
          <SwiperSlide>
            <img
              className="w-full h-full object-cover"
              src="/images/sliders/1.jpg"
              alt=""
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="w-full h-full object-cover"
              src="/images/sliders/2.jpg"
              alt=""
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="w-full h-full object-cover"
              src="/images/sliders/3.jpg"
              alt=""
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              className="w-full h-full object-cover"
              src="/images/sliders/4.png"
              alt=""
            />
          </SwiperSlide>
        </Swiper>
      </div>

      <div className="mt-2 h-[38px] p-[5px] text-gray-600 flex items-center bg-[#E0DEDE]">
        <FaVolumeUp className="mr-2" />
        <Marquee>
          Chương trình khuyến mãi Gian hàng ghép đôi thưởng ngay $10 cho mỗi cặp
          đôi khi đăng ký và mở thành công gian hàng ghép đôi. Vui lòng liên hệ
          dịch vụ CSKH để tìm hiểu thêm!
        </Marquee>
      </div>
    </>
  );
}
