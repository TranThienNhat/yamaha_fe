"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Tag,
  Select,
  message,
  Descriptions,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { donHangAPI } from "@/lib/api";
import type { DonHang } from "@/lib/types";
import { TrangThaiDonHang, formatPrice } from "@/lib/constants";

export default function AdminOrdersPage() {
  const [donHangs, setDonHangs] = useState<DonHang[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DonHang | null>(null);

  useEffect(() => {
    fetchDonHangs();
  }, []);

  const fetchDonHangs = async () => {
    setLoading(true);
    try {
      const response = await donHangAPI.layTatCa();
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

  const handleUpdateStatus = async (id: number, trangThai: string) => {
    try {
      await donHangAPI.capNhatTrangThai(id, { trang_thai: trangThai });
      message.success("Cập nhật trạng thái thành công");
      fetchDonHangs();
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái");
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
      title: "Khách hàng",
      dataIndex: "ten_khach_hang",
      key: "ten_khach_hang",
    },
    {
      title: "SĐT",
      dataIndex: "so_dien_thoai",
      key: "so_dien_thoai",
    },
    {
      title: "Địa chỉ",
      dataIndex: "dia_chi",
      key: "dia_chi",
      ellipsis: true,
    },
    {
      title: "Tổng tiền",
      dataIndex: "tong_gia",
      key: "tong_gia",
      render: (gia: number) => `${formatPrice(gia)} đ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "trang_thai",
      key: "trang_thai",
      render: (status: string, record: DonHang) => {
        const isLocked =
          status === TrangThaiDonHang.DA_GIAO ||
          status === TrangThaiDonHang.DA_HUY;

        if (isLocked) {
          return <Tag color={getStatusColor(status)}>{status}</Tag>;
        }

        return (
          <Select
            value={status}
            style={{ width: 150 }}
            onChange={(value) => handleUpdateStatus(record.id, value)}>
            <Select.Option value={TrangThaiDonHang.CHO_XU_LY}>
              <Tag color={getStatusColor(TrangThaiDonHang.CHO_XU_LY)}>
                {TrangThaiDonHang.CHO_XU_LY}
              </Tag>
            </Select.Option>
            <Select.Option value={TrangThaiDonHang.DA_XAC_NHAN}>
              <Tag color={getStatusColor(TrangThaiDonHang.DA_XAC_NHAN)}>
                {TrangThaiDonHang.DA_XAC_NHAN}
              </Tag>
            </Select.Option>
            <Select.Option value={TrangThaiDonHang.DANG_GIAO}>
              <Tag color={getStatusColor(TrangThaiDonHang.DANG_GIAO)}>
                {TrangThaiDonHang.DANG_GIAO}
              </Tag>
            </Select.Option>
            <Select.Option value={TrangThaiDonHang.DA_GIAO}>
              <Tag color={getStatusColor(TrangThaiDonHang.DA_GIAO)}>
                {TrangThaiDonHang.DA_GIAO}
              </Tag>
            </Select.Option>
            <Select.Option value={TrangThaiDonHang.DA_HUY}>
              <Tag color={getStatusColor(TrangThaiDonHang.DA_HUY)}>
                {TrangThaiDonHang.DA_HUY}
              </Tag>
            </Select.Option>
          </Select>
        );
      },
    },
    {
      title: "Ngày đặt",
      dataIndex: "ngay_dat",
      key: "ngay_dat",
      render: (date: string) => new Date(date).toLocaleString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      render: (_: unknown, record: DonHang) => (
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
    <div>
      <h1>Quản lý đơn hàng</h1>

      <Table
        columns={columns}
        dataSource={donHangs}
        rowKey="id"
        loading={loading}
      />

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
                  render: (gia: number) => `${formatPrice(gia)} đ`,
                },
                {
                  title: "Thành tiền",
                  dataIndex: "thanh_tien",
                  key: "thanh_tien",
                  width: 150,
                  render: (tien: number) => `${formatPrice(tien)} đ`,
                },
              ]}
            />

            <div style={{ marginTop: 16, textAlign: "right" }}>
              <h2>Tổng cộng: {formatPrice(selectedOrder.tong_gia)} đ</h2>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
