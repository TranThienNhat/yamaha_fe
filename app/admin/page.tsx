"use client";

import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { sanPhamAPI, donHangAPI, nguoiDungAPI, tinTucAPI } from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    sanPham: 0,
    donHang: 0,
    nguoiDung: 0,
    tinTuc: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [spRes, dhRes, ndRes, ttRes] = await Promise.all([
        sanPhamAPI.layTatCa(),
        donHangAPI.layTatCa(),
        nguoiDungAPI.layTatCa(),
        tinTucAPI.layTatCa(),
      ]);

      setStats({
        sanPham: spRes.data.length,
        donHang: dhRes.data.length,
        nguoiDung: ndRes.data.length,
        tinTuc: ttRes.data.length,
      });
    } catch (error) {
      console.error("Lỗi khi tải thống kê:", error);
    }
  };

  return (
    <div>
      <h1>Tổng quan</h1>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Sản phẩm"
              value={stats.sanPham}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đơn hàng"
              value={stats.donHang}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Người dùng"
              value={stats.nguoiDung}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tin tức"
              value={stats.tinTuc}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
