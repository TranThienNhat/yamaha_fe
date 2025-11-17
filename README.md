# 🏍️ YAMAHA E-Commerce Frontend

> Hệ thống quản lý và bán hàng xe máy Yamaha - Giao diện người dùng

---

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Công nghệ](#công-nghệ)
- [Cài đặt](#cài-đặt)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Tính năng](#tính-năng)
- [Hướng dẫn sử dụng](#hướng-dẫn-sử-dụng)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Giới thiệu

Website bán xe máy Yamaha với đầy đủ tính năng:

- 🛒 Mua sắm trực tuyến
- 📰 Tin tức & khuyến mãi
- 👤 Quản lý tài khoản
- 🎨 Giao diện hiện đại (YouTube-style)
- 🔐 Admin Panel quản lý toàn diện

---

## 🛠️ Công nghệ

### Core:

- **Next.js 15** - React Framework
- **TypeScript** - Type safety
- **Ant Design** - UI Components
- **Axios** - HTTP Client

### Styling:

- **CSS-in-JS** - Inline styles
- **Ant Design Theme** - Customization

### State Management:

- **React Hooks** - useState, useEffect
- **Local Storage** - Authentication

---

## 📦 Cài đặt

### Yêu cầu:

- Node.js >= 18.x
- npm hoặc yarn
- Backend API đang chạy (port 5000)

### Các bước:

```bash
# 1. Di chuyển vào thư mục frontend
cd yamaha_fe

# 2. Cài đặt dependencies
npm install

# 3. Tạo file .env.local
# Copy từ .env.example hoặc tạo mới:
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local

# 4. Chạy development server
npm run dev
```

---

## 🚀 Chạy ứng dụng

### Development:

```bash
npm run dev
```

→ Mở: http://localhost:3000

### Production:

```bash
# Build
npm run build

# Start
npm start
```

### Restart nhanh (Windows):

```powershell
.\restart-dev.ps1
```

---

## 📁 Cấu trúc dự án

```
yamaha_fe/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Trang chủ
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   │
│   ├── login/                    # Đăng nhập
│   │   └── page.tsx
│   ├── register/                 # Đăng ký
│   │   └── page.tsx
│   │
│   ├── products/                 # Sản phẩm
│   │   ├── page.tsx              # Danh sách
│   │   └── [id]/page.tsx         # Chi tiết
│   │
│   ├── news/                     # Tin tức
│   │   ├── page.tsx              # Danh sách
│   │   └── [id]/page.tsx         # Chi tiết
│   │
│   ├── cart/                     # Giỏ hàng
│   │   └── page.tsx
│   ├── orders/                   # Đơn hàng
│   │   └── page.tsx
│   ├── profile/                  # Thông tin cá nhân
│   │   └── page.tsx
│   │
│   └── admin/                    # Admin Panel
│       ├── layout.tsx            # Admin layout
│       ├── page.tsx              # Dashboard
│       ├── products/             # Quản lý sản phẩm
│       ├── categories/           # Quản lý danh mục
│       ├── orders/               # Quản lý đơn hàng
│       ├── news/                 # Quản lý tin tức
│       ├── banners/              # Quản lý banner
│       └── users/                # Quản lý người dùng
│
├── components/                   # React Components
│   ├── MainLayout.tsx            # Layout chính
│   ├── Sidebar.tsx               # Sidebar component
│   ├── BannerAd.tsx              # Banner component
│   ├── HtmlEditorWithUpload.tsx  # Rich text editor
│   │
│   └── layout/                   # Layout components
│       ├── MainHeader.tsx        # Header
│       ├── MainSidebar.tsx       # Sidebar menu
│       └── ...
│
├── lib/                          # Utilities
│   ├── api.ts                    # API functions
│   ├── auth.ts                   # Authentication utils
│   ├── types.ts                  # TypeScript types
│   └── constants.ts              # Constants
│
├── public/                       # Static files
│   └── ...
│
├── .env.local                    # Environment variables
├── next.config.ts                # Next.js config
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies
```

---

## ✨ Tính năng

### 🌐 Người dùng (User)

#### 1. Trang chủ

- Banner carousel tự động
- Sản phẩm nổi bật
- Tin tức mới nhất
- Giao diện YouTube-style

#### 2. Sản phẩm

- Danh sách sản phẩm với grid layout
- Tìm kiếm theo tên
- Lọc theo danh mục
- Chi tiết sản phẩm đầy đủ
- Thêm vào giỏ hàng
- Mua ngay

#### 3. Tin tức

- Danh sách tin tức
- Chi tiết bài viết
- Hiển thị HTML content
- Banner quảng cáo

#### 4. Giỏ hàng

- Xem sản phẩm trong giỏ
- Cập nhật số lượng
- Xóa sản phẩm
- Tính tổng tiền
- Đặt hàng

#### 5. Đơn hàng

- Lịch sử đơn hàng
- Trạng thái đơn hàng
- Chi tiết đơn hàng

#### 6. Tài khoản

- Đăng ký
- Đăng nhập
- Thông tin cá nhân
- Đổi mật khẩu
- Đăng xuất

### 🔐 Admin Panel

#### 1. Dashboard

- Thống kê tổng quan
- Doanh thu
- Đơn hàng mới
- Sản phẩm bán chạy

#### 2. Quản lý Sản phẩm

- CRUD sản phẩm
- Upload ảnh sản phẩm
- Upload nhiều ảnh
- Quản lý thông số kỹ thuật
- Đánh dấu nổi bật

#### 3. Quản lý Danh mục

- CRUD danh mục
- Gán sản phẩm vào danh mục

#### 4. Quản lý Đơn hàng

- Xem tất cả đơn hàng
- Cập nhật trạng thái
- Chi tiết đơn hàng
- Xóa đơn hàng

#### 5. Quản lý Tin tức

- CRUD tin tức
- Upload ảnh
- Rich text editor
- Đánh dấu nổi bật

#### 6. Quản lý Banner

- CRUD banner
- Upload ảnh banner
- Chọn vị trí hiển thị
- Sắp xếp thứ tự
- Bật/tắt hiển thị
- Link liên kết

#### 7. Quản lý Người dùng

- Xem danh sách người dùng
- Phân quyền
- Xóa người dùng

---

## 📖 Hướng dẫn sử dụng

### 🎨 Giao diện chính

#### Layout YouTube-style:

```
┌─────────────────────────────────────────────────┐
│ [☰] YAMAHA    [Search Bar]    [🔔 🛒 👤]      │ ← Header (56px)
├─────────────────────────────────────────────────┤
│ ┌──────┐ │                                      │
│ │ 🏠   │ │  Content Area                        │
│ │ 📦   │ │  - Trang chủ                         │
│ │ 📰   │ │  - Sản phẩm                          │
│ │ 🔥   │ │  - Tin tức                           │
│ └──────┘ │  - etc.                              │
│ Sidebar  │                                      │
│ (240px)  │                                      │
└──────────┴──────────────────────────────────────┘
```

#### Đặc điểm:

- Header cố định (fixed)
- Sidebar có thể thu gọn
- Content responsive
- Smooth animations
- Hover effects

### 🛒 Mua hàng

#### Bước 1: Đăng nhập

```
1. Click "Đăng nhập" ở header
2. Nhập tên đăng nhập & mật khẩu
3. Hoặc click "Đăng ký" nếu chưa có tài khoản
```

#### Bước 2: Chọn sản phẩm

```
1. Vào trang "Sản phẩm"
2. Tìm kiếm hoặc lọc theo danh mục
3. Click vào sản phẩm để xem chi tiết
```

#### Bước 3: Thêm vào giỏ

```
1. Click "Thêm vào giỏ" hoặc "Mua ngay"
2. Xem giỏ hàng (icon 🛒)
3. Cập nhật số lượng nếu cần
```

#### Bước 4: Đặt hàng

```
1. Click "Đặt hàng" trong giỏ hàng
2. Điền thông tin giao hàng
3. Xác nhận đơn hàng
4. Theo dõi trong "Đơn hàng của tôi"
```

### 🎨 Quản lý Banner

#### Vị trí Banner:

```
Vị trí 1: Trang chủ (Banner chính)
Vị trí 2: Trang sản phẩm
Vị trí 3: Trang tin tức
Vị trí 4: (Dự phòng)
Vị trí 5: Sidebar
```

#### Thêm Banner:

```
1. Vào Admin Panel → Quảng cáo
2. Click "Thêm banner"
3. Điền thông tin:
   - Tiêu đề
   - Upload ảnh (1920x360px)
   - Chọn vị trí
   - Thứ tự hiển thị
   - Bật trạng thái
4. Click "Lưu"
```

#### Kích thước ảnh đề xuất:

- Trang chủ: 1920x400px
- Sản phẩm/Tin tức: 1920x360px
- Sidebar: 300x600px

### 📝 Quản lý Tin tức

#### Thêm tin tức:

```
1. Vào Admin Panel → Tin tức
2. Click "Thêm tin tức"
3. Điền:
   - Tiêu đề
   - Upload ảnh đại diện
   - Nội dung (Rich text editor)
4. Upload ảnh trong nội dung:
   - Click icon ảnh trong editor
   - Chọn file
   - Ảnh tự động upload lên server
5. Click "Lưu"
```

### 📦 Quản lý Sản phẩm

#### Thêm sản phẩm:

```
1. Vào Admin Panel → Sản phẩm
2. Click "Thêm sản phẩm"
3. Điền:
   - Tên sản phẩm
   - Giá
   - Danh mục
   - Mô tả
   - Upload ảnh chính
   - Upload nhiều ảnh
   - Thông số kỹ thuật
4. Click "Lưu"
```

---

## 🔌 API Endpoints

### Base URL:

```
http://localhost:5000
```

### Authentication:

```typescript
POST /nguoidung/dangky      // Đăng ký
POST /nguoidung/dangnhap    // Đăng nhập
GET  /nguoidung/:id         // Thông tin user
PUT  /nguoidung/:id         // Cập nhật user
```

### Products:

```typescript
GET    /sanpham             // Lấy tất cả
GET    /sanpham/noibat      // Sản phẩm nổi bật
GET    /sanpham/:id         // Chi tiết
POST   /sanpham             // Thêm (Admin)
PUT    /sanpham/:id         // Sửa (Admin)
DELETE /sanpham/:id         // Xóa (Admin)
```

### Categories:

```typescript
GET    /danhmuc             // Lấy tất cả
POST   /danhmuc             // Thêm (Admin)
PUT    /danhmuc/:id         // Sửa (Admin)
DELETE /danhmuc/:id         // Xóa (Admin)
```

### Cart:

```typescript
GET    /giohang/:userId           // Lấy giỏ hàng
POST   /giohang/:userId/them      // Thêm sản phẩm
PUT    /giohang/chitiet/:id       // Cập nhật số lượng
DELETE /giohang/chitiet/:id       // Xóa sản phẩm
```

### Orders:

```typescript
GET    /donhang                   // Tất cả (Admin)
GET    /donhang/nguoidung/:userId // Của user
GET    /donhang/:id               // Chi tiết
POST   /donhang                   // Tạo đơn
PUT    /donhang/:id/trangthai     // Cập nhật (Admin)
DELETE /donhang/:id               // Xóa (Admin)
```

### News:

```typescript
GET    /tintuc              // Lấy tất cả
GET    /tintuc/noibat       // Tin nổi bật
GET    /tintuc/:id          // Chi tiết
POST   /tintuc              // Thêm (Admin)
PUT    /tintuc/:id          // Sửa (Admin)
DELETE /tintuc/:id          // Xóa (Admin)
```

### Banners:

```typescript
GET    /banner              // Lấy tất cả
GET    /banner/:viTri       // Theo vị trí
GET    /banner/detail/:id   // Chi tiết
POST   /banner              // Thêm (Admin)
PUT    /banner/:id          // Sửa (Admin)
PUT    /banner/:id/trangthai // Bật/tắt (Admin)
DELETE /banner/:id          // Xóa (Admin)
```

### Upload:

```typescript
POST /upload/image          // Upload 1 ảnh
POST /upload/images         // Upload nhiều ảnh
GET  /uploads/:filename     // Lấy ảnh
```

---

## 🐛 Troubleshooting

### Lỗi: Cannot connect to backend

```bash
# Kiểm tra backend đang chạy
curl http://localhost:5000

# Kiểm tra .env.local
cat .env.local
# Phải có: NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Lỗi: Module not found

```bash
# Xóa node_modules và cài lại
rm -rf node_modules
npm install
```

### Lỗi: Port 3000 already in use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Hoặc dùng port khác
npm run dev -- -p 3001
```

### Lỗi: Chunk load error

```bash
# Clear cache và rebuild
rm -rf .next
npm run dev
```

### Banner không hiển thị

```
Kiểm tra:
1. ✅ Đã tạo banner trong Admin Panel?
2. ✅ Trạng thái banner có BẬT?
3. ✅ Vị trí banner có ĐÚNG?
4. ✅ File ảnh có tồn tại trong /uploads?

Test API:
curl http://localhost:5000/banner/1
```

### Ảnh không hiển thị

```
Kiểm tra:
1. Backend uploads folder có file không?
2. URL ảnh đúng format: http://localhost:5000/uploads/filename.jpg
3. CORS có được config đúng không?
```

### Login không hoạt động

```
Kiểm tra:
1. Backend API /nguoidung/dangnhap hoạt động?
2. Credentials đúng?
3. Browser console có lỗi?
4. Local storage có lưu user data?
```

---

## 🔐 Tài khoản mặc định

### Admin:

```
Username: admin
Password: admin123
```

### User:

```
Username: user
Password: user123
```

---

## 📝 Environment Variables

### .env.local:

```bash
# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Optional
NEXT_PUBLIC_SITE_NAME=Yamaha Vietnam
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🎨 Customization

### Thay đổi màu chủ đạo:

```css
/* app/globals.css */
--primary-red: #FF0000
--primary-blue: #065fd4
--text-primary: #030303
```

### Thay đổi logo:

```tsx
// components/layout/MainHeader.tsx
<div>🏍️</div> // Thay emoji hoặc dùng <img>
```

### Thay đổi layout:

```tsx
// components/MainLayout.tsx
// Điều chỉnh width, height, spacing
```

---

## 📚 Tài liệu tham khảo

- [Next.js Documentation](https://nextjs.org/docs)
- [Ant Design Components](https://ant.design/components/overview/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)

---

## 🤝 Đóng góp

### Quy trình:

1. Fork repository
2. Tạo branch mới: `git checkout -b feature/ten-tinh-nang`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push to branch: `git push origin feature/ten-tinh-nang`
5. Tạo Pull Request

### Code Style:

- Sử dụng TypeScript
- Follow ESLint rules
- Component names: PascalCase
- File names: kebab-case hoặc PascalCase
- Indent: 2 spaces

---

## 📄 License

MIT License - Tự do sử dụng cho mục đích học tập và thương mại.

---

## 📞 Liên hệ

- **Email**: support@yamaha.com.vn
- **Website**: https://yamaha.com.vn
- **Hotline**: 1900-xxxx

---

## 🎉 Credits

Developed with ❤️ by Yamaha Vietnam Team

**Version**: 1.0.0  
**Last Updated**: November 2024

---

**Happy Coding! 🚀**
