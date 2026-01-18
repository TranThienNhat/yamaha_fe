"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Select,
  Input,
  Space,
  Tag,
  Empty,
  App,
} from "antd";
import {
  ShoppingCartOutlined,
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { sanPhamAPI, gioHangAPI, danhMucAPI } from "@/lib/api";
import { authUtils } from "@/lib/auth";
import { formatPrice } from "@/lib/constants";
import type { SanPham, DanhMuc } from "@/lib/types";
import BannerAd from "@/components/BannerAd";
import MainLayout from "@/components/MainLayout";

const { Title, Text } = Typography;

export default function ProductsPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [sanPhams, setSanPhams] = useState<SanPham[]>([]);
  const [danhMucs, setDanhMucs] = useState<DanhMuc[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<SanPham[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "all">(
    "all"
  );
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(true);
  const user = authUtils.getUser();

  const fetchData = async () => {
    try {
      const [spRes, dmRes] = await Promise.all([
        sanPhamAPI.layTatCa(),
        danhMucAPI.layTatCa(),
      ]);

      // Lấy thông tin danh mục cho từng sản phẩm
      const sanPhamsWithCategory = await Promise.all(
        spRes.data.map(async (sp: SanPham) => {
          try {
            const categoryRes = await sanPhamAPI.layDanhMuc(sp.id);
            const categories = categoryRes.data as Array<{
              id: number;
              ten_danh_muc: string;
            }>;

            // Lấy danh mục đầu tiên nếu có nhiều danh mục
            const firstCategory =
              categories && categories.length > 0 ? categories[0] : null;

            return {
              ...sp,
              ma_danh_muc: firstCategory?.id,
              ten_danh_muc: firstCategory?.ten_danh_muc,
              danh_muc_ids: categories?.map((c) => c.id) || [],
            };
          } catch {
            return sp;
          }
        })
      );

      setSanPhams(sanPhamsWithCategory);
      setDanhMucs(dmRes.data);
      setFilteredProducts(sanPhamsWithCategory);
    } catch {
      message.error("Lỗi khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let filtered = sanPhams;

    // Lọc theo danh mục
    if (selectedCategory !== "all") {
      filtered = filtered.filter((sp) => {
        const danhMucIds = sp.danh_muc_ids || [];
        return danhMucIds.includes(selectedCategory as number);
      });
    }

    // Tìm kiếm theo tên
    if (searchText) {
      filtered = filtered.filter((sp) =>
        sp.ten_san_pham.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, searchText, sanPhams]);

  const handleAddToCart = async (e: React.MouseEvent, sanPham: SanPham) => {
    e.stopPropagation();

    if (!user) {
      message.warning("Vui lòng đăng nhập");
      router.push(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    try {
      await gioHangAPI.themSanPham(user.id, {
        ma_san_pham: sanPham.id,
        so_luong: 1,
      });
      message.success("Thêm vào giỏ hàng thành công");
    } catch {
      message.error("Không thể thêm vào giỏ hàng");
    }
  };

  const handleBuyNow = async (e: React.MouseEvent, sanPham: SanPham) => {
    e.stopPropagation();

    if (!user) {
      message.warning("Vui lòng đăng nhập");
      router.push(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    try {
      await gioHangAPI.themSanPham(user.id, {
        ma_san_pham: sanPham.id,
        so_luong: 1,
      });
      message.success("Đang chuyển đến giỏ hàng...");
      router.push("/cart");
    } catch {
      message.error("Không thể mua hàng");
    }
  };

  return (
    <MainLayout>
      <div style={{ padding: "24px" }}>
        {/* Banner Danh sách sản phẩm - Vị trí 2 */}
        <BannerAd viTri={2} height={360} />

        <div style={{ marginTop: 24 }}>
          {/* Header */}
          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: 12,
              marginBottom: 24,
              boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            }}>
            <Title
              level={4}
              style={{
                marginBottom: 20,
                fontWeight: 600,
                color: "#030303",
              }}>
              Danh sách sản phẩm
            </Title>

            {/* Filters */}
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <Input
                  size="large"
                  placeholder="Tìm kiếm sản phẩm..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ borderRadius: 8 }}
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  size="large"
                  style={{ width: "100%", borderRadius: 8 }}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  placeholder="Chọn danh mục"
                  suffixIcon={<FilterOutlined />}>
                  <Select.Option value="all">Tất cả danh mục</Select.Option>
                  {danhMucs.map((dm) => (
                    <Select.Option key={dm.id} value={dm.id}>
                      {dm.ten_danh_muc}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <Space>
                  <Text type="secondary">
                    Tìm thấy {filteredProducts.length} sản phẩm
                  </Text>
                </Space>
              </Col>
            </Row>
          </div>

          {/* Products Grid */}
          {loading ? (
            <Card
              style={{ borderRadius: 12, textAlign: "center", padding: 40 }}>
              <Text>Đang tải sản phẩm...</Text>
            </Card>
          ) : filteredProducts.length > 0 ? (
            <Row gutter={[16, 16]}>
              {filteredProducts.map((sp) => (
                <Col xs={24} sm={12} md={8} lg={6} key={sp.id}>
                  <Card
                    hoverable
                    cover={
                      <div
                        style={{
                          paddingTop: "56.25%",
                          position: "relative",
                          overflow: "hidden",
                          background: "#f0f0f0",
                          borderRadius: "12px 12px 0 0",
                          cursor: "pointer",
                        }}
                        onClick={() => router.push(`/products/${sp.id}`)}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          alt={sp.ten_san_pham}
                          src={sp.hinh_anh_url || "/placeholder.png"}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>
                    }
                    style={{
                      borderRadius: 12,
                      overflow: "hidden",
                      border: "none",
                      boxShadow: "none",
                      background: "#fff",
                      transition: "transform 0.2s",
                    }}
                    styles={{ body: { padding: 12 } }}
                    actions={[
                      <Button
                        key="buy"
                        type="primary"
                        danger
                        onClick={(e) => handleBuyNow(e, sp)}
                        style={{ borderRadius: 8, fontWeight: "bold" }}>
                        Mua ngay
                      </Button>,
                      <Button
                        key="add"
                        type="default"
                        icon={<ShoppingCartOutlined />}
                        onClick={(e) => handleAddToCart(e, sp)}
                        style={{ borderRadius: 8 }}>
                        Thêm vào giỏ
                      </Button>,
                    ]}>
                    {sp.ten_danh_muc && (
                      <Tag color="purple" style={{ marginBottom: 8 }}>
                        {sp.ten_danh_muc}
                      </Tag>
                    )}
                    <div
                      onClick={() => router.push(`/products/${sp.id}`)}
                      style={{ cursor: "pointer" }}>
                      <Title
                        level={5}
                        ellipsis={{ rows: 2 }}
                        style={{
                          marginBottom: 8,
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#030303",
                          lineHeight: "20px",
                        }}>
                        {sp.ten_san_pham}
                      </Title>
                      <Text
                        strong
                        style={{
                          color: "#FF0000",
                          fontSize: 16,
                          fontWeight: 600,
                        }}>
                        {formatPrice(sp.gia)}đ
                      </Text>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Card style={{ borderRadius: 12 }}>
              <Empty description="Không tìm thấy sản phẩm nào" />
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
