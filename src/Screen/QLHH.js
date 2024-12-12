import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import deleteimg from "../assets/images/delete.png";
import "./QLHH.css";
import search from "../assets/images/search.png";

const QLHH = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState([]);
  const [currentFilter, setCurrentFilter] = useState(1); // Default: "Chờ xác nhận"
  const [searchKey, setSearchKey] = useState("");

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
            deliveryMethod:
              orderItem.ship === 1
                ? "Tiết kiệm"
                : orderItem.ship === 2
                ? "Nhanh"
                : "Hỏa tốc",
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
    (item) =>
      item.currentStatus === currentFilter &&
      item.email.toLowerCase().includes(searchKey.toLowerCase())
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
        `https://server-vert-rho-94.vercel.app/oder/${id}/deleteOrder`,
        { method: "DELETE" }
      );
      const result = await response.json();

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
      <div
        className="filter-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "10px 0",
        }}
      >
        <div
          className="filter-buttons"
          style={{ display: "flex", gap: "10px" }}
        >
          {[1, 2, 3, 4].map((status) => (
            <button
              key={status}
              style={{
                border: "2px solid rgba(155, 174, 202, 0.1)",
                borderRadius: "8px",
                cursor: "pointer",
                backgroundColor: "white",
                outline: "none",
                transition: "border-color 0.3s, box-shadow 0.3s",
                width: "150px",
                display: "flex",
                justifyContent:"center",
                alignItems: "center",
                height: "36px",
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
        <div
          className="search-box"
          style={{ position: "relative", width: "300px" }}
        >
          <input
            type="text"
            onChange={(e) => setSearchKey(e.target.value)}
            value={searchKey}
            placeholder="Tìm kiếm người dùng"
           
          />
          <img
            src={search}
            alt="search-icon"
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              width: "20px",
              height: "20px",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <table className="order-table">
          <thead>
            <tr>
              <th>Mã đơn hàng</th>
              <th>Tên người dùng</th>
              <th>Hình thức giao</th>
              <th>Trạng thái</th>
              <th>Tổng tiền</th>
              <th>Ngày đặt</th>
              <th>Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((item, index) => (
              <tr key={index}>
                <td style={{ textAlign: "center" }}>
                  <strong>{item.id}</strong>
                </td>
                <td style={{ color: "blue" }}>{item.email}</td>

                <td
                  style={{
                    color:
                      item.deliveryMethod === "Tiết kiệm"
                        ? "green"
                        : item.deliveryMethod === "Nhanh"
                        ? "red"
                        : item.deliveryMethod === "Hỏa tốc"
                        ? "orange"
                        : "black",
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
                  {item.orderStatus}
                </td>
                <td style={{ textAlign: "center" }}>{item.totalPayment}</td>
                <td>{item.date}</td>
                <td style={{ textAlign: "center" }}>
                  <button
                    onClick={() => navigate(`/OrderDetail/${item.id}`)}
                    className="details-button"
                    style={{
                      padding: "5px 10px",
                      marginRight: "5px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Chi tiết
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    Xóa
                  </button>
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
