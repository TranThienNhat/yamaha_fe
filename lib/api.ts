import axios from "axios";
import { API_BASE_URL } from "./constants";
import type { DangKyData, DangNhapData } from "./types";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API Người dùng
export const nguoiDungAPI = {
  dangKy: (data: DangKyData) => api.post("/nguoidung/dangky", data),
  dangNhap: (data: DangNhapData) => api.post("/nguoidung/dangnhap", data),
  layThongTin: (id: number) => api.get(`/nguoidung/${id}`),
  layTatCa: () => api.get("/nguoidung"),
  capNhat: (id: number, data: any) => api.put(`/nguoidung/${id}`, data),
  doiMatKhau: (
    id: number,
    data: { mat_khau_cu: string; mat_khau_moi: string }
  ) => api.put(`/nguoidung/${id}/doimatkhau`, data),
  xoa: (id: number) => api.delete(`/nguoidung/${id}`),
};

// API Sản phẩm
export const sanPhamAPI = {
  layTatCa: () => api.get("/sanpham"),
  layNoiBat: (limit?: number) =>
    api.get("/sanpham/noibat", { params: { limit } }),
  layTheoId: (id: number) => api.get(`/sanpham/${id}`),
  layDanhMuc: (id: number) => api.get(`/sanpham/${id}/danhmuc`),
  layHinhAnh: (id: number) => api.get(`/sanpham/${id}/hinhanh`),
  them: (formData: FormData) =>
    api.post("/sanpham", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  sua: (id: number, formData: FormData) =>
    api.put(`/sanpham/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  xoa: (id: number) => api.delete(`/sanpham/${id}`),
};

// API Danh mục
export const danhMucAPI = {
  layTatCa: () => api.get("/danhmuc"),
  them: (data: { ten_danh_muc: string }) => api.post("/danhmuc", data),
  sua: (id: number, data: { ten_danh_muc: string }) =>
    api.put(`/danhmuc/${id}`, data),
  xoa: (id: number) => api.delete(`/danhmuc/${id}`),
};

// API Giỏ hàng
export const gioHangAPI = {
  layGioHang: (maNguoiDung: number) => api.get(`/giohang/${maNguoiDung}`),
  themSanPham: (
    maNguoiDung: number,
    data: { ma_san_pham: number; so_luong: number }
  ) => api.post(`/giohang/${maNguoiDung}/them`, data),
  capNhatSoLuong: (maChiTiet: number, data: { so_luong: number }) =>
    api.put(`/giohang/chitiet/${maChiTiet}`, data),
  xoaSanPham: (maChiTiet: number) =>
    api.delete(`/giohang/chitiet/${maChiTiet}`),
  xoaGioHang: (maNguoiDung: number) => api.delete(`/giohang/${maNguoiDung}`),
};

// API Đơn hàng
export const donHangAPI = {
  layTatCa: () => api.get("/donhang"),
  layTheoId: (id: number) => api.get(`/donhang/${id}`),
  layTheoNguoiDung: (maNguoiDung: number) =>
    api.get(`/donhang/nguoidung/${maNguoiDung}`),
  tao: (data: any) => api.post("/donhang", data),
  capNhatTrangThai: (id: number, data: { trang_thai: string }) =>
    api.put(`/donhang/${id}/trangthai`, data),
  xoa: (id: number) => api.delete(`/donhang/${id}`),
};

// API Tin tức
export const tinTucAPI = {
  layTatCa: () => api.get("/tintuc"),
  layNoiBat: (limit?: number) =>
    api.get("/tintuc/noibat", { params: { limit } }),
  layTheoId: (id: number) => api.get(`/tintuc/${id}`),
  them: (formData: FormData) =>
    api.post("/tintuc", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  sua: (id: number, formData: FormData) =>
    api.put(`/tintuc/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  xoa: (id: number) => api.delete(`/tintuc/${id}`),
};

export default api;

// API Upload
export const uploadAPI = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  uploadImages: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return api.post("/upload/images", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  getUploadedImages: () => api.get("/upload/images"),
};

// API Banner/Quảng cáo
export const bannerAPI = {
  layTatCa: () => api.get("/banner"),
  layTheoViTri: (viTri: number) => api.get(`/banner/${viTri}`),
  layTheoId: (id: number) => api.get(`/banner/detail/${id}`),
  them: (formData: FormData) =>
    api.post("/banner", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  sua: (id: number, formData: FormData) =>
    api.put(`/banner/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  capNhatTrangThai: (id: number, data: { trang_thai: boolean }) =>
    api.put(`/banner/${id}/trangthai`, data),
  xoa: (id: number) => api.delete(`/banner/${id}`),
};
