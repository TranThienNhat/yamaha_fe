import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, App } from "antd";
import viVN from "antd/locale/vi_VN";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Yamaha Store",
  description: "Cửa hàng Yamaha",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AntdRegistry>
          <ConfigProvider
            locale={viVN}
            theme={{
              token: {
                zIndexPopupBase: 9999,
                colorPrimary: "#FF0000",
                colorLink: "#065fd4",
                colorLinkHover: "#FF0000",
                borderRadius: 12,
                fontFamily:
                  '"Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
              },
            }}>
            <App>{children}</App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
