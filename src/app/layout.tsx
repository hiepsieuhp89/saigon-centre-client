import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import RootLayout from "@/components/Layouts/RootLayout";
import { UserProvider } from "@/context/useUserContext";
import { ReactQueryProvider } from "@/provider/ReactQueryProvider";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Saigon Centre",
  description: "Discover Saigon Centre, your premier destination for shopping, dining, and entertainment in the heart of Ho Chi Minh City. Explore a world of luxury, culture, and convenience.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          <UserProvider>
            <RootLayout>{children}</RootLayout>
            <Toaster position="top-center" />
          </UserProvider>
        </ReactQueryProvider>
        <Script
          id="tawkto"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
      var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
        (function(){
        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
        s1.async=true;
        s1.src='https://embed.tawk.to/67e0ced16ee14119080f412f/1in32fp1e';
        s1.charset='UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1,s0);
        })();
      Tawk_API.customStyle = {
		visibility : {
			desktop : {
				position : 'br',
				xOffset : '60px',
				yOffset : '100px'
			},
			mobile : {
				position : 'br',
				xOffset : 0,
				yOffset : 70
			},
			bubble : {
				rotate : '0deg',
			 	xOffset : -20,
			 	yOffset : 0
			}
		}
	};
      Tawk_API.onLoad = function() {
        function applyStyle() {
          var iframe = document.querySelector('#tawkchat-container iframe');
          var container = document.querySelector('#tawkchat-container');
          if (iframe) {
            iframe.style.bottom = '50px';
            iframe.style.position = 'fixed';
            iframe.style.zIndex = '9999';
          }
          if (container) {
            container.style.bottom = '50px';
            container.style.position = 'fixed';
            container.style.zIndex = '9999';
          }
        }
        applyStyle(); // Initial attempt
        setInterval(applyStyle, 500); // Re-apply every 500ms
      };
    `,
          }}
        />
      </body>
    </html>
  );
}
