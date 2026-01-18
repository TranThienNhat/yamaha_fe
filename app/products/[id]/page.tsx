"use client";

import { useEffect, useState } from "react";
import {
  Layout,
  Card,
  Button,
  InputNumber,
  Image,
  Space,
  App,
  Tabs,
} from "antd";
import { ShoppingCartOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import { sanPhamAPI, gioHangAPI } from "@/lib/api";
import { authUtils } from "@/lib/auth";
import type { SanPham } from "@/lib/types";
import BannerAd from "@/components/BannerAd";

const { Content } = Layout;

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { message } = App.useApp();
  const [sanPham, setSanPham] = useState<SanPham | null>(null);
  const [hinhAnhs, setHinhAnhs] = useState<unknown[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [soLuong, setSoLuong] = useState(1);
  const [loading, setLoading] = useState(true);
  const user = authUtils.getUser();

  useEffect(() => {
    if (params.id) {
      fetchSanPham(Number(params.id));
      fetchHinhAnhs(Number(params.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const fetchSanPham = async (id: number) => {
    try {
      const response = await sanPhamAPI.layTheoId(id);
      setSanPham(response.data);
    } catch (error) {
      message.error("Không thể tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const fetchHinhAnhs = async (id: number) => {
    try {
      const response = await sanPhamAPI.layHinhAnh(id);
      setHinhAnhs(response.data);
    } catch (error) {
      console.log("Không có ảnh bổ sung");
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      message.warning("Vui lòng đăng nhập");
      router.push(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    if (!sanPham) return;

    // Kiểm tra tồn kho
    if (sanPham.so_luong !== undefined && sanPham.so_luong <= 0) {
      message.error("Sản phẩm đã hết hàng");
      return;
    }

    if (sanPham.so_luong !== undefined && soLuong > sanPham.so_luong) {
      message.error(`Chỉ còn ${sanPham.so_luong} sản phẩm trong kho`);
      return;
    }

    try {
      await gioHangAPI.themSanPham(user.id, {
        ma_san_pham: sanPham.id,
        so_luong: soLuong,
      });
      message.success("Thêm vào giỏ hàng thành công");
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Không thể thêm vào giỏ hàng");
      }
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      message.warning("Vui lòng đăng nhập");
      router.push(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    if (!sanPham) return;

    // Kiểm tra tồn kho
    if (sanPham.so_luong !== undefined && sanPham.so_luong <= 0) {
      message.error("Sản phẩm đã hết hàng");
      return;
    }

    if (sanPham.so_luong !== undefined && soLuong > sanPham.so_luong) {
      message.error(`Chỉ còn ${sanPham.so_luong} sản phẩm trong kho`);
      return;
    }

    try {
      await gioHangAPI.themSanPham(user.id, {
        ma_san_pham: sanPham.id,
        so_luong: soLuong,
      });
      message.success("Đang chuyển đến giỏ hàng...");
      router.push("/cart");
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Không thể mua hàng");
      }
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (!sanPham) return <div>Không tìm thấy sản phẩm</div>;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "50px" }}>
        {/* Banner Chi tiết sản phẩm - Vị trí 2 */}
        <BannerAd viTri={2} height={300} />

        <div style={{ maxWidth: 1200, margin: "0 auto", marginTop: 24 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.back()}
            style={{ marginBottom: 24 }}
            size="large">
            Quay lại
          </Button>

          <Card>
            <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
              {/* Cột ảnh bên trái */}
              <div style={{ flex: "1 1 400px", minWidth: 300 }}>
                <Image.PreviewGroup>
                  {/* Ảnh chính */}
                  <div style={{ marginBottom: 16 }}>
                    <Image
                      src={
                        (hinhAnhs && hinhAnhs.length > 0
                          ? hinhAnhs[selectedImageIndex]?.hinh_anh_url
                          : sanPham.hinh_anh_url) || "/placeholder.png"
                      }
                      alt={sanPham.ten_san_pham}
                      style={{
                        width: "100%",
                        height: 400,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                  </div>

                  {/* Thumbnail ảnh phụ */}
                  {hinhAnhs && hinhAnhs.length > 1 && (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {hinhAnhs.map((img: unknown, idx: number) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedImageIndex(idx)}
                          style={{
                            width: 80,
                            height: 80,
                            cursor: "pointer",
                            borderRadius: 4,
                            border:
                              selectedImageIndex === idx
                                ? "3px solid #1890ff"
                                : "2px solid #f0f0f0",
                            overflow: "hidden",
                            transition: "all 0.3s",
                          }}>
                          <img
                            src={img?.hinh_anh_url || "/placeholder.png"}
                            alt={`${sanPham.ten_san_pham} - ${idx + 1}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </Image.PreviewGroup>
              </div>

              {/* Cột thông tin bên phải */}
              <div style={{ flex: "1 1 500px" }}>
                <h1 style={{ fontSize: 28, marginBottom: 8 }}>
                  {sanPham.ten_san_pham}
                </h1>

                {sanPham.mo_ta && (
                  <p style={{ color: "#666", marginBottom: 16 }}>
                    {sanPham.mo_ta}
                  </p>
                )}

                <h2
                  style={{
                    color: "#ff4d4f",
                    fontSize: 36,
                    fontWeight: "bold",
                    marginBottom: 16,
                  }}>
                  {sanPham.gia.toLocaleString("vi-VN")} VNĐ
                </h2>

                {/* Thông tin tồn kho */}
                <div style={{ marginBottom: 24 }}>
                  {sanPham.so_luong !== undefined && (
                    <div style={{ marginBottom: 8 }}>
                      <span style={{ fontWeight: "bold" }}>Tình trạng: </span>
                      {sanPham.so_luong > 0 ? (
                        <span style={{ color: "#52c41a" }}>
                          Còn hàng ({sanPham.so_luong} sản phẩm)
                        </span>
                      ) : (
                        <span style={{ color: "#ff4d4f" }}>Hết hàng</span>
                      )}
                    </div>
                  )}

                  {sanPham.so_luong && sanPham.so_luong > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <span style={{ marginRight: 8 }}>Số lượng:</span>
                      <InputNumber
                        min={1}
                        max={sanPham.so_luong}
                        value={soLuong}
                        onChange={(value) => setSoLuong(value || 1)}
                        style={{ width: 80 }}
                      />
                    </div>
                  )}
                </div>

                {/* Tabs Mô tả và Thông số */}
                <Tabs
                  defaultActiveKey="1"
                  items={[
                    {
                      key: "1",
                      label: "Mô Tả",
                      children: (
                        <div style={{ minHeight: 100 }}>
                          {sanPham.mo_ta || "Chưa có mô tả chi tiết"}
                        </div>
                      ),
                    },
                    {
                      key: "2",
                      label: "Thông Số Kỹ Thuật",
                      children: (
                        <div style={{ whiteSpace: "pre-line", minHeight: 100 }}>
                          {sanPham.thong_so_ky_thuat ||
                            "Chưa có thông số kỹ thuật"}
                        </div>
                      ),
                    },
                  ]}
                />

                {/* Nút hành động */}
                <div style={{ marginTop: 32 }}>
                  <Space size="middle" style={{ width: "100%" }}>
                    <Button
                      type="primary"
                      danger
                      size="large"
                      disabled={
                        sanPham.so_luong !== undefined && sanPham.so_luong <= 0
                      }
                      style={{
                        height: 50,
                        fontSize: 16,
                        fontWeight: "bold",
                        flex: 1,
                      }}
                      onClick={handleBuyNow}>
                      {sanPham.so_luong !== undefined && sanPham.so_luong <= 0
                        ? "HẾT HÀNG"
                        : "MUA NGAY"}
                    </Button>
                    <Button
                      size="large"
                      icon={<ShoppingCartOutlined />}
                      disabled={
                        sanPham.so_luong !== undefined && sanPham.so_luong <= 0
                      }
                      style={{ height: 50, fontSize: 16, flex: 1 }}
                      onClick={handleAddToCart}>
                      THÊM VÀO GIỎ
                    </Button>
                  </Space>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Content>
    </Layout>
  );
}
