import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
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
        return "Đang xử lý";
      case 2:
        return "Đang giao";
      case 3:
        return "Hoàn thành";
      case 4:
        return "Đã hủy";
      default:
        return "Không xác định";
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
          <div style={{ display: "flex", gap: "350px"}}>
            <div>
              <section>
                <h2>Thông tin người dùng</h2>
                <p>
                  <strong>Tên:</strong>{" "}
                  {order.cart[0]?.user?.name || "Không có"}
                </p>
              </section>
              <section>
                <h2>Thông tin giao hàng</h2>
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
            <div>
              <section>
                <h2>Thông tin đơn hàng</h2>
                <p>
                  <strong>Phương thức giao hàng:</strong>{" "}
                  {order.ship === 10 ? "Nhanh" : "Chậm"}
                </p>
                <p>
                  <strong>Trạng thái đơn hàng:</strong>{" "}
                  {getOrderStatus(order.status)}
                </p>
              </section>
              <section>
                <h2>Tổng tiền</h2>
                <p>
                  <strong>Tổng giá sản phẩm:</strong>{" "}
                  {order.cart[0]?.total || 0}đ
                </p>
                <p>
                  <strong>Tổng thanh toán:</strong> {order.totalOrder || 0}đ
                </p>
              </section>
            </div>
          </div>

          <section style={{ margin: "20px 0" }}>
            <h2>Thông tin sản phẩm</h2>
            <div
              style={{
                maxHeight: "300px", // Chiều cao tối đa của bảng
                overflowY: "auto", // Kích hoạt thanh cuộn dọc
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th className="headerCellStyle">Tên sản phẩm</th>
                    <th className="headerCellStyle">Danh mục</th>
                    <th className="headerCellStyle">Giá</th>
                    <th className="headerCellStyle">Số lượng</th>
                    <th className="headerCellStyle">Hình ảnh</th>
                  </tr>
                </thead>
                <tbody>
                  {order.cart.map((cartItem) =>
                    cartItem.products.map((product) => (
                      <tr key={`${cartItem._id}-${product._id}`}>
                        <td className="cellStyle">{product.name}</td>
                        <td className="cellStyle">
                          {product.category?.category_name || "Không có"}
                        </td>
                        <td className="cellStyle">{product.price}đ</td>
                        <td className="cellStyle">{product.quantity}</td>
                        <td className="cellStyle">
                          <div style={{ display: "flex", gap: "10px" }}>
                            {product.images?.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Hình ảnh ${product.name}`}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                  borderRadius: "3px",
                                  border: "1px solid #ddd",
                                }}
                              />
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default OrderDetail;
