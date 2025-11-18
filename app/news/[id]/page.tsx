"use client";

import { useEffect, useState } from "react";
import { Card, Typography, Button, Spin, Tag } from "antd";
import { ArrowLeftOutlined, CalendarOutlined } from "@ant-design/icons";
import { useRouter, useParams } from "next/navigation";
import { tinTucAPI } from "@/lib/api";
import type { TinTuc } from "@/lib/types";
import BannerAd from "@/components/BannerAd";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const { Title } = Typography;

export default function NewsDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [tinTuc, setTinTuc] = useState<TinTuc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchTinTuc(Number(params.id));
    }
  }, [params.id]);

  const fetchTinTuc = async (id: number) => {
    try {
      const response = await tinTucAPI.layTheoId(id);
      setTinTuc(response.data);
    } catch (error) {
      console.error("Lỗi khi tải tin tức:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!tinTuc) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Title level={3}>Không tìm thấy tin tức</Title>
        <Button onClick={() => router.push("/news")}>Quay lại danh sách</Button>
      </div>
    );
  }

  return (
    <>
      {/* Banner Chi tiết tin tức - Vị trí 3 */}
      <BannerAd viTri={3} height={300} />

      <div style={{ maxWidth: 900, margin: "0 auto", marginTop: 24 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.back()}
          style={{ marginBottom: 24 }}
          size="large">
          Quay lại
        </Button>

        <Card>
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <Tag color="blue" style={{ marginBottom: 16 }}>
              <CalendarOutlined />{" "}
              {new Date(tinTuc.ngay_tao).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Tag>
            <Title level={1} style={{ marginBottom: 0 }}>
              {tinTuc.tieu_de}
            </Title>
          </div>

          {/* Featured Image */}
          {tinTuc.hinh_anh_url && (
            <div style={{ marginBottom: 32 }}>
              <img
                src={tinTuc.hinh_anh_url}
                alt={tinTuc.tieu_de}
                style={{
                  width: "100%",
                  maxHeight: 500,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
            </div>
          )}

          {/* Content */}
          <div
            style={{
              fontSize: 16,
              lineHeight: 1.8,
              color: "#333",
            }}>
            {/* Kiểm tra nếu là HTML hay Markdown */}
            {tinTuc.noi_dung?.includes("<") ? (
              // Nếu có tag HTML, render HTML
              <div dangerouslySetInnerHTML={{ __html: tinTuc.noi_dung }} />
            ) : (
              // Nếu không, render Markdown
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  img: ({ node, ...props }) => (
                    <img
                      {...props}
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: 8,
                      }}
                    />
                  ),
                }}>
                {tinTuc.noi_dung || ""}
              </ReactMarkdown>
            )}
          </div>
        </Card>

        {/* Related News Section */}
        <div style={{ marginTop: 40, textAlign: "center" }}>
          <Button
            type="primary"
            size="large"
            onClick={() => router.push("/news")}>
            Xem thêm tin tức khác
          </Button>
        </div>
      </div>
    </>
  );
}
