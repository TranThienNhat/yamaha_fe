"use client";

import { useState, useEffect, Suspense } from "react";
import { Form, Input, Button, Typography, message, Divider } from "antd";
import {
  UserOutlined,
  LockOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { nguoiDungAPI } from "@/lib/api";
import { authUtils } from "@/lib/auth";
import Link from "next/link";

const { Title, Text } = Typography;

// 1. Tách logic chính ra một component riêng (LoginForm)
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const redirectUrl = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (authUtils.isAuthenticated()) {
      router.push(redirectUrl);
    }
  }, [router, redirectUrl]);

  const onFinish = async (values: {
    ten_dang_nhap: string;
    mat_khau: string;
  }) => {
    setLoading(true);
    try {
      const response = await nguoiDungAPI.dangNhap(values);
      const userData = response.data.nguoi_dung;
      authUtils.setUser(userData);
      message.success("Đăng nhập thành công!");

      if (authUtils.isAdmin() && redirectUrl === "/") {
        router.push("/admin");
      } else {
        router.push(redirectUrl);
      }
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      message.error(err.response?.data?.error || "Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9f9f9",
        padding: "20px",
      }}>
      {/* Left Side - Branding */}
      <div
        style={{
          display: "flex",
          gap: 80,
          maxWidth: 1000,
          width: "100%",
          alignItems: "center",
        }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 48,
                height: 48,
                background: "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                boxShadow: "0 4px 12px rgba(255,0,0,0.3)",
              }}>
              🏍️
            </div>
            <Title
              level={1}
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: 36,
                color: "#030303",
                letterSpacing: "-1px",
              }}>
              YAMAHA
            </Title>
          </div>

          <div>
            <Title
              level={2}
              style={{
                margin: 0,
                marginBottom: 12,
                fontWeight: 600,
                fontSize: 32,
                color: "#030303",
              }}>
              Chào mừng trở lại
            </Title>
            <Text
              style={{
                fontSize: 16,
                color: "#606060",
                lineHeight: 1.6,
              }}>
              Đăng nhập để khám phá các sản phẩm xe máy Yamaha chính hãng, theo
              dõi đơn hàng và nhận thông tin khuyến mãi mới nhất.
            </Text>
          </div>

          {/* Features */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              marginTop: 24,
            }}>
            {[
              { icon: "✓", text: "Mua sắm dễ dàng, thanh toán an toàn" },
              { icon: "✓", text: "Theo dõi đơn hàng realtime" },
              { icon: "✓", text: "Nhận thông báo khuyến mãi độc quyền" },
            ].map((item, index) => (
              <div
                key={index}
                style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: "#00C853",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                  }}>
                  {item.icon}
                </div>
                <Text style={{ fontSize: 15, color: "#030303" }}>
                  {item.text}
                </Text>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div
          style={{
            width: 420,
            background: "#fff",
            borderRadius: 12,
            padding: "48px 40px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid #e5e5e5",
          }}>
          <Title
            level={3}
            style={{
              margin: 0,
              marginBottom: 8,
              fontWeight: 600,
              fontSize: 24,
              color: "#030303",
            }}>
            Đăng nhập
          </Title>
          <Text style={{ fontSize: 14, color: "#606060" }}>
            Nhập thông tin tài khoản của bạn
          </Text>

          <Divider style={{ margin: "24px 0" }} />

          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            requiredMark={false}>
            <Form.Item
              label={
                <span
                  style={{ fontSize: 14, fontWeight: 500, color: "#030303" }}>
                  Tên đăng nhập
                </span>
              }
              name="ten_dang_nhap"
              rules={[
                { required: true, message: "Vui lòng nhập tên đăng nhập!" },
              ]}>
              <Input
                prefix={<UserOutlined style={{ color: "#606060" }} />}
                placeholder="Nhập tên đăng nhập"
                size="large"
                style={{
                  borderRadius: 8,
                  fontSize: 14,
                }}
              />
            </Form.Item>

            <Form.Item
              label={
                <span
                  style={{ fontSize: 14, fontWeight: 500, color: "#030303" }}>
                  Mật khẩu
                </span>
              }
              name="mat_khau"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}>
              <Input.Password
                prefix={<LockOutlined style={{ color: "#606060" }} />}
                placeholder="Nhập mật khẩu"
                size="large"
                style={{
                  borderRadius: 8,
                  fontSize: 14,
                }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 16 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                style={{
                  height: 48,
                  borderRadius: 8,
                  background:
                    "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)",
                  borderColor: "transparent",
                  fontSize: 15,
                  fontWeight: 600,
                  boxShadow: "0 2px 4px rgba(255,0,0,0.3)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 8px rgba(255,0,0,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 4px rgba(255,0,0,0.3)";
                }}>
                Đăng nhập
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Text style={{ fontSize: 14, color: "#606060" }}>
                Chưa có tài khoản?{" "}
                <Link
                  href={`/register?redirect=${encodeURIComponent(redirectUrl)}`}
                  style={{
                    color: "#065fd4",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}>
                  Đăng ký ngay
                </Link>
              </Text>
            </div>

            <Divider style={{ margin: "24px 0" }} />

            <div style={{ textAlign: "center" }}>
              <Link
                href="/"
                style={{
                  color: "#606060",
                  fontSize: 14,
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#030303")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#606060")}>
                <ArrowLeftOutlined /> Quay về trang chủ
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

// 2. Component chính (default export) chỉ làm nhiệm vụ bọc Suspense
export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          Đang tải...
        </div>
      }>
      <LoginForm />
    </Suspense>
  );
}
