import React, { useState, useEffect } from "react";
import { Table, Button, Space, message, Modal, Form, Input } from "antd";
import { FilterOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import edit from "../assets/images/insert.png";
import deleteimg from "../assets/images/delete.png";
import "./UserManage.css";

const UserManage = () => {
  const [users, setUsers] = useState([]); // Người dùng mới
  const [oldUsers, setOldUsers] = useState([]); // Người dùng cũ
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filter, setFilter] = useState({ type: "all" }); // Bộ lọc
  const [form] = Form.useForm();

  // Fetch new users
  useEffect(() => {
    const fetchNewUsers = async () => {
      try {
        const response = await fetch(
          "https://server-vert-rho-94.vercel.app/users/get-NewUsers"
        );
        const result = await response.json();
        setUsers(result.data || []);
      } catch (error) {
        console.error("Lỗi khi tải người dùng mới:", error);
        message.error("Không thể tải danh sách người dùng mới.");
      }
    };
    fetchNewUsers();
  }, []);

  // Fetch old users
  useEffect(() => {
    const fetchOldUsers = async () => {
      try {
        const response = await fetch(
          "https://server-vert-rho-94.vercel.app/users/get-OdlUsers"
        );
        const result = await response.json();
        setOldUsers(result.data || []);
      } catch (error) {
        console.error("Lỗi khi tải người dùng cũ:", error);
        message.error("Không thể tải danh sách người dùng cũ.");
      }
    };
    fetchOldUsers();
  }, []);

  // Function to update user via the API
  const handleEdit = async (values) => {
    try {
      const response = await fetch(
        `https://server-vert-rho-94.vercel.app/users/updateUsers/${editingUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        // Update user list
        setUsers((prev) =>
          prev.map((user) =>
            user._id === editingUser._id ? { ...user, ...values } : user
          )
        );
        setOldUsers((prev) =>
          prev.map((user) =>
            user._id === editingUser._id ? { ...user, ...values } : user
          )
        );
        message.success("Cập nhật người dùng thành công!");
        setIsEditModalVisible(false);
        form.resetFields();
      } else {
        const errorData = await response.json();
        message.error(
          `Error: ${errorData.message || "Không thể cập nhật người dùng"}`
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật người dùng:", error);
      message.error("Không thể cập nhật người dùng.");
    }
  };

  // Function to delete a user
  const handleDelete = (emailOrPhone) => {
    Modal.confirm({
      title: "Xác nhận xóa người dùng",
      content: "Bạn có chắc chắn muốn xóa người dùng này không?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await fetch(
            `https://server-vert-rho-94.vercel.app/users/delete-account`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ emailOrPhone }),
            }
          );

          if (response.ok) {
            setUsers((prev) =>
              prev.filter(
                (user) =>
                  user.email !== emailOrPhone && user.phone !== emailOrPhone
              )
            );
            setOldUsers((prev) =>
              prev.filter(
                (user) =>
                  user.email !== emailOrPhone && user.phone !== emailOrPhone
              )
            );
            message.success("Xóa người dùng thành công!");
          } else {
            message.error("Không thể xóa người dùng.");
          }
        } catch (error) {
          console.error("Lỗi khi xóa người dùng:", error);
          message.error("Không thể xóa người dùng.");
        }
      },
    });
  };

  useEffect(() => {
    if (editingUser) {
      form.setFieldsValue(editingUser);
    }
  }, [editingUser, form]);

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    setEditingUser(null);
    form.resetFields();
  };

  // Bộ lọc dữ liệu hiển thị
  const filteredData = () => {
    if (filter.type === "new") {
      return users;
    } else if (filter.type === "old") {
      return oldUsers;
    } else {
      return [...users, ...oldUsers];
    }
  };

  const columns = [
    {
      title: "ID Người dùng",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Tên Người dùng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <div
            className="editIcon"
            onClick={() => {
              setEditingUser(record);
              setIsEditModalVisible(true);
            }}
            title="Edit"
          >
            <img className="edit" src={edit} alt="Edit" />
          </div>
          <div
            className="deleteIcon"
            onClick={() => handleDelete(record.email || record.phone)}
            title="Delete"
          >
            <img className="delete" src={deleteimg} alt="Delete" />
          </div>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-table-container">
      <div className="header-container">
        <h2 className="QLTK">Quản lý tài khoản</h2>
      </div>

      {/* Bộ lọc */}
      <div className="filter-container">
        <Button
          className="no-hover"
          type={filter.type === "all" ? "primary" : "default"}
          onClick={() => setFilter({ type: "all" })}
        >
          <div style={{ color: "black" }}>Tất cả</div>
        </Button>
       
        <Button
          className="no-hover"
          type={filter.type === "old" ? "primary" : "default"}
          onClick={() => setFilter({ type: "old" })}
        >
          <div style={{ color: "black" }}>Người dùng cũ</div>
        </Button>
      </div>

      {/* Bảng người dùng */}
      <Table
        className="user-table"
        columns={columns}
        dataSource={filteredData()}
        rowKey="_id"
        pagination={{
          pageSize: 5,
          itemRender: (page, type, originalElement) => {
            if (type === "prev") {
              return (
                <Button
                  style={{
                    backgroundColor: "#f0f0f0",
                    color: "#1890ff",
                    top: "-10px",
                  }}
                >
                  <LeftOutlined />
                </Button>
              );
            }
            if (type === "next") {
              return (
                <Button
                  style={{
                    backgroundColor: "#f0f0f0",
                    color: "#1890ff",
                    top: "-10px",
                  }}
                >
                  <RightOutlined />
                </Button>
              );
            }
            return originalElement;
          },
        }}
      />

      {/* Modal chỉnh sửa thông tin người dùng */}
      <Modal
        title="Sửa thông tin người dùng"
        open={isEditModalVisible}
        onCancel={handleEditCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              handleEdit(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" name="edit_user_form">
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManage;
