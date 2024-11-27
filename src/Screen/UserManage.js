import React, { useState, useEffect } from "react";
import { Table, Button, Space } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import star from "../assets/images/star.png";
import edit from "../assets/images/insert.png"; // Ensure these assets are correctly imported
import deleteimg from "../assets/images/delete.png";
import "./UserManage.css";

const UserInfoCard = ({ user, showStar }) => {
  const hiddenPassword = "*".repeat(user.password.length);
  return (
    <div className="user-card">
      <div className="title-container">
        <h2 className="text">{user.name}</h2>
        {showStar && <img className="star-icon" src={star} alt="star" />}
      </div>
      <p className="text">
        Email:{" "}
        <a href="#email" className="emailText">
          {user.email}
        </a>
      </p>
      <p className="text">Mật khẩu: {hiddenPassword}</p>
      <div className="bottomUserCard">
        <p className="text">SDT: {user.phone}</p>
        <p className="date">
          Ngày tạo:{" "}
          <span className="dateN">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </p>
      </div>
      <hr />
    </div>
  );
};

const User = () => {
  const [users, setUsers] = useState([]);
  const [oldUsers, setOldUsers] = useState([]);

  // Fetch new users
  useEffect(() => {
    const fetchNewUsers = async () => {
      try {
        const response = await fetch("https://server-vert-rho-94.vercel.app/users/get-NewUsers");
        const result = await response.json();
        setUsers(result.data || []);
      } catch (error) {
        console.error("Error fetching new users:", error);
      }
    };
    fetchNewUsers();
  }, []);

  // Combined users array
  const combinedUsers = [...users, ...oldUsers];

  const handleEdit = (record) => {
    console.log("Edit user:", record);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
    setOldUsers(oldUsers.filter((user) => user.id !== id));
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
      title: "Mật Khẩu",
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
onClick={() => handleEdit(record)}
              title="Edit"
            >
              <img className="edit" src={edit} alt="Edit" />
            </div>
            <div
              className="deleteIcon"
              onClick={() => handleDelete(record.id)}
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
      <Button type="primary" icon={<FilterOutlined />}>
        Bộ lọc
      </Button>
    </div>
    <Table
      className="user-table"
      columns={columns}
      dataSource={combinedUsers}
      rowKey="id"
      pagination={{ pageSize: 5 }}
    />
  </div>
  
  );
};

export default User;