"use client";

import { useEffect, useState } from "react";
import { Card, Row, Col, Typography } from "antd";
import { FireOutlined, FileTextOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { sanPhamAPI, tinTucAPI } from "@/lib/api";
import { formatPrice } from "@/lib/constants";
import type { SanPham, TinTuc } from "@/lib/types";
import BannerAd from "@/components/BannerAd";
import MainLayout from "@/components/MainLayout";

const { Title, Text, Paragraph } = Typography;

export default function Home() {
  const router = useRouter();
  const [sanPhams, setSanPhams] = useState<SanPham[]>([]);
  const [tinTucs, setTinTucs] = useState<TinTuc[]>([]);
  const [productImages, setProductImages] = useState<{
    [key: number]: any[];
  }>({});
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const [spRes, ttRes] = await Promise.all([
        sanPhamAPI.layNoiBat(8),
        tinTucAPI.layNoiBat(8),
      ]);
      setSanPhams(spRes.data);
      setTinTucs(ttRes.data);

      // Load ảnh cho từng sản phẩm
      spRes.data.slice(0, 8).forEach(async (sp: SanPham) => {
        try {
          const imgRes = await sanPhamAPI.layHinhAnh(sp.id);
          if (imgRes.data && imgRes.data.length > 0) {
            setProductImages((prev) => ({ ...prev, [sp.id]: imgRes.data }));
          }
        } catch {
          // Không có ảnh bổ sung
        }
      });
    } catch {
      // Lỗi khi tải dữ liệu
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <MainLayout>
      <div style={{ padding: "24px" }}>
        {/* Banner */}
        <div style={{ marginBottom: 24 }}>
          <BannerAd viTri={1} height={360} />
        </div>

        {/* Sản Phẩm Bán Chạy */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 20,
              paddingBottom: 12,
              borderBottom: "1px solid #e5e5e5",
            }}>
            <FireOutlined
              style={{ fontSize: 24, color: "#FF0000", marginRight: 12 }}
            />
            <Title
              level={4}
              style={{
                margin: 0,
                fontWeight: 600,
                color: "#030303",
                fontSize: 20,
              }}>
              Sản Phẩm Bán Chạy
            </Title>
          </div>
          <Row gutter={[16, 16]}>
            {sanPhams.slice(0, 8).map((sp) => {
              const images = productImages[sp.id] || [];
              const displayImage =
                hoveredProduct === sp.id && images.length > 1
                  ? images[1]?.hinh_anh_url
                  : images.length > 0
                  ? images[0]?.hinh_anh_url
                  : sp.hinh_anh_url;

              return (
                <Col xs={24} sm={12} md={8} lg={6} key={sp.id}>
                  <Card
                    hoverable
                    onClick={() => router.push(`/products/${sp.id}`)}
                    onMouseEnter={() => setHoveredProduct(sp.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    style={{
                      borderRadius: 12,
                      overflow: "hidden",
                      border: "none",
                      boxShadow: "none",
                      background: "#fff",
                      transition: "transform 0.2s",
                    }}
                    styles={{ body: { padding: 12 } }}
                    cover={
                      <div
                        style={{
                          paddingTop: "56.25%",
                          position: "relative",
                          overflow: "hidden",
                          background: "#f0f0f0",
                          borderRadius: "12px 12px 0 0",
                        }}>
                        <img
                          alt={sp.ten_san_pham}
                          src={displayImage || "/placeholder.png"}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        {images.length > 1 && (
                          <div
                            style={{
                              position: "absolute",
                              bottom: 8,
                              right: 8,
                              background: "rgba(0,0,0,0.85)",
                              color: "white",
                              padding: "4px 8px",
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 500,
                            }}>
                            {images.length} ảnh
                          </div>
                        )}
                      </div>
                    }>
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
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>

        {/* Tin Tức & Khuyến Mãi */}
        {tinTucs.length > 0 && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: 20,
                paddingBottom: 12,
                borderBottom: "1px solid #e5e5e5",
              }}>
              <FileTextOutlined
                style={{ fontSize: 24, color: "#FF0000", marginRight: 12 }}
              />
              <Title
                level={4}
                style={{
                  margin: 0,
                  fontWeight: 600,
                  color: "#030303",
                  fontSize: 20,
                }}>
                Tin Tức & Khuyến Mãi
              </Title>
            </div>
            <Row gutter={[16, 16]}>
              {tinTucs.slice(0, 8).map((tt) => (
                <Col xs={24} sm={12} md={8} lg={6} key={tt.id}>
                  <Card
                    hoverable
                    onClick={() => router.push(`/news/${tt.id}`)}
                    style={{
                      borderRadius: 12,
                      overflow: "hidden",
                      border: "none",
                      boxShadow: "none",
                      background: "#fff",
                      transition: "transform 0.2s",
                    }}
                    styles={{ body: { padding: 12 } }}
                    cover={
                      tt.hinh_anh_url ? (
                        <div
                          style={{
                            paddingTop: "56.25%",
                            position: "relative",
                            overflow: "hidden",
                            background: "#f0f0f0",
                            borderRadius: "12px 12px 0 0",
                          }}>
                          <img
                            alt={tt.tieu_de}
                            src={tt.hinh_anh_url}
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
                      ) : (
                        <div
                          style={{
                            paddingTop: "56.25%",
                            position: "relative",
                            background: "#f0f0f0",
                            borderRadius: "12px 12px 0 0",
                          }}>
                          <div
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 20,
                              fontWeight: 500,
                              color: "#aaa",
                            }}>
                            📰
                          </div>
                        </div>
                      )
                    }>
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
                      {tt.tieu_de}
                    </Title>
                    <Paragraph
                      ellipsis={{ rows: 2 }}
                      style={{
                        color: "#606060",
                        fontSize: 12,
                        marginBottom: 0,
                        lineHeight: "18px",
                      }}>
                      {tt.noi_dung?.replace(/<[^>]*>/g, "").substring(0, 100) ||
                        "Nội dung tin tức..."}
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
