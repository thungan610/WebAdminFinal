import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./QLHH.css";
import { FloatButton } from "antd";

const QLHH = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState([]);
  const [currentFilter, setCurrentFilter] = useState(1); // Mặc định: trạng thái "Chờ xác nhận"
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

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

  const updateOrderStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus + 1;
    if (nextStatus > 3) {
      alert("Không thể cập nhật trạng thái này!");
      return;
    }

    try {
      const response = await fetch(
        `https://server-vert-rho-94.vercel.app/oder/${id}/updateOrder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: nextStatus }),
        }
      );
      const result = await response.json();
      if (result.status) {
        setOrder((prevOrders) =>
          prevOrders.map((item) =>
            item.id === id
              ? {
                  ...item,
                  orderStatus: getOrderStatus(nextStatus),
                  currentStatus: nextStatus,
                }
              : item
          )
        );
        alert("Cập nhật trạng thái thành công!");
      } else {
        alert("Cập nhật trạng thái thất bại!");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  const handleUpdateClick = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleConfirmUpdate = () => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, selectedOrder.currentStatus);
    }
    setModalOpen(false);
  };

  const handleCancelUpdate = () => {
    setSelectedOrder(null);
    setModalOpen(false);
  };

  const filteredOrders = order.filter(
    (item) => item.currentStatus === currentFilter
  );

  return (
    <div className="qlhh-container">
      {/* Nút chuyển trạng thái */}
      <div className="filter-buttons">
        {[1, 2, 3, 4].map((status) => (
          <button
            key={status}
            onClick={() => setCurrentFilter(status)}
            className={currentFilter === status ? "active" : ""}
          >
            {getOrderStatus(status)}
          </button>
        ))}
      </div>

      <table className="order-table">
        <thead>
          <tr>
            <th>Tên người dùng</th>
            <th>Địa chỉ</th>
            <th>Số điện thoại</th>
            <th>Mã đơn hàng</th>
            <th>Hình thức giao</th>
            <th>Trạng thái</th>
            <th>Tổng tiền</th>
            <th>Ngày đặt</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((item, index) => (
            <tr key={index}>
              <td style={{ color: "blue" }}>{item.email}</td>
              <td>{item.address}</td>
              <td>{item.phone}</td>
              <td style={{ textAlign: "center" }}>
                <strong>{item.id}</strong>
              </td>
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
                  cursor: item.currentStatus < 4 ? "pointer" : "not-allowed",
                  color: getOrderStatusColor(item.orderStatus), // Áp dụng màu sắc
                }}
                onClick={() => handleUpdateClick(item)}
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
                  <button
                    onClick={() => navigate(`/OrderDetail/${item.id}`)}
                    className="details-button"
                  >
                    Chi tiết
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <p>
              Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng{" "}
              <strong>{selectedOrder?.id}</strong>?
            </p>
            <button onClick={handleConfirmUpdate} className="confirm-button">
              Xác nhận
            </button>
            <button onClick={handleCancelUpdate} className="cancel-button">
              Hủy
            </button>
          </div>
        </div>
      )}
      <p className="luuy">*Lưu ý: Ấn vào ô trạng thái để cập nhật</p>
    </div>
  );
};

export default QLHH;
