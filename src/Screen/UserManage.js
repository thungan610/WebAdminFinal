import React, { useState, useEffect } from "react";
import { Table, Button, Space, message, Modal, Empty } from "antd";
import { FilterOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import edit from "../assets/images/insert.png";
import deleteimg from "../assets/images/delete.png";
import "./UserManage.css";

const UserManage = () => {
  const [users, setUsers] = useState([]); // Dữ liệu người dùng mới
  const [oldUsers, setOldUsers] = useState([]); // Dữ liệu người dùng cũ
  const [isFiltered, setIsFiltered] = useState(false); // Trạng thái bộ lọc

  // Hàm gọi API để lấy dữ liệu
  const fetchUsers = async () => {
    try {
      const url = isFiltered
        ? "https://server-vert-rho-94.vercel.app/users/get-OdlUsers" // API người dùng trên 3 tháng
        : "https://server-vert-rho-94.vercel.app/users/get-NewUsers"; // API tất cả người dùng mới

      const response = await fetch(url);
      const result = await response.json();

      if (response.ok) {
        if (isFiltered) {
          setOldUsers(result.data || []);
        } else {
          setUsers(result.data || []);
        }
      } else {
        message.error(result.message || "Lỗi khi tải dữ liệu");
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu người dùng:", error);
      message.error("Lỗi kết nối đến máy chủ");
    }
  };

  // Gọi API khi component mount hoặc trạng thái `isFiltered` thay đổi
  useEffect(() => {
    fetchUsers();
  }, [isFiltered]);

  // Hàm xóa người dùng
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
            "https://server-vert-rho-94.vercel.app/users/delete-account",
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ emailOrPhone }),
            }
          );

          if (response.ok) {
            // Xóa người dùng khỏi danh sách hiển thị
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
            const errorData = await response.json();
            message.error(errorData.message || "Không xóa được người dùng");
          }
        } catch (error) {
          console.error("Lỗi khi xóa người dùng:", error);
          message.error("Lỗi kết nối đến máy chủ");
        }
      },
    });
  };

  // Cấu hình cột cho bảng
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
      title: "Mật khẩu",
      dataIndex: "password",
      key: "password",
      render: (password) => (
        <span className="password-style">
          {"*".repeat(Math.min(9, password.length))}
        </span>
      ),
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
          <div className="editDiv">
            <div
              className="editIcon"
              onClick={() => console.log("Edit user:", record)}
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
          </div>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-table-container">
      <h2 className="QLTK">Quản lý tài khoản</h2>
      <div style={{ marginBottom: 20 }}>
        <Button
          type="primary"
          icon={<FilterOutlined />}
          onClick={() => setIsFiltered(!isFiltered)}
        >
          {isFiltered ? "Bỏ lọc" : "Bộ lọc"}
        </Button>
      </div>
      {/* Hiển thị trạng thái */}
      {isFiltered && <p style={{ color: "red" }}>Đang lọc người dùng trên 3 tháng</p>}

      {/* Kiểm tra dữ liệu trước khi hiển thị bảng */}
      {isFiltered && oldUsers.length === 0 && (
        <Empty description="Chưa có người dùng trên 3 tháng" />
      )}
      {!isFiltered && users.length === 0 && (
        <Empty description="Chưa có người dùng mới" />
      )}

      <Table
        className="user-table"
        columns={columns}
        dataSource={isFiltered ? oldUsers : users}
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
    </div>
  );
};

export default UserManage;
