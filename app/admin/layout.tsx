"use client";

import { useEffect, useState } from "react";
import { Layout, Button, Typography, Space, Avatar } from "antd";
import {
  DashboardOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
  PictureOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { authUtils } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<unknown>(null);

  useEffect(() => {
    const currentUser = authUtils.getUser();
    setUser(currentUser);

    if (!authUtils.isAdmin()) {
      router.push("/");
    }
  }, [router]);

  const sidebarItems = [
    {
      key: "/admin",
      label: "Tổng quan",
      icon: <DashboardOutlined style={{ fontSize: 18 }} />,
    },
    {
      key: "/admin/products",
      label: "Sản phẩm",
      icon: <ShoppingOutlined style={{ fontSize: 18 }} />,
    },
    {
      key: "/admin/categories",
      label: "Danh mục",
      icon: <AppstoreOutlined style={{ fontSize: 18 }} />,
    },
    {
      key: "/admin/orders",
      label: "Đơn hàng",
      icon: <ShoppingCartOutlined style={{ fontSize: 18 }} />,
    },
    {
      key: "/admin/news",
      label: "Tin tức",
      icon: <FileTextOutlined style={{ fontSize: 18 }} />,
    },
    {
      key: "/admin/banners",
      label: "Quảng cáo",
      icon: <PictureOutlined style={{ fontSize: 18 }} />,
    },
    {
      key: "/admin/users",
      label: "Người dùng",
      icon: <UserOutlined style={{ fontSize: 18 }} />,
    },
  ];

  const adminLogo = collapsed ? (
    <div
      style={{
        width: 40,
        height: 40,
        background: "#FF0000",
        borderRadius: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 20,
        fontWeight: "bold",
      }}>
      <img
        src="/yamaha-logo.png"
        alt="Yamaha"
        style={{ width: 32, height: 32, objectFit: "contain" }}
      />
    </div>
  ) : (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <img
        src="/yamaha-logo.png"
        alt="Yamaha"
        style={{ width: 40, height: 40, objectFit: "contain" }}
      />
      <div>
        <Title
          level={5}
          style={{ color: "#030303", margin: 0, fontWeight: 700 }}>
          YAMAHA
        </Title>
        <Text style={{ color: "#888", fontSize: 12 }}>Admin Panel</Text>
      </div>
    </div>
  );

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      {/* Sidebar - Light Theme (giống user) */}
      <Sidebar
        collapsed={collapsed}
        items={sidebarItems}
        theme="light"
        width={280}
        collapsedWidth={80}
        logo={adminLogo}
        top={0}
        zIndex={1002}
      />

      <Layout
        style={{
          background: "#f5f5f5",
          marginLeft: collapsed ? 80 : 280,
          transition: "margin-left 0.2s",
        }}>
        {/* Header - White Theme */}
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            height: 64,
            position: "sticky",
            top: 0,
            zIndex: 1001,
          }}>
          <Space size="large">
            <Button
              type="text"
              icon={
                collapsed ? (
                  <MenuUnfoldOutlined style={{ fontSize: 18 }} />
                ) : (
                  <MenuFoldOutlined style={{ fontSize: 18 }} />
                )
              }
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: 18,
                width: 40,
                height: 40,
              }}
            />
            <Title level={4} style={{ margin: 0, color: "#000" }}>
              Quản trị hệ thống
            </Title>
          </Space>

          <Space size="middle">
            <Button
              icon={<HomeOutlined />}
              onClick={() => router.push("/")}
              style={{
                borderRadius: 8,
                border: "1px solid #d9d9d9",
              }}>
              Trang chủ
            </Button>
            <Space size="small">
              <Avatar
                style={{
                  background: "#000",
                  color: "#fff",
                  fontWeight: 600,
                }}>
                {user?.ho_ten?.charAt(0).toUpperCase() ||
                  user?.ten_dang_nhap?.charAt(0).toUpperCase() ||
                  "A"}
              </Avatar>
              <div style={{ lineHeight: 1.2 }}>
                <Text strong style={{ display: "block", fontSize: 14 }}>
                  {user?.ho_ten || user?.ten_dang_nhap || "Admin"}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Quản trị viên
                </Text>
              </div>
            </Space>
            <Button
              icon={<LogoutOutlined />}
              onClick={() => authUtils.logout()}
              style={{
                borderRadius: 8,
                border: "1px solid #ff4d4f",
                color: "#ff4d4f",
              }}>
              Đăng xuất
            </Button>
          </Space>
        </Header>

        {/* Content Area */}
        <Content
          style={{
            margin: "24px",
            padding: 24,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
            minHeight: "calc(100vh - 112px)",
          }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
