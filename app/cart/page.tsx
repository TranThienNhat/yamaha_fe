"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  InputNumber,
  Empty,
  Modal,
  Form,
  Input,
  App,
} from "antd";
import { DeleteOutlined, ShoppingOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { authUtils } from "@/lib/auth";
import { gioHangAPI, donHangAPI } from "@/lib/api";
import type { GioHang } from "@/lib/types";

export default function CartPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const [gioHang, setGioHang] = useState<GioHang | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [form] = Form.useForm();
  const user = authUtils.getUser();

  useEffect(() => {
    if (!user) {
      router.push(`/login?redirect=/cart`);
      return;
    }
    fetchGioHang();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router]);

  const fetchGioHang = async () => {
    if (!user) return;
    try {
      const response = await gioHangAPI.layGioHang(user.id);
      setGioHang(response.data);
    } catch (error) {
      message.error("Không thể tải giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (maChiTiet: number, soLuong: number) => {
    try {
      await gioHangAPI.capNhatSoLuong(maChiTiet, { so_luong: soLuong });
      fetchGioHang();
    } catch (error: any) {
      message.error("Không thể cập nhật số lượng");
    }
  };

  const handleDelete = async (maChiTiet: number) => {
    try {
      await gioHangAPI.xoaSanPham(maChiTiet);
      message.success("Đã xóa sản phẩm");
      fetchGioHang();
    } catch (error: any) {
      message.error("Không thể xóa sản phẩm");
    }
  };

  const handleCheckout = () => {
    if (!gioHang || gioHang.chi_tiet.length === 0) {
      message.warning("Giỏ hàng trống");
      return;
    }
    form.setFieldsValue({
      ten_khach_hang: user?.ho_ten || "",
      so_dien_thoai: user?.sdt || "",
    });
    setCheckoutVisible(true);
  };

  const handleSubmitOrder = async (values: any) => {
    if (!user || !gioHang) return;

    try {
      const orderData = {
        ma_nguoi_dung: user.id,
        ten_khach_hang: values.ten_khach_hang,
        so_dien_thoai: values.so_dien_thoai,
        dia_chi: values.dia_chi,
        chi_tiet_san_pham: gioHang.chi_tiet.map((item: any) => ({
          ma_san_pham: item.ma_san_pham,
          so_luong: item.so_luong,
        })),
      };

      await donHangAPI.tao(orderData);
      await gioHangAPI.xoaGioHang(user.id);
      message.success("Đặt hàng thành công!");
      setCheckoutVisible(false);
      router.push("/orders");
    } catch (error: any) {
      message.error("Không thể đặt hàng");
    }
  };

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: "ten_san_pham",
      key: "ten_san_pham",
    },
    {
      title: "Đơn giá",
      dataIndex: "gia",
      key: "gia",
      render: (gia: number) => `${gia.toLocaleString("vi-VN")} đ`,
    },
    {
      title: "Số lượng",
      dataIndex: "so_luong",
      key: "so_luong",
      render: (soLuong: number, record: any) => (
        <InputNumber
          min={1}
          value={soLuong}
          onChange={(value) => handleUpdateQuantity(record.id, value || 1)}
        />
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "thanh_tien",
      key: "thanh_tien",
      render: (tien: number) => `${tien.toLocaleString("vi-VN")} đ`,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: any) => (
        <Button
          icon={<DeleteOutlined />}
          danger
          onClick={() => handleDelete(record.id)}>
          Xóa
        </Button>
      ),
    },
  ];

  const tongTien =
    gioHang?.chi_tiet.reduce(
      (sum: number, item: any) => sum + item.thanh_tien,
      0
    ) || 0;

  return (
    <>
      <Card title="Giỏ hàng của bạn">
        {gioHang && gioHang.chi_tiet.length > 0 ? (
          <>
            <Table
              columns={columns}
              dataSource={gioHang.chi_tiet}
              rowKey="id"
              pagination={false}
            />
            <div style={{ marginTop: 24, textAlign: "right" }}>
              <h2>Tổng cộng: {tongTien.toLocaleString("vi-VN")} đ</h2>
              <Button
                type="primary"
                size="large"
                icon={<ShoppingOutlined />}
                onClick={handleCheckout}>
                Đặt hàng
              </Button>
            </div>
          </>
        ) : (
          <Empty description="Giỏ hàng trống" />
        )}
      </Card>

      <Modal
        title="Thông tin đặt hàng"
        open={checkoutVisible}
        onCancel={() => setCheckoutVisible(false)}
        onOk={() => form.submit()}
        width={500}>
        <Form form={form} layout="vertical" onFinish={handleSubmitOrder}>
          <Form.Item
            name="ten_khach_hang"
            label="Họ tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="so_dien_thoai"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="dia_chi"
            label="Địa chỉ giao hàng"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
