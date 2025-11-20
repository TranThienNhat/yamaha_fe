import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bỏ qua lỗi để build nhanh
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },

  // Cấu hình ảnh
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "163.223.13.199",
        port: "",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
  },

  // --- QUAN TRỌNG: CẤU HÌNH PROXY ---
  async rewrites() {
    return [
      {
        // Khi Frontend gọi: /api/nguoidung/dangnhap
        source: "/api/:path*",
        // Vercel sẽ âm thầm gọi sang: http://163.223.13.199/nguoidung/dangnhap
        destination: "http://163.223.13.199/:path*",
      },
    ];
  },
};

export default nextConfig;
