import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import "./QLHH.css";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await fetch(
          `https://server-vert-rho-94.vercel.app/oder/${id}/getOrderById`
        );
        const result = await response.json();
        if (result.status) {
          setOrder(result.data[0]); // Lấy dữ liệu đơn hàng từ API
        } else {
          setError("Không thể tải dữ liệu đơn hàng");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi gọi API");
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id]);

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

  const handleConfirmOrder = async () => {
    try {
      const result = await Swal.fire({
        title: "Xác nhận đơn hàng?",
        text: "Bạn có chắc chắn muốn xác nhận đơn hàng này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        // Gọi API để cập nhật trạng thái
        const response = await fetch(
          `https://server-vert-rho-94.vercel.app/oder/${id}/updateOrder`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: 2 }), // Cập nhật trạng thái lên 2
          }
        );

        const data = await response.json();
        if (data.status) {
          Swal.fire("Thành công!", "Đơn hàng đã được xác nhận.", "success");
          // Cập nhật trạng thái trong UI
          setOrder((prev) => ({ ...prev, status: 2 }));
        } else {
          Swal.fire("Lỗi!", "Không thể cập nhật trạng thái.", "error");
        }
      }
    } catch (error) {
      Swal.fire("Lỗi!", "Đã xảy ra lỗi khi cập nhật đơn hàng.", "error");
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ width: "100%", display: "flex", gap: "350px" }}>
        <button style={{ background: "white" }} onClick={() => navigate(-1)}>
          <LeftOutlined />
        </button>
        <h1>Chi tiết đơn hàng</h1>
      </div>

      {order && (
        <>
          <div style={{}}>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
                flex: 1,
              }}
            >
              <section className="ctn-f">
                <h2>Thông tin đơn hàng</h2>
                <p>
                  <strong>Mã:</strong> {order._id}
                </p>
                <p>
                  <strong>Ngày tạo:</strong>{" "}
                  {new Date(order.date).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}{" "}
                  lúc{" "}
                  {new Date(order.date).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <p>
                  <strong>Phương thức giao hàng:</strong>{" "}
                  {order.ship === 10 ? "Nhanh" : "Chậm"}
                </p>
                <p>
                  <strong>Trạng thái đơn hàng:</strong>{" "}
                  {getOrderStatus(order.status)}
                </p>
              </section>
              <section className="ctn-f">
                <h2>Thông tin người dùng</h2>
                <p>
                  <strong>Tên:</strong>{" "}
                  {order.cart[0]?.user?.name || "Không có"}
                </p>
              </section>
              <section className="ctn-f">
                <h2>Thông tin nhận hàng</h2>
                <p>
                  <strong>Tên người nhận:</strong>{" "}
                  {order.address?.user?.name || "Không có"}
                </p>
                <p>
                  <strong>Số điện thoại:</strong>{" "}
                  {order.address?.user?.phone || "Không có"}
                </p>
                <p>
                  <strong>Địa chỉ:</strong>{" "}
                  {`${order.address?.houseNumber}, ${order.address?.alley}, ${order.address?.quarter}, ${order.address?.district}, ${order.address?.city}, ${order.address?.country}`}
                </p>
              </section>
            </div>
            
          </div>

          <section style={{ margin: "20px 0", display: "flex", justifyContent: "space-between" }}>
            <div style={{width: "60%"}}>
              <h2>Thông tin sản phẩm</h2>
              <div
                style={{
                  maxHeight: "300px", // Chiều cao tối đa của bảng
                  overflowY: "auto", // Kích hoạt thanh cuộn dọc
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  width: "100%",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th className="headerCellStyle">Hình ảnh</th>
                      <th className="headerCellStyle">Tên sản phẩm</th>
                      <th className="headerCellStyle">Danh mục</th>
                      <th className="headerCellStyle">Số lượng</th>
                      <th className="headerCellStyle">Đơn giá</th>
                      <th className="headerCellStyle">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.cart.map((cartItem) =>
                      cartItem.products.map((product) => (
                        <tr key={`${cartItem._id}-${product._id}`}>
                          <td className="cellStyle" style={{ width: "8%" }}>
                            <div
                              style={{
                                display: "flex",
                                width: "10%",
                                alignItems: "center",
                              }}
                            >
                              {product.images && product.images.length > 0 ? (
                                <img
                                  src={product.images[0]} // Lấy hình ảnh đầu tiên
                                  alt={`Hình ảnh ${product.name}`}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                    borderRadius: "3px",
                                    border: "1px solid #ddd",
                                  }}
                                />
                              ) : (
                                <p>Không có ảnh</p> // Hiển thị thông báo nếu không có hình ảnh
                              )}
                            </div>
                          </td>
                          <td className="cellStyle">{product.name}</td>
                          <td className="cellStyle">
                            {product.category?.category_name || "Không có"}
                          </td>
                          <td className="cellStyle">{product.quantity}</td>
                          <td className="cellStyle">
                            {product.price.toLocaleString()}đ
                          </td>
                          <td className="cellStyle">
                            {order.cart[0]?.total.toLocaleString()}đ
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{ width: "30%"}}>
              <section>
                <h2>Tổng tiền</h2>
                <p>
                  <strong>Tổng giá sản phẩm:</strong>{" "}
                  {order.cart[0]?.total.toLocaleString() || 0}đ
                </p>{" "}
                <p>
                  <strong>Chi phí vận chuyển:</strong>{" "}
                  {order.ship === 1
                    ? "8.000đ"
                    : order.ship === 2
                    ? "10.000đ"
                    : order.ship === 3
                    ? "20.000đ"
                    : "Không xác định"}
                </p>
                <p>
                  <strong>Khuyến mãi:</strong>
                  {order.sale?.length > 0 && order.sale[0].discountAmount > 0
                    ? ` -${order.sale[0].discountAmount.toLocaleString()}đ`
                    : order.sale?.length > 0 &&
                      order.sale[0].discountPercent > 0
                    ? ` -${order.sale[0].discountPercent}%`
                    : " -0đ"}
                </p>
                <p>
                  <strong>Tổng thanh toán:</strong>{" "}
                  {order.totalOrder.toLocaleString() || 0}đ
                </p>
              </section>
            </div>

          </section>
        </>
      )}
      {order.status === 1 && (
        <button
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handleConfirmOrder}
        >
          Xác nhận đơn hàng
        </button>
      )}
    </div>
  );
};

export default OrderDetail;
