import React, { useContext, useState } from "react";
import {
  NotificationOutlined,
  UserOutlined,
  TagOutlined,
  BarChartOutlined,
  ReconciliationOutlined,
  MessageOutlined,
  SettingOutlined,
  PoweroffOutlined, 
} from "@ant-design/icons";
import { Layout, Menu, theme, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import "./NavMenu.css";
import { AdminContext } from "../Component/AdminProvider";
import logoBlue2 from "../assets/images/logoBlue2.jpg";
import Search from "../Component/Search";
import '@fontsource/roboto'; // Tải trọng số mặc định
import '@fontsource/roboto/400.css'; // Tải trọng số cụ thể


const { Content, Sider } = Layout;

const NavMenu = ({ children, isHidden, onLogout }) => {
  const { admin } = useContext(AdminContext);
  const [isModalVisible, setIsModalVisible] = useState(false); // Thêm state để quản lý modal

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    if (e.key === "logout") {
      setIsModalVisible(true); // Hiển thị modal khi chọn đăng xuất
    } else {
      navigate(e.key); // Điều hướng đến trang khi chọn mục khác
    }
  };

  // Mở modal xác nhận đăng xuất
  const showLogoutModal = () => {
    setIsModalVisible(true);
  };

  // Xác nhận đăng xuất
  const handleLogout = () => {
    if (onLogout) {
      onLogout(); // Gọi hàm logout từ parent
    }
    setIsModalVisible(false); // Đóng modal
  };

  // Hủy bỏ đăng xuất
  const handleCancel = () => {
    setIsModalVisible(false); // Đóng modal khi người dùng hủy
  };

  return (
    <Layout className="container-all" style={{ minHeight: "100vh" }}>
      <Layout className="container-allin" style={{ height: "100%" }}>
        {!isHidden && (
          <Sider width={260} className="slider">
            <div className="logo-container">
              <img src={logoBlue2} className="logoBlue" alt="logo" />
            </div>

            <Menu
              className="menu"
              mode="inline"
              defaultSelectedKeys={["/charts"]}
              style={{ height: "50%", borderRight: 0 }}
              items={[
                {
                  key: "/charts",
                  icon: <BarChartOutlined />,
                  label: "Thống kê",
                },
                {
                  key: "/userManage",
                  icon: <UserOutlined />,
                  label: "Quản lý người dùng",
                },
                {
                  key: "3",
                  icon: <ReconciliationOutlined />,
                  label: "Quản lý hàng hóa",
                  children: [
                    { key: "/products", label: "Quản lý sản phẩm" },
                    { key: "/QLHH", label: "Quản lý đơn hàng" },
                 
                  ],
                },
                {
                  key: "/Comment",
                  icon: <MessageOutlined />,
                  label: "Quản lý bình luận",
                },
                {
                  key: "/AddSale",
                  icon: <TagOutlined />,
                  label: "Quản lý khuyến mãi",
                },
                {
                  key: "/Payment",
                  icon: <BarChartOutlined />,
                  label: "Quản lý thanh toán",
                },
                {
                  key: "6",
                  icon: <NotificationOutlined />,
                  label: "Notifications",
                  children: [
                    { key: "/notifications/messages", label: "Message Center" },
                    { key: "/notifications/alerts", label: "System Alerts" },
                  ],
                },
                // Mục đăng xuất trong menu
                {
                  key: "logout",
                  icon: <PoweroffOutlined />,
                  label: "Đăng xuất",
                },
              ]}
              onClick={handleMenuClick}
            />
          </Sider>
        )}
        <Layout className="right-component">
          <div className="rr-component">
            <div className="rrr-cpn">
              <div className="hd-nav">
                <h1>Chào mừng, </h1>
                <p className="admin">{admin?.email}</p>
              </div>
              <p className="date">{new Date().toLocaleDateString()}</p>
            </div>
            <SettingOutlined className="setting-icon" />
          </div>

          {!isHidden && (
            <div className="cpn-search" style={{ width: "95%" }}>
              <Search />
            </div>
          )}
          <Content
            style={{
              padding: 15,  
              height: "50%",
              width: "100%",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>

      {/* Modal xác nhận đăng xuất */}
      <Modal
        title="Xác nhận đăng xuất"
        visible={isModalVisible}
        onOk={handleLogout} // Đảm bảo onOk gọi handleLogout
        onCancel={handleCancel}
        okText="Có"
        cancelText="Không"
      >
        <p>Bạn có chắc chắn muốn đăng xuất?</p>
      </Modal>
    </Layout>
  );
};

export default NavMenu;
