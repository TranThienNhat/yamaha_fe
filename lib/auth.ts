import Cookies from "js-cookie";
import type { NguoiDung } from "./types";
import { STORAGE_KEYS, VaiTro } from "./constants";

export const authUtils = {
  // Lưu thông tin người dùng
  setUser: (user: NguoiDung) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      Cookies.set(STORAGE_KEYS.USER, JSON.stringify(user), { expires: 7 });
    }
  },

  // Lấy thông tin người dùng
  getUser: (): NguoiDung | null => {
    if (typeof window !== "undefined") {
      const userStr =
        localStorage.getItem(STORAGE_KEYS.USER) ||
        Cookies.get(STORAGE_KEYS.USER);
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  // Xóa thông tin người dùng
  removeUser: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.USER);
      Cookies.remove(STORAGE_KEYS.USER);
    }
  },

  // Kiểm tra đã đăng nhập
  isAuthenticated: (): boolean => {
    return authUtils.getUser() !== null;
  },

  // Kiểm tra là admin
  isAdmin: (): boolean => {
    const user = authUtils.getUser();
    return user?.vai_tro === VaiTro.ADMIN;
  },

  // Đăng xuất
  logout: () => {
    authUtils.removeUser();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },
};
