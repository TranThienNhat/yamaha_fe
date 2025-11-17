"use client";

import { useEffect, useState } from "react";
import {
  Layout,
  Card,
  Table,
  Tag,
  Button,
  Modal,
  Descriptions,
  message,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { authUtils } from "@/lib/auth";
import { donHangAPI } from "@/lib/api";
import type { DonHang } from "@/lib/types";
import { TrangThaiDonHang } from "@/lib/constants";

const { Content } = Layout;

export default function OrdersPage() {
  const router = useRouter();
  const [donHangs, setDonHangs] = useState<DonHang[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DonHang | null>(null);
  const user = authUtils.getUser();

  useEffect(() => {
    if (!user) {
      router.push(`/login?redirect=/orders`);
      return;
    }
    fetchDonHangs();
  }, [user, router]);

  const fetchDonHangs = async () => {
    if (!user) return;
    try {
      const response = await donHangAPI.layTheoNguoiDung(user.id);
      setDonHangs(response.data);
    } catch (error) {
      message.error("Lỗi khi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = async (id: number) => {
    try {
      const response = await donHangAPI.layTheoId(id);
      setSelectedOrder(response.data);
      setDetailVisible(true);
    } catch (error) {
      message.error("Lỗi khi tải chi tiết đơn hàng");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case TrangThaiDonHang.CHO_XU_LY:
        return "default";
      case TrangThaiDonHang.DA_XAC_NHAN:
        return "processing";
      case TrangThaiDonHang.DANG_GIAO:
        return "warning";
      case TrangThaiDonHang.DA_GIAO:
        return "success";
      case TrangThaiDonHang.DA_HUY:
        return "error";
      default:
        return "default";
    }
  };

  const columns = [
    {
      title: "Mã ĐH",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Ngày đặt",
      dataIndex: "ngay_dat",
      key: "ngay_dat",
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Tổng tiền",
      dataIndex: "tong_gia",
      key: "tong_gia",
      render: (gia: number) => `${gia.toLocaleString("vi-VN")} đ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      render: (_: any, record: DonHang) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record.id)}
          size="small">
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "50px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Card title="Đơn hàng của tôi">
            <Table
              columns={columns}
              dataSource={donHangs}
              rowKey="id"
              loading={loading}
            />
          </Card>
        </div>
      </Content>

      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={800}>
        {selectedOrder && (
          <>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Khách hàng">
                {selectedOrder.ten_khach_hang}
              </Descriptions.Item>
              <Descriptions.Item label="SĐT">
                {selectedOrder.so_dien_thoai}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ" span={2}>
                {selectedOrder.dia_chi}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(selectedOrder.trang_thai)}>
                  {selectedOrder.trang_thai}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt">
                {new Date(selectedOrder.ngay_dat).toLocaleString("vi-VN")}
              </Descriptions.Item>
            </Descriptions>

            <h3 style={{ marginTop: 24 }}>Sản phẩm</h3>
            <Table
              dataSource={selectedOrder.chi_tiet}
              rowKey="id"
              pagination={false}
              columns={[
                {
                  title: "Tên sản phẩm",
                  dataIndex: "ten_san_pham",
                  key: "ten_san_pham",
                },
                {
                  title: "Số lượng",
                  dataIndex: "so_luong",
                  key: "so_luong",
                  width: 100,
                },
                {
                  title: "Đơn giá",
                  dataIndex: "don_gia",
                  key: "don_gia",
                  width: 150,
                  render: (gia: number) => `${gia.toLocaleString("vi-VN")} đ`,
                },
                {
                  title: "Thành tiền",
                  dataIndex: "thanh_tien",
                  key: "thanh_tien",
                  width: 150,
                  render: (tien: number) => `${tien.toLocaleString("vi-VN")} đ`,
                },
              ]}
            />

            <div style={{ marginTop: 16, textAlign: "right" }}>
              <h2>
                Tổng cộng: {selectedOrder.tong_gia.toLocaleString("vi-VN")} đ
              </h2>
            </div>
          </>
        )}
      </Modal>
    </Layout>
  );
}
