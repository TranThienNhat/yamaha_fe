"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { danhMucAPI } from "@/lib/api";
import type { DanhMuc } from "@/lib/types";

export default function AdminCategoriesPage() {
  const [danhMucs, setDanhMucs] = useState<DanhMuc[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<DanhMuc | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDanhMucs();
  }, []);

  const fetchDanhMucs = async () => {
    setLoading(true);
    try {
      const response = await danhMucAPI.layTatCa();
      setDanhMucs(response.data);
    } catch (error) {
      message.error("Lỗi khi tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: DanhMuc) => {
    setEditingCategory(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await danhMucAPI.xoa(id);
      message.success("Xóa danh mục thành công");
      fetchDanhMucs();
    } catch (error) {
      message.error("Lỗi khi xóa danh mục");
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingCategory) {
        await danhMucAPI.sua(editingCategory.id, values);
        message.success("Cập nhật danh mục thành công");
      } else {
        await danhMucAPI.them(values);
        message.success("Thêm danh mục thành công");
      }
      setModalVisible(false);
      fetchDanhMucs();
    } catch (error) {
      message.error("Lỗi khi lưu danh mục");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Tên danh mục",
      dataIndex: "ten_danh_muc",
      key: "ten_danh_muc",
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_: any, record: DanhMuc) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không">
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}>
        <h1>Quản lý danh mục</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm danh mục
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={danhMucs}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="ten_danh_muc"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
