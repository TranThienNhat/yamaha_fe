"use client";

import { useEffect, useState } from "react";
import { Table, Tag, Popconfirm, Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { nguoiDungAPI } from "@/lib/api";
import type { NguoiDung } from "@/lib/types";

export default function AdminUsersPage() {
  const [nguoiDungs, setNguoiDungs] = useState<NguoiDung[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNguoiDungs();
  }, []);

  const fetchNguoiDungs = async () => {
    setLoading(true);
    try {
      const response = await nguoiDungAPI.layTatCa();
      setNguoiDungs(response.data);
    } catch (error) {
      message.error("Lỗi khi tải người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await nguoiDungAPI.xoa(id);
      message.success("Xóa người dùng thành công");
      fetchNguoiDungs();
    } catch (error) {
      message.error("Lỗi khi xóa người dùng");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Tên đăng nhập",
      dataIndex: "ten_dang_nhap",
      key: "ten_dang_nhap",
    },
    {
      title: "Họ tên",
      dataIndex: "ho_ten",
      key: "ho_ten",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "SĐT",
      dataIndex: "sdt",
      key: "sdt",
    },
    {
      title: "Vai trò",
      dataIndex: "vai_tro",
      key: "vai_tro",
      render: (vaiTro: string) => (
        <Tag color={vaiTro === "admin" ? "red" : "blue"}>
          {vaiTro === "admin" ? "Quản trị viên" : "Khách hàng"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      render: (_: any, record: NguoiDung) => (
        <Popconfirm
          title="Bạn có chắc muốn xóa?"
          onConfirm={() => handleDelete(record.id)}
          okText="Có"
          cancelText="Không">
          <Button icon={<DeleteOutlined />} danger size="small" />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <h1>Quản lý người dùng</h1>
      <Table
        columns={columns}
        dataSource={nguoiDungs}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
}
