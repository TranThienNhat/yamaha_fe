// Types cho ứng dụng

export interface NguoiDung {
  id: number;
  ten_dang_nhap: string;
  email?: string;
  ho_ten?: string;
  sdt?: string;
  vai_tro: string;
}

export interface SanPham {
  id: number;
  ten_san_pham: string;
  gia: number;
  mo_ta?: string;
  hinh_anh?: string;
  hinh_anh_url?: string;
  ten_danh_muc?: string;
  thong_so_ky_thuat?: string;
  noi_bat?: boolean;
}

export interface DanhMuc {
  id: number;
  ten_danh_muc: string;
}

export interface ChiTietGioHang {
  id: number;
  ma_san_pham: number;
  ten_san_pham: string;
  gia: number;
  so_luong: number;
  thanh_tien: number;
}

export interface GioHang {
  ma_gio_hang: number;
  ma_nguoi_dung: number;
  chi_tiet: ChiTietGioHang[];
}

export interface ChiTietDonHang {
  id: number;
  ma_san_pham: number;
  ten_san_pham: string;
  so_luong: number;
  don_gia: number;
  thanh_tien: number;
}

export interface DonHang {
  id: number;
  ma_nguoi_dung?: number;
  ten_khach_hang: string;
  so_dien_thoai: string;
  dia_chi: string;
  ngay_dat: string;
  tong_gia: number;
  trang_thai: string;
  chi_tiet?: ChiTietDonHang[];
}

export interface TinTuc {
  id: number;
  tieu_de: string;
  noi_dung?: string;
  hinh_anh?: string;
  hinh_anh_url?: string;
  ngay_tao: string;
  noi_bat?: boolean;
}

export interface Banner {
  id: number;
  tieu_de: string;
  hinh_anh: string;
  hinh_anh_url: string;
  link?: string;
  vi_tri: number;
  thu_tu: number;
  trang_thai: boolean;
  ngay_tao: string;
}

export interface DangKyData {
  ten_dang_nhap: string;
  mat_khau: string;
  email?: string;
  ho_ten?: string;
  sdt?: string;
}

export interface DangNhapData {
  ten_dang_nhap: string;
  mat_khau: string;
}
