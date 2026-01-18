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
import { formatPrice } from "@/lib/constants";
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

    if (!hasValidItems) {
      message.warning("Không có sản phẩm hợp lệ để đặt hàng");
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
      // Chỉ lấy sản phẩm còn hàng
      const validItems = gioHang.chi_tiet.filter(
        (item: any) => item.so_luong_ton > 0 && !item.an
      );

      if (validItems.length === 0) {
        message.error("Không có sản phẩm hợp lệ để đặt hàng");
        return;
      }

      const orderData = {
        ma_nguoi_dung: user.id,
        ten_khach_hang: values.ten_khach_hang,
        so_dien_thoai: values.so_dien_thoai,
        dia_chi: values.dia_chi,
        chi_tiet_san_pham: validItems.map((item: any) => ({
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
      render: (text: string, record: any) => (
        <div
          style={{
            opacity: record.so_luong_ton <= 0 || record.an ? 0.5 : 1,
            position: "relative",
          }}
          title={
            record.so_luong_ton <= 0 || record.an ? "Hết hàng" : undefined
          }>
          {text}
          {(record.so_luong_ton <= 0 || record.an) && (
            <span
              style={{
                color: "#ff4d4f",
                fontSize: "12px",
                marginLeft: "8px",
                fontWeight: "bold",
              }}>
              (Hết hàng)
            </span>
          )}
        </div>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "gia",
      key: "gia",
      render: (gia: number, record: any) => (
        <span
          style={{
            opacity: record.so_luong_ton <= 0 || record.an ? 0.5 : 1,
          }}>
          {formatPrice(gia)} đ
        </span>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "so_luong",
      key: "so_luong",
      render: (soLuong: number, record: any) => (
        <div
          style={{
            opacity: record.so_luong_ton <= 0 || record.an ? 0.5 : 1,
          }}>
          <InputNumber
            min={1}
            max={record.so_luong_ton || 1}
            value={soLuong}
            disabled={record.so_luong_ton <= 0 || record.an}
            onChange={(value) => handleUpdateQuantity(record.id, value || 1)}
          />
        </div>
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "thanh_tien",
      key: "thanh_tien",
      render: (tien: number, record: any) => (
        <span
          style={{
            opacity: record.so_luong_ton <= 0 || record.an ? 0.5 : 1,
            textDecoration:
              record.so_luong_ton <= 0 || record.an ? "line-through" : "none",
          }}>
          {formatPrice(tien)} đ
        </span>
      ),
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
    gioHang?.chi_tiet.reduce((sum: number, item: any) => {
      // Chỉ tính tiền cho sản phẩm còn hàng
      if (item.so_luong_ton > 0 && !item.an) {
        return sum + item.thanh_tien;
      }
      return sum;
    }, 0) || 0;

  const hasValidItems = gioHang?.chi_tiet.some(
    (item: any) => item.so_luong_ton > 0 && !item.an
  );

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
              <h2>Tổng cộng: {formatPrice(tongTien)} đ</h2>
              <Button
                type="primary"
                size="large"
                icon={<ShoppingOutlined />}
                disabled={!hasValidItems}
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
