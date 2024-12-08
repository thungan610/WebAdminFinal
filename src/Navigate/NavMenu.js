import React, { useContext, useState } from "react";
import {
  UserOutlined,
  TagOutlined,
  BarChartOutlined,
  ReconciliationOutlined,
  MessageOutlined,
  SettingOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme, Modal } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import "./NavMenu.css";
import { AdminContext } from "../Component/AdminProvider";
import logoBlue2 from "../assets/images/logoBlue2.jpg";
import Search from "../Component/Search";
import "@fontsource/roboto"; 
import "@fontsource/roboto/400.css"; 

const { Content, Sider } = Layout;


const NavMenu = ({ children, isHidden, onLogout }) => {
  const { admin } = useContext(AdminContext);
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();

  const handleMenuClick = (e) => {
    if (e.key === "logout") {
      setIsModalVisible(true); 
    } else {
      navigate(e.key); 
    }
  };

  // Mở modal xác nhận đăng xuất
  const showLogoutModal = () => {
    setIsModalVisible(true);
  };

  // Xác nhận đăng xuất
  const handleLogout = () => {
    if (onLogout) {
      onLogout(); 
    }
    setIsModalVisible(false); 
  };

  // Hủy bỏ đăng xuất
  const handleCancel = () => {
    setIsModalVisible(false); 
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
              defaultSelectedKeys={[location.pathname]}
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
                  key: "/products",
                  icon: <ReconciliationOutlined />,
                  label: "Quản lý sản phẩm",
                  
                },
                {
                  key: "/Comment",
                  icon: <MessageOutlined />,
                  label: "Quản lý bình luận",
                },
                {
                  key: "/PromotionManagementment",
                  icon: <TagOutlined />,
                  label: "Quản lý khuyến mãi",
                },
                {
                  key: "/QLHH",
                  icon: <BarChartOutlined />,
                  label: "Quản lý đơn hàng",
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
