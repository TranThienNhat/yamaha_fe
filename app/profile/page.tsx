"use client";

import { useEffect, useState } from "react";
import {
  Layout,
  Card,
  Tabs,
  Form,
  Input,
  Button,
  message,
  Modal,
  Descriptions,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  LogoutOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { authUtils } from "@/lib/auth";
import { nguoiDungAPI } from "@/lib/api";
import type { NguoiDung } from "@/lib/types";

const { Content } = Layout;
const { TabPane } = Tabs;

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<NguoiDung | null>(null);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    const currentUser = authUtils.getUser();
    if (!currentUser) {
      router.push(`/login?redirect=/profile`);
      return;
    }
    setUser(currentUser);
    fetchUserInfo(currentUser.id);
  }, [router]);

  const fetchUserInfo = async (id: number) => {
    try {
      const response = await nguoiDungAPI.layThongTin(id);
      setUser(response.data);
      authUtils.setUser(response.data);
    } catch (error) {
      message.error("Lỗi khi tải thông tin người dùng");
    }
  };

  const handleLogout = () => {
    Modal.confirm({
      title: "Xác nhận đăng xuất",
      content: "Bạn có chắc muốn đăng xuất?",
      okText: "Đăng xuất",
      cancelText: "Hủy",
      onOk: () => {
        authUtils.logout();
      },
    });
  };

  const handleEditProfile = () => {
    if (user) {
      form.setFieldsValue({
        ho_ten: user.ho_ten,
        email: user.email,
        sdt: user.sdt,
      });
      setEditModalVisible(true);
    }
  };

  const handleUpdateProfile = async (values: any) => {
    if (!user) return;

    setLoading(true);
    try {
      await nguoiDungAPI.capNhat(user.id, values);
      message.success("Cập nhật thông tin thành công");
      setEditModalVisible(false);
      fetchUserInfo(user.id);
    } catch (error) {
      message.error("Lỗi khi cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values: any) => {
    if (!user) return;

    setLoading(true);
    try {
      await nguoiDungAPI.doiMatKhau(user.id, {
        mat_khau_cu: values.mat_khau_cu,
        mat_khau_moi: values.mat_khau_moi,
      });
      message.success("Đổi mật khẩu thành công");
      setPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error: unknown) {
      message.error(error.response?.data?.error || "Lỗi khi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Content style={{ padding: "50px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Card
            title="Thông tin tài khoản"
            extra={
              <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>
                Đăng xuất
              </Button>
            }>
            <Tabs defaultActiveKey="1">
              <TabPane
                tab={
                  <span>
                    <UserOutlined />
                    Thông tin cá nhân
                  </span>
                }
                key="1">
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Tên đăng nhập">
                    {user.ten_dang_nhap}
                  </Descriptions.Item>
                  <Descriptions.Item label="Họ và tên">
                    {user.ho_ten || "Chưa cập nhật"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    {user.email || "Chưa cập nhật"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    {user.sdt || "Chưa cập nhật"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Vai trò">
                    {user.vai_tro === "admin" ? "Quản trị viên" : "Khách hàng"}
                  </Descriptions.Item>
                </Descriptions>

                <div style={{ marginTop: 24, display: "flex", gap: 16 }}>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={handleEditProfile}>
                    Cập nhật thông tin
                  </Button>
                  <Button
                    icon={<LockOutlined />}
                    onClick={() => setPasswordModalVisible(true)}>
                    Đổi mật khẩu
                  </Button>
                </div>
              </TabPane>
            </Tabs>
          </Card>
        </div>
      </Content>

      {/* Modal cập nhật thông tin */}
      <Modal
        title="Cập nhật thông tin"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}>
        <Form form={form} layout="vertical" onFinish={handleUpdateProfile}>
          <Form.Item
            name="ho_ten"
            label="Họ và tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="sdt"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại" },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal đổi mật khẩu */}
      <Modal
        title="Đổi mật khẩu"
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}>
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}>
          <Form.Item
            name="mat_khau_cu"
            label="Mật khẩu cũ"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu cũ" }]}>
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="mat_khau_moi"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}>
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="xac_nhan_mat_khau"
            label="Xác nhận mật khẩu mới"
            dependencies={["mat_khau_moi"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("mat_khau_moi") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp")
                  );
                },
              }),
            ]}>
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}
