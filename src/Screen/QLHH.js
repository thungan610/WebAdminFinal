import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./QLHH.css";
import { FloatButton } from 'antd';

const QLHH = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // Lưu đơn hàng đang chọn
  const [isModalOpen, setModalOpen] = useState(false); // Trạng thái modal

  useEffect(() => {
    const getOrder = async () => {
      try {
        const response = await fetch("http://localhost:6677/oder/getAllOrder");
        const result = await response.json();

        if (result.status) {
          const formattedOrder = result.data.map((orderItem) => {
            console.log("Dữ liệu orderItem:", orderItem); // Debug dữ liệu đơn hàng
            return {
              id: orderItem._id,
              email: orderItem.address?.user?.name || "Không có tên", // Tên người dùng
              phone: orderItem.address?.user?.phone || "Không có số điện thoại", // Số điện thoại
              address:
                `${orderItem.address?.houseNumber || ""}, ${
                  orderItem.address?.alley || ""
                }, ${orderItem.address?.quarter || ""}, ${
                  orderItem.address?.district || ""
                }, ${orderItem.address?.city || ""}, ${
                  orderItem.address?.country || ""
                }`.replace(/, ,| ,|,$/g, "") || "Không có địa chỉ", // Địa chỉ đầy đủ
              deliveryMethod: orderItem.ship === 1 ? "Nhanh" : "Chậm", // Hình thức giao
              orderStatus: getOrderStatus(orderItem.status), // Trạng thái đơn hàng
              currentStatus: orderItem.status, // Trạng thái hiện tại (để xử lý cập nhật)
              totalPayment: `${orderItem.totalOrder || 0}đ`, // Tổng tiền
              date: new Date(orderItem.date).toLocaleString("vi-VN"), // Ngày đặt
            };
          });

          console.log("Dữ liệu đơn hàng đã format:", formattedOrder); // Debug toàn bộ đơn hàng
          setOrder(formattedOrder);
        } else {
          console.error("API trả về lỗi:", result);
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
        `http://localhost:6677/oder/${id}/updateOrder`, // Sửa từ 'oder' thành 'order'
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
    setSelectedOrder(order); // Lưu đơn hàng được chọn
    setModalOpen(true); // Mở modal
  };

  const handleConfirmUpdate = () => {
    if (selectedOrder) {
      updateOrderStatus(selectedOrder.id, selectedOrder.currentStatus);
    }
    setModalOpen(false); // Đóng modal
  };

  const handleCancelUpdate = () => {
    setSelectedOrder(null); // Xóa đơn hàng được chọn
    setModalOpen(false); // Đóng modal
  };

  return (
    <div className="qlhh-container">
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
          {order.map((item, index) => (
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
                  color: getOrderStatusColor(item.orderStatus),
                }}
              >
                <span
                  style={{
                    cursor: item.currentStatus < 4 ? "pointer" : "not-allowed",
                  }}
                  onClick={() => handleUpdateClick(item)}
                >
                  {item.orderStatus}
                </span>
              </td>
              <td style={{ textAlign: "center" }}>{item.totalPayment}</td>
              <td style={{ textAlign: "center" }}>
                {item.date}{" "}
                <FloatButton
                  onClick={() => navigate(`/OrderDetail/${item.id}`)} // Thêm dấu '/' vào URL
                  className="details-button"
                >
                  Chi tiết
                </FloatButton>{" "}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
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
