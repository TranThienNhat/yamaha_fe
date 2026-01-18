"use client";

import { useState, useEffect, Suspense } from "react";
import { Form, Input, Button, Typography, message, Divider } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import { nguoiDungAPI } from "@/lib/api";
import { authUtils } from "@/lib/auth";
import Link from "next/link";

const { Title, Text } = Typography;

// 1. Tách logic chính ra component con
function RegisterForm() {
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
    ho_ten: string;
    email: string;
    sdt: string;
  }) => {
    setLoading(true);
    try {
      await nguoiDungAPI.dangKy(values);
      message.success("Đăng ký thành công! Vui lòng đăng nhập.");

      // Use replace instead of push to avoid back button issues
      router.replace(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
    } catch (error) {
      const err = error as { response?: { data?: { error?: string } } };
      message.error(err.response?.data?.error || "Đăng ký thất bại!");
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
      {/* Container */}
      <div
        style={{
          display: "flex",
          gap: 80,
          maxWidth: 1100,
          width: "100%",
          alignItems: "center",
        }}>
        {/* Left Side - Branding */}
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
              <img
                src="/yamaha-logo.png"
                alt="Yamaha"
                style={{ width: 48, height: 48, objectFit: "contain" }}
              />
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
              Tham gia cùng chúng tôi
            </Title>
            <Text
              style={{
                fontSize: 16,
                color: "#606060",
                lineHeight: 1.6,
              }}>
              Tạo tài khoản để trải nghiệm mua sắm xe máy Yamaha chính hãng với
              nhiều ưu đãi và dịch vụ độc quyền dành riêng cho thành viên.
            </Text>
          </div>

          {/* Benefits */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              marginTop: 24,
            }}>
            {[
              { icon: "🎁", text: "Ưu đãi độc quyền cho thành viên mới" },
              { icon: "🚀", text: "Giao hàng nhanh chóng toàn quốc" },
              { icon: "🔒", text: "Bảo mật thông tin tuyệt đối" },
              { icon: "💬", text: "Hỗ trợ khách hàng 24/7" },
            ].map((item, index) => (
              <div
                key={index}
                style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "#f2f2f2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
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

        {/* Right Side - Register Form */}
        <div
          style={{
            width: 480,
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
            Đăng ký tài khoản
          </Title>
          <Text style={{ fontSize: 14, color: "#606060" }}>
            Điền thông tin để tạo tài khoản mới
          </Text>

          <Divider style={{ margin: "24px 0" }} />

          <Form
            name="register"
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
                placeholder="Chọn tên đăng nhập"
                size="large"
                style={{ borderRadius: 8, fontSize: 14 }}
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
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu!" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
              ]}>
              <Input.Password
                prefix={<LockOutlined style={{ color: "#606060" }} />}
                placeholder="Tối thiểu 6 ký tự"
                size="large"
                style={{ borderRadius: 8, fontSize: 14 }}
              />
            </Form.Item>

            <Form.Item
              label={
                <span
                  style={{ fontSize: 14, fontWeight: 500, color: "#030303" }}>
                  Họ và tên
                </span>
              }
              name="ho_ten"
              rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}>
              <Input
                prefix={<UserOutlined style={{ color: "#606060" }} />}
                placeholder="Nhập họ và tên đầy đủ"
                size="large"
                style={{ borderRadius: 8, fontSize: 14 }}
              />
            </Form.Item>

            <Form.Item
              label={
                <span
                  style={{ fontSize: 14, fontWeight: 500, color: "#030303" }}>
                  Email
                </span>
              }
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}>
              <Input
                prefix={<MailOutlined style={{ color: "#606060" }} />}
                placeholder="example@email.com"
                size="large"
                style={{ borderRadius: 8, fontSize: 14 }}
              />
            </Form.Item>

            <Form.Item
              label={
                <span
                  style={{ fontSize: 14, fontWeight: 500, color: "#030303" }}>
                  Số điện thoại
                </span>
              }
              name="sdt"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}>
              <Input
                prefix={<PhoneOutlined style={{ color: "#606060" }} />}
                placeholder="0123456789"
                size="large"
                style={{ borderRadius: 8, fontSize: 14 }}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 16, marginTop: 32 }}>
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
                Đăng ký
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Text style={{ fontSize: 14, color: "#606060" }}>
                Đã có tài khoản?{" "}
                <Link
                  href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
                  style={{
                    color: "#065fd4",
                    fontWeight: 500,
                    textDecoration: "none",
                  }}>
                  Đăng nhập
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

// 2. Component chính (default export) bọc Suspense
export default function RegisterPage() {
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
      <RegisterForm />
    </Suspense>
  );
}
