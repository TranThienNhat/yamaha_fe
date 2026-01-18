"use client";

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Upload,
  Popconfirm,
  Image,
  Select,
  Switch,
  App,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { sanPhamAPI, danhMucAPI } from "@/lib/api";
import type { SanPham } from "@/lib/types";

// Component hiển thị danh mục của sản phẩm
function ProductCategories({ productId }: { productId: number }) {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    sanPhamAPI
      .layDanhMuc(productId)
      .then((res) => {
        setCategories(res.data.map((dm: unknown) => dm.ten_danh_muc));
      })
      .catch(() => setCategories([]));
  }, [productId]);

  return <>{categories.length > 0 ? categories.join(", ") : "Chưa có"}</>;
}

export default function AdminProductsPage() {
  const { message } = App.useApp();
  const [sanPhams, setSanPhams] = useState<SanPham[]>([]);
  const [danhMucs, setDanhMucs] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [quantityModalVisible, setQuantityModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SanPham | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<SanPham | null>(null);
  const [form] = Form.useForm();
  const [categoryForm] = Form.useForm();
  const [quantityForm] = Form.useForm();
  const [fileList, setFileList] = useState<unknown[]>([]);

  useEffect(() => {
    const fetchSanPhams = async () => {
      setLoading(true);
      try {
        // Use admin endpoint to get all products including hidden ones
        const response = await sanPhamAPI.layTatCaAdmin();
        setSanPhams(response.data);
      } catch (error) {
        message.error("Không thể tải danh sách sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    const fetchDanhMucs = async () => {
      try {
        const response = await danhMucAPI.layTatCa();
        setDanhMucs(response.data);
      } catch (error) {
        message.error("Không thể tải danh sách danh mục");
      }
    };

    fetchSanPhams();
    fetchDanhMucs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSanPhams = async () => {
    setLoading(true);
    try {
      // Use admin endpoint to get all products including hidden ones
      const response = await sanPhamAPI.layTatCaAdmin();
      setSanPhams(response.data);
    } catch (error) {
      message.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const fetchDanhMucs = async () => {
    try {
      const response = await danhMucAPI.layTatCa();
      setDanhMucs(response.data);
    } catch (error) {
      message.error("Không thể tải danh sách danh mục");
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setFileList([]);
    setModalVisible(true);
  };

  const handleEdit = async (record: SanPham) => {
    setEditingProduct(record);

    // Lấy danh sách danh mục của sản phẩm
    try {
      const response = await sanPhamAPI.layDanhMuc(record.id);
      form.setFieldsValue({
        ...record,
        danh_muc_ids: response.data.map((dm: unknown) => dm.id),
      });
    } catch (error) {
      form.setFieldsValue(record);
    }

    setFileList([]);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await sanPhamAPI.xoa(id);
      message.success("Đã xóa sản phẩm thành công");
      fetchSanPhams();
    } catch (error) {
      message.error("Không thể xóa sản phẩm");
    }
  };

  const handleUpdateQuantity = (record: SanPham) => {
    setSelectedProduct(record);
    quantityForm.setFieldsValue({ so_luong: record.so_luong });
    setQuantityModalVisible(true);
  };

  const handleSubmitQuantity = async (values: { so_luong: number }) => {
    if (!selectedProduct) return;
    
    try {
      await sanPhamAPI.capNhatSoLuong(selectedProduct.id, values);
      message.success("Đã cập nhật số lượng thành công");
      setQuantityModalVisible(false);
      fetchSanPhams();
    } catch (error) {
      message.error("Không thể cập nhật số lượng");
    }
  };
    try {
      const product = sanPhams.find((sp) => sp.id === id);
      if (!product) return;

      const formData = new FormData();
      formData.append("ten_san_pham", product.ten_san_pham);
      formData.append("gia", product.gia.toString());
      formData.append("mo_ta", product.mo_ta || "");
      formData.append("thong_so_ky_thuat", product.thong_so_ky_thuat || "");
      formData.append("noi_bat", noiBat ? "1" : "0");

      await sanPhamAPI.sua(id, formData);
      message.success("Đã cập nhật trạng thái nổi bật");
      fetchSanPhams();
    } catch (error) {
      message.error("Không thể cập nhật trạng thái nổi bật");
    }
  };

  const handleAddCategory = () => {
    categoryForm.resetFields();
    setCategoryModalVisible(true);
  };

  const handleSubmitCategory = async (values: unknown) => {
    try {
      const response = await danhMucAPI.them(values);
      message.success("Đã thêm danh mục mới thành công");
      setCategoryModalVisible(false);
      fetchDanhMucs();

      // Thêm danh mục vừa tạo vào danh sách đã chọn
      const currentIds = form.getFieldValue("danh_muc_ids") || [];
      form.setFieldsValue({
        danh_muc_ids: [...currentIds, response.data.id],
      });
    } catch (error) {
      message.error("Không thể thêm danh mục");
    }
  };

  const handleSubmit = async (values: unknown) => {
    try {
      console.log("DEBUG Frontend: All form values =", values);

      const formData = new FormData();
      formData.append("ten_san_pham", values.ten_san_pham);
      formData.append("gia", values.gia);
      formData.append("mo_ta", values.mo_ta || "");
      formData.append("thong_so_ky_thuat", values.thong_so_ky_thuat || "");
      formData.append("noi_bat", values.noi_bat ? "1" : "0");
      formData.append("so_luong", values.so_luong || "0");

      // Gửi danh sách ID danh mục - PHẢI APPEND TRƯỚC FILE
      console.log("DEBUG Frontend: danh_muc_ids =", values.danh_muc_ids);
      if (
        values.danh_muc_ids &&
        Array.isArray(values.danh_muc_ids) &&
        values.danh_muc_ids.length > 0
      ) {
        const idsJson = JSON.stringify(values.danh_muc_ids);
        formData.append("danh_muc_ids", idsJson);
        console.log("DEBUG Frontend: Sending danh_muc_ids =", idsJson);
      } else {
        console.log("DEBUG Frontend: No categories selected or invalid format");
      }

      // Append nhiều file ảnh (tối đa 5)
      if (fileList.length > 0) {
        fileList.forEach((file, index) => {
          if (file.originFileObj) {
            formData.append("hinh_anh", file.originFileObj);
            console.log(
              `DEBUG Frontend: Added image ${index + 1}: ${file.name}`
            );
          }
        });
      }

      // Debug FormData
      console.log("DEBUG Frontend: FormData entries:");
      for (const pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(pair[0] + ": (File) " + pair[1].name);
        } else {
          console.log(pair[0] + ": " + pair[1]);
        }
      }

      if (editingProduct) {
        await sanPhamAPI.sua(editingProduct.id, formData);
        message.success("Đã cập nhật sản phẩm thành công");
      } else {
        await sanPhamAPI.them(formData);
        message.success("Đã thêm sản phẩm mới thành công");
      }

      setModalVisible(false);
      fetchSanPhams();
    } catch (error) {
      message.error("Không thể lưu sản phẩm");
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
      dataIndex: "hinh_anh_url",
      key: "hinh_anh_url",
      width: 100,
      render: (url: string) =>
        url ? (
          <img
            src={url}
            alt="Product"
            style={{
              width: 60,
              height: 60,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        ) : (
          "Không có"
        ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "ten_san_pham",
      key: "ten_san_pham",
    },
    {
      title: "Giá",
      dataIndex: "gia",
      key: "gia",
      render: (gia: number) => `${gia.toLocaleString("vi-VN")} đ`,
    },
    {
      title: "Số lượng",
      dataIndex: "so_luong",
      key: "so_luong",
      width: 100,
      render: (soLuong: number) => (
        <span style={{ color: soLuong <= 0 ? "red" : "inherit" }}>
          {soLuong}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      key: "trang_thai",
      width: 100,
      render: (_: unknown, record: SanPham) => {
        if (record.an) {
          return <span style={{ color: "red" }}>Ẩn (Hết hàng)</span>;
        }
        return <span style={{ color: "green" }}>Hiển thị</span>;
      },
    },
    {
      title: "Danh mục",
      key: "danh_muc",
      render: (_: unknown, record: SanPham) => (
        <ProductCategories productId={record.id} />
      ),
    },
    {
      title: "Nổi bật",
      key: "noi_bat",
      width: 100,
      render: (_: unknown, record: SanPham) => (
        <Switch
          checked={record.noi_bat}
          onChange={(checked) => handleToggleNoiBat(record.id, checked)}
        />
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 200,
      render: (_: unknown, record: SanPham) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Button
            type="primary"
            size="small"
            onClick={() => handleUpdateQuantity(record)}
          >
            Số lượng
          </Button>
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
        <h1>Quản lý sản phẩm</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm sản phẩm
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={sanPhams}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="ten_san_pham"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="gia"
            label="Giá"
            rules={[{ required: true, message: "Vui lòng nhập giá" }]}>
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>

          <Form.Item
            name="so_luong"
            label="Số lượng"
            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}>
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Nhập số lượng sản phẩm"
            />
          </Form.Item>

          <Form.Item name="danh_muc_ids" label="Danh mục">
            <Select
              mode="multiple"
              placeholder="Chọn danh mục"
              allowClear
              showSearch
              style={{ width: "100%" }}
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={danhMucs.map((dm) => ({
                value: dm.id,
                label: dm.ten_danh_muc,
              }))}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={handleAddCategory}
              block>
              Thêm danh mục mới
            </Button>
          </Form.Item>

          <Form.Item name="mo_ta" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Mô tả ngắn gọn về sản phẩm" />
          </Form.Item>

          <Form.Item name="thong_so_ky_thuat" label="Thông số kỹ thuật">
            <Input.TextArea
              rows={4}
              placeholder="Ví dụ: Động cơ 155cc, Công suất 15PS..."
            />
          </Form.Item>

          <Form.Item
            name="noi_bat"
            label="Sản phẩm nổi bật"
            valuePropName="checked">
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>

          <Form.Item label="Hình ảnh" extra="Tối đa 5 ảnh">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              maxCount={5}
              multiple>
              {fileList.length >= 5 ? null : (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Chọn ảnh</div>
                </div>
              )}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal thêm danh mục */}
      <Modal
        title="Thêm danh mục mới"
        open={categoryModalVisible}
        onCancel={() => setCategoryModalVisible(false)}
        onOk={() => categoryForm.submit()}>
        <Form
          form={categoryForm}
          layout="vertical"
          onFinish={handleSubmitCategory}>
          <Form.Item
            name="ten_danh_muc"
            label="Tên danh mục"
            rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}>
            <Input placeholder="Ví dụ: Xe côn tay, Xe tay ga..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal cập nhật số lượng */}
      <Modal
        title="Cập nhật số lượng"
        open={quantityModalVisible}
        onCancel={() => setQuantityModalVisible(false)}
        onOk={() => quantityForm.submit()}>
        <Form
          form={quantityForm}
          layout="vertical"
          onFinish={handleSubmitQuantity}>
          <Form.Item
            name="so_luong"
            label="Số lượng"
            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}>
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              placeholder="Nhập số lượng sản phẩm"
            />
          </Form.Item>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Lưu ý: Khi số lượng = 0, sản phẩm sẽ tự động bị ẩn khỏi trang chủ
          </p>
        </Form>
      </Modal>
    </div>
  );
}
