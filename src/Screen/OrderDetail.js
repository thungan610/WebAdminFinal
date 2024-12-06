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
    <div style={{ padding: "20px", background: "rgba(155, 174, 202, 0.1)", borderRadius: "8px" }}>
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
                <h4  >Thông tin đơn hàng</h4>
                <hr  className="hrne" />
                <div className="order-infoCTN">
                  <p>
                    <p>Mã:</p>
                  </p>
                  <strong>{order._id}</strong>
                </div>

                <div className="order-infoCTN">
                  <p>
                    <p>Ngày tạo:</p>{" "}
                  </p>
                  <strong>
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
                  </strong>
                </div>
                <div className="order-infoCTN">
                  <p>
                    <p>Phương thức giao hàng:</p>
                  </p>
                  <strong style={{color: order.deliveryMethod === "Nhanh" ? "red" : "black"}}> {order.ship === 10 ? "Nhanh" : "Chậm"}</strong>
                </div>

                <div className="order-infoCTN">
                  <p>
                    <p>Trạng thái đơn hàng:</p>
                  </p>
                  <strong> {getOrderStatus(order.status)}</strong>
                </div>
              </section>
              <section className="ctn-f">
                <h4>Thông tin khách hàng</h4>
                <hr  className="hrne" />
                <div className="order-infoCTN">
                  <p>Tên tài khoản:</p>
                  <strong> {order.cart[0]?.user?.name || "Không có"}</strong>
                </div>
                <div className="order-infoCTN">
                  <p>Tên người nhận:</p>
                  <strong> {order.address?.user?.name || "Không có"}</strong>
                </div>
                <div className="order-infoCTN">
                  <p>Số điện thoại:</p>
                  <strong> {order.address?.user?.phone || "Không có"}</strong>
                </div>{" "}
              </section>
            </div>
          </div>
          
          <section className="ctn-f2">
            <div className="order-infoCTNA">
              <h4>Địa chỉ nhận hàng: </h4>
              <hr  className="hrne" />
              <p>
                {" "}
                {`${order.address?.houseNumber}, ${order.address?.alley}, ${order.address?.quarter}, ${order.address?.district}, ${order.address?.city}, ${order.address?.country}`}
              </p>
            </div>
            <div className="order-infoCTNA">
              <h4>Thông tin thanh toán: </h4>
              <hr  className="hrne" />
              <p>
                {" "}
                {`${order.address?.houseNumber}, ${order.address?.alley}, ${order.address?.quarter}, ${order.address?.district}, ${order.address?.city}, ${order.address?.country}`}
              </p>
            </div>
          </section>
        
          
          <section
            style={{
              margin: "10px 0",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ width: "63.5%", background: "white", padding: "10px", borderRadius: "8px",  }}>
              <h4>Thông tin sản phẩm</h4>
              <div
                style={{
                  maxHeight: "300px", // Chiều cao tối đa của bảng
                  overflowY: "auto", // Kích hoạt thanh cuộn dọc
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  width: "100%",
                  marginTop: "10px",
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
            <div style={{ width: "35%" }}>
              <section style={{ background: "white", padding: "10px", borderRadius: "8px"}}>
                <h4>Tổng tiền</h4>
                <hr  className="hrne" />
                <div className="order-infoCTN">
                  <p>Tổng giá sản phẩm:</p>
                  <p> {order.cart[0]?.total.toLocaleString() || 0}đ</p>
                </div>{" "}
                <div className="order-infoCTN">
                  <p>Chi phí vận chuyển:</p>{" "}
                  {order.ship === 1
                    ? "8.000đ"
                    : order.ship === 2
                    ? "10.000đ"
                    : order.ship === 3
                    ? "20.000đ"
                    : "Không xác định"}
                </div>
                <div className="order-infoCTN">
                  <p>Khuyến mãi:</p>
                  {order.sale?.length > 0 && order.sale[0].discountAmount > 0
                    ? ` -${order.sale[0].discountAmount.toLocaleString()}đ`
                    : order.sale?.length > 0 &&
                      order.sale[0].discountPercent > 0
                    ? ` -${order.sale[0].discountPercent}%`
                    : " -0đ"}
                </div>
                <div className="order-infoCTN">
                  <p>Tổng thanh toán:</p>
                  <strong> {order.totalOrder.toLocaleString() || 0}đ</strong>
                </div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
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
              </section>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default OrderDetail;
