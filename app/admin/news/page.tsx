"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Popconfirm,
  Switch,
  App,
  Upload,
  Image,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { tinTucAPI } from "@/lib/api";
import type { TinTuc } from "@/lib/types";
import HtmlEditorWithUpload from "@/components/HtmlEditorWithUpload";

export default function AdminNewsPage() {
  const { message } = App.useApp();
  const [tinTucs, setTinTucs] = useState<TinTuc[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNews, setEditingNews] = useState<TinTuc | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchTinTucs = async () => {
      setLoading(true);
      try {
        const response = await tinTucAPI.layTatCa();
        setTinTucs(response.data);
      } catch (error) {
        message.error("Không thể tải danh sách tin tức");
      } finally {
        setLoading(false);
      }
    };

    fetchTinTucs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTinTucs = async () => {
    setLoading(true);
    try {
      const response = await tinTucAPI.layTatCa();
      setTinTucs(response.data);
    } catch (error) {
      message.error("Không thể tải danh sách tin tức");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingNews(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: TinTuc) => {
    setEditingNews(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await tinTucAPI.xoa(id);
      message.success("Đã xóa tin tức thành công");
      fetchTinTucs();
    } catch (error) {
      message.error("Không thể xóa tin tức");
    }
  };

  const handleToggleNoiBat = async (id: number, noiBat: boolean) => {
    try {
      const news = tinTucs.find((tt) => tt.id === id);
      if (!news) return;

      const formData = new FormData();
      formData.append("tieu_de", news.tieu_de);
      formData.append("noi_dung", news.noi_dung || "");
      formData.append("noi_bat", noiBat ? "1" : "0");

      await tinTucAPI.sua(id, formData);
      message.success("Đã cập nhật trạng thái nổi bật");
      fetchTinTucs();
    } catch (error) {
      message.error("Không thể cập nhật trạng thái nổi bật");
    }
  };

  const handleSubmit = async (values: unknown) => {
    try {
      const formData = new FormData();
      formData.append("tieu_de", values.tieu_de);
      formData.append("noi_dung", values.noi_dung || "");

      // Xử lý upload ảnh
      if (values.hinh_anh && values.hinh_anh.length > 0) {
        const file = values.hinh_anh[0];
        if (file.originFileObj) {
          formData.append("hinh_anh", file.originFileObj);
        }
      }

      if (editingNews) {
        await tinTucAPI.sua(editingNews.id, formData);
        message.success("Đã cập nhật tin tức thành công");
      } else {
        await tinTucAPI.them(formData);
        message.success("Đã thêm tin tức mới thành công");
      }

      setModalVisible(false);
      fetchTinTucs();
    } catch (error) {
      message.error("Không thể lưu tin tức");
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
      title: "Hình ảnh",
      dataIndex: "hinh_anh",
      key: "hinh_anh",
      width: 100,
      render: (hinh_anh: string) =>
        hinh_anh ? (
          <Image
            src={`http://localhost:5000/uploads/${hinh_anh}`}
            alt="Tin tức"
            width={60}
            height={60}
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: 60,
              height: 60,
              background: "#f0f0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            Không có ảnh
          </div>
        ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "tieu_de",
      key: "tieu_de",
    },
    {
      title: "Ngày tạo",
      dataIndex: "ngay_tao",
      key: "ngay_tao",
      render: (date: string) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Nổi bật",
      key: "noi_bat",
      width: 100,
      render: (_: unknown, record: TinTuc) => (
        <Switch
          checked={record.noi_bat}
          onChange={(checked) => handleToggleNoiBat(record.id, checked)}
        />
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_: unknown, record: TinTuc) => (
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
        <h1>Quản lý tin tức</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm tin tức
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={tinTucs}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingNews ? "Sửa tin tức" : "Thêm tin tức"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="tieu_de"
            label="Tiêu đề"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="hinh_anh"
            label="Hình ảnh chính"
            valuePropName="fileList"
            getValueFromEvent={(e) => {
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}>
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              accept="image/*">
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item name="noi_dung" label="Nội dung">
            <HtmlEditorWithUpload rows={15} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
