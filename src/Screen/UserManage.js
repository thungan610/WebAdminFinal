import React, { useState, useEffect } from "react";
import { Table, Button, Space, message, Modal, Form, Input } from "antd";
import { FilterOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import edit from "../assets/images/insert.png";
import deleteimg from "../assets/images/delete.png";
import search from "../assets/images/search.png"
import "./UserManage.css";

const UserManage = () => {
  const [users, setUsers] = useState([]); // New users
  const [oldUsers, setOldUsers] = useState([]); // Old users
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [filter, setFilter] = useState({ type: "all" }); // Filter
  const [form] = Form.useForm();
  const [searchKey, setSearchKey] = useState("");

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
        console.error("Error fetching new users:", error);
        message.error("Unable to load new users.");
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
        console.error("Lỗi khi lấy thông tin người dùng cũ:", error);
        message.error("Lỗi khi lấy thông tin người dùng mới.");
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
        message.success("Người dùng đã cập nhật thành công.!");
        setIsEditModalVisible(false);
        form.resetFields();
      } else {
        const errorData = await response.json();
        message.error(
          `Error: ${errorData.message || "Không thể cập nhật người dùng"}`
        );
      }
    } catch (error) {
      console.error("Lỗi cập nhật người dùng:", error);
      message.error("Không thể cập nhật người dùng..");
    }
  };

  // Function to delete a user
  const handleDelete = (emailOrPhone) => {
    Modal.confirm({
      title: "Confirm user deletion",
      content: "Are you sure you want to delete this user?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
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
            message.success("User deleted successfully!");
          } else {
            message.error("Unable to delete user.");
          }
        } catch (error) {
          console.error("Error deleting user:", error);
          message.error("Unable to delete user.");
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

  // Filter data based on selected filter and search key
  const filteredData = () => {
    const allUsers = [...users, ...oldUsers];
    const filteredByType = filter.type === "new" ? users : filter.type === "old" ? oldUsers : allUsers;
    return filteredByType.filter((user) =>
      user.name.toLowerCase().includes(searchKey.toLowerCase())
    );
  };

  const columns = [
    {
      title: "ID người dùng",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Tên người dùng",
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
      title: "Tác vụ",
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
        <h2 className="QLTK">Quản lí tài khoản người dùng</h2>
      </div>

      {/* Filter */}
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
        <div className="search-box">
          <input
            type="text"
            onChange={(e) => setSearchKey(e.target.value)}
            value={searchKey}
            placeholder="Tìm kiếm người dùng"
            className="search-input"

          />
          <img src={search} alt="search-icon" className="search-icon" />
        </div>
      </div>

      {/* User Table */}
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
                    top: "1px",
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
                    top: "1px",
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


      <Modal
        title="Chỉnh sửa thông tin người dùng"
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
        <Form form={form} layout="vertical" name="Chỉnh sửa thông tin người dùng">
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại.!" },
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
