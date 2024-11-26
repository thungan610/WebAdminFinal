import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await fetch(`http://localhost:6677/oder/${id}/getOrderById`);
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
      case 1: return "Đang xử lý";
      case 2: return "Đang giao";
      case 3: return "Hoàn thành";
      case 4: return "Đã hủy";
      default: return "Không xác định";
    }
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ width: "100%", display: "flex", gap: "350px" }}>
        <button style={{ background: "white" }} onClick={() => navigate(-1)}>
          <LeftOutlined />
        </button>
        <h1>Chi tiết đơn hàng</h1>
      </div>

      {order && (
        <>
          <section>
            <h2>Thông tin người dùng</h2>
            <p><strong>Tên:</strong> {order.cart[0]?.user?.name || "Không có"}</p>
            <p><strong>Số điện thoại:</strong> {order.address?.user?.phone || "Không có"}</p>
          </section>

          <section>
            <h2>Thông tin sản phẩm</h2>
            {order.cart.map((cartItem, index) => (
              cartItem.products.map((product) => (
                <div key={`${cartItem._id}-${product._id}`} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}>
                  <p><strong>Tên sản phẩm:</strong> {product.name}</p>
                  <p><strong>Danh mục:</strong> {product.category?.category_name || "Không có"}</p>
                  <p><strong>Giá:</strong> {product.price}đ</p>
                  <p><strong>Số lượng:</strong> {product.quantity}</p>
                  <div>
                    <strong>Hình ảnh:</strong>
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      {product.images?.map((image, index) => (
                        <img key={index} src={image} alt={`Hình ảnh ${product.name}`} style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ))}
          </section>

          <section>
            <h2>Thông tin giao hàng</h2>
            <p><strong>Địa chỉ:</strong> {`${order.address?.houseNumber}, ${order.address?.alley}, ${order.address?.quarter}, ${order.address?.district}, ${order.address?.city}, ${order.address?.country}`}</p>
            <p><strong>Phương thức giao hàng:</strong> {order.ship === 10 ? "Nhanh" : "Chậm"}</p>
            <p><strong>Trạng thái đơn hàng:</strong> {getOrderStatus(order.status)}</p>
          </section>

          <section>
            <h2>Tổng tiền</h2>
            <p><strong>Tổng giá sản phẩm:</strong> {order.cart[0]?.total || 0}đ</p>
            <p><strong>Tổng thanh toán:</strong> {order.totalOrder || 0}đ</p>
          </section>
        </>
      )}
    </div>
  );
};

export default OrderDetail;
