// API Base URL
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

// Trạng thái đơn hàng
export enum TrangThaiDonHang {
  CHO_XU_LY = "Chờ xử lý",
  DA_XAC_NHAN = "Đã xác nhận",
  DANG_GIAO = "Đang giao hàng",
  DA_GIAO = "Đã giao hàng",
  DA_HUY = "Đã hủy",
}

// Vai trò người dùng
export enum VaiTro {
  ADMIN = "admin",
  KHACH_HANG = "khach_hang",
}

// Local storage keys
export const STORAGE_KEYS = {
  USER: "user",
  TOKEN: "token",
};
