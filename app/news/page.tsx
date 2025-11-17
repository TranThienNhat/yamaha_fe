"use client";

import { useEffect, useState } from "react";
import { Card, Row, Col, Typography, message } from "antd";
import { useRouter } from "next/navigation";
import { tinTucAPI } from "@/lib/api";
import type { TinTuc } from "@/lib/types";
import BannerAd from "@/components/BannerAd";
import MainLayout from "@/components/MainLayout";

const { Title, Paragraph, Text } = Typography;

export default function NewsPage() {
  const router = useRouter();
  const [tinTucs, setTinTucs] = useState<TinTuc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTinTucs();
  }, []);

  const fetchTinTucs = async () => {
    try {
      const response = await tinTucAPI.layTatCa();
      setTinTucs(response.data);
    } catch (error) {
      message.error("Lỗi khi tải tin tức");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div style={{ padding: "24px" }}>
        {/* Banner Danh sách tin tức - Vị trí 3 */}
        <BannerAd viTri={3} height={360} />

        <div style={{ marginTop: 24 }}>
          <Title
            level={4}
            style={{
              marginBottom: 20,
              fontWeight: 600,
              color: "#030303",
            }}>
            Tin Tức & Khuyến Mãi
          </Title>
          <Row gutter={[16, 16]}>
            {tinTucs.map((tt) => (
              <Col xs={24} sm={12} md={8} lg={8} key={tt.id}>
                <Card
                  hoverable
                  onClick={() => router.push(`/news/${tt.id}`)}
                  style={{
                    borderRadius: 10,
                    overflow: "hidden",
                    border: "none",
                    boxShadow: "none",
                    background: "#fff",
                    transition: "transform 0.2s",
                    cursor: "pointer",
                  }}
                  styles={{ body: { padding: 10 } }}
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
                      marginBottom: 6,
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#030303",
                      lineHeight: "18px",
                    }}>
                    {tt.tieu_de}
                  </Title>
                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    style={{
                      color: "#606060",
                      fontSize: 11,
                      marginBottom: 6,
                      lineHeight: "16px",
                    }}>
                    {tt.noi_dung?.replace(/<[^>]*>/g, "") || ""}
                  </Paragraph>
                  <Text type="secondary" style={{ fontSize: 10 }}>
                    {new Date(tt.ngay_tao).toLocaleDateString("vi-VN")}
                  </Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </MainLayout>
  );
}
