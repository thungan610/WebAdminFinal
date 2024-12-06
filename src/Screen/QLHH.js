import { Flex } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import deleteimg from "../assets/images/delete.png";
import "./QLHH.css";

const QLHH = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState([]);
  const [currentFilter, setCurrentFilter] = useState(1); // Mặc định: trạng thái "Chờ xác nhận"

  useEffect(() => {
    const getOrder = async () => {
      try {
        const response = await fetch(
          "https://server-vert-rho-94.vercel.app/oder/getAllOrder"
        );
        const result = await response.json();
        if (result.status) {
          const formattedOrder = result.data.map((orderItem) => ({
            id: orderItem._id,
            email: orderItem.address?.user?.name || "Không có tên",
            phone: orderItem.address?.user?.phone || "Không có số điện thoại",
            address:
              `${orderItem.address?.houseNumber || ""}, ${
                orderItem.address?.alley || ""
              }, ${orderItem.address?.quarter || ""}, ${
                orderItem.address?.district || ""
              }, ${orderItem.address?.city || ""}, ${
                orderItem.address?.country || ""
              }`.replace(/, ,| ,|,$/g, "") || "Không có địa chỉ",
            deliveryMethod: orderItem.ship === 1 ? "Nhanh" : "Chậm",
            orderStatus: getOrderStatus(orderItem.status),
            currentStatus: orderItem.status,
            totalPayment: `${orderItem.totalOrder.toLocaleString() || 0}đ`,
            date: new Date(orderItem.date).toLocaleString("vi-VN"),
          }));
          setOrder(formattedOrder);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    getOrder();
  }, []);

  const getOrderStatus = (status) => {
    switch (status) {
      case 1:
        return "Chờ xác nhận";
      case 2:
        return "Đang vận chuyển";
      case 3:
        return "Hoàn thành";
      case 4:
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "Chờ xác nhận":
        return "orange";
      case "Đang vận chuyển":
        return "green";
      case "Hoàn thành":
        return "blue";
      case "Đã hủy":
        return "red";
      default:
        return "black";
    }
  };

  const filteredOrders = order.filter(
    (item) => item.currentStatus === currentFilter
  );

  const handleDelete = async (id) => {
    try {
      const _result = await Swal.fire({
        title: "Bạn có chắc chắn?",
        text: "Không thể hoàn tác hành động này!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Vâng, xóa nó!",
      });
      if (!_result.isConfirmed) return;
  
      const response = await fetch(
        `http://localhost:6677/oder/${id}/deleteOrder`,
        { method: "DELETE" }
      );
      const result = await response.json();
  
      console.log("API Response:", result);
  
      if (result.status && result.data) {
        setOrder(order.filter((item) => item.id !== id)); 
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Đơn hàng đã được xóa.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: "Xóa đơn hàng thất bại.",
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể xóa đơn hàng.",
      });
    }
  };
  

  return (
    <div className="qlhh-container">
      <div className="filter-buttons">
        {[1, 2, 3, 4].map((status) => (
          <button
            key={status}
            style={{
              margin: "10px",
              padding: "10px 20px",
              border: "2px solid rgba(155, 174, 202, 0.1)",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: "white",
              outline: "none",
              transition: "border-color 0.3s, box-shadow 0.3s",
              width: "150px",
              borderBottom:
                currentFilter === status
                  ? "2px solid #27AAE1"
                  : "2px solid rgba(155, 174, 202, 0.1)",
            }}
            onClick={() => setCurrentFilter(status)}
            className={currentFilter === status ? "active" : ""}
          >
            {getOrderStatus(status)}
          </button>
        ))}
      </div>

      {filteredOrders.length > 0 ? (
        <table className="order-table">
          <thead>
            <tr>
              <th>Mã đơn hàng</th>
              <th>Tên người dùng</th>
              <th>Số điện thoại</th>
              <th>Hình thức giao</th>
              <th>Trạng thái</th>
              <th>Tổng tiền</th>
              <th>Ngày đặt</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((item, index) => (
              <tr key={index}>
                <td style={{ textAlign: "center" }}>
                  <strong>{item.id}</strong>
                </td>
                <td style={{ color: "blue" }}>{item.email}</td>
                <td>{item.phone}</td>
                <td
                  style={{
                    color: item.deliveryMethod === "Nhanh" ? "red" : "black",
                    textAlign: "center",
                  }}
                >
                  {item.deliveryMethod}
                </td>
                <td
                  style={{
                    textAlign: "center",
                    color: getOrderStatusColor(item.orderStatus), // Áp dụng màu sắc
                  }}
                >
                  {item.orderStatus}
                </td>
                <td style={{ textAlign: "center" }}>{item.totalPayment}</td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <span>{item.date}</span>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        paddingTop: "5px",
                        gap: "5px",
                        cursor: "pointer"
                      }}
                    >
                      <button
                        onClick={() => navigate(`/OrderDetail/${item.id}`)}
                        className="details-button"
                      >
                        Chi tiết
                      </button>
                      <div
                        style={{
                          background: "red",
                          width: "25px",
                          height: "25px",
                          borderRadius: "5px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center"
                        }}
                        onClick={() => handleDelete(item.id)}
                        title="Delete"
                      >
                        <img
                          style={{ width: "18px", height: "18px", }}
                          src={deleteimg}
                          alt="Delete"
                        />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div
          className="no-orders"
          style={{
            width: "100%",
            textAlign: "center",
            marginTop: "10px",
            fontSize: "16px",
          }}
        >
          <p>Không có đơn hàng nào!</p>
        </div>
      )}
    </div>
  );
};

export default QLHH;
