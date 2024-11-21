import React, { useEffect, useState } from 'react';
import './QLHH.css';
import back from "../assets/back.png";

const QLHH = () => {
  const [order, setOrder] = useState([]);

  useEffect(() => {
    // Fetch data from API
    const getOrder = async () => {
      try {
        const response = await fetch("http://localhost:6677/oder/getAllOrder");
        const result = await response.json();
        if (result.status) {
          // Map through the response to extract required fields for display
          const formattedOrder = result.data.map((orderItem) => ({
            id: orderItem._id, // Lấy id từ _id của orderItem
            email: orderItem.cart[0].user?.name || "N/A",
            product: orderItem.cart[0].products.map(p => p.name).join(', '),
            unitPrice: `${orderItem.cart[0].products[0]?.price || 0}đ`,
            deliveryMethod: orderItem.ship === 1 ? "Nhanh" : "Chậm",
            orderStatus: getOrderStatus(orderItem.status),
            totalProductPrice: `${orderItem.cart[0].total}đ`,
            totalPayment: `${orderItem.totalOrder}đ`
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
        return "Hoàn thành";
      case 3:
        return "Đang vận chuyển";
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
      case "Hoàn thành":
        return "blue";
      case "Đang vận chuyển":
        return "green";
      case "Đã hủy":
        return "red";
      default:
        return "black";
    }
  };

  return (
    <div className="qlhh-container">
      <table className="order-table">
        <thead>
          <tr>
            <th>Tên người dùng</th>
            <th>Sản phẩm</th>
            <th>Mã đơn hàng</th>
            <th>Đơn giá</th>
            <th>Hình thức giao</th>
            <th>Trạng thái đơn hàng</th>
            <th>Tổng tiền SP</th>
            <th>Tổng thanh toán</th>
          </tr>
        </thead>
        <tbody>
          {order.map((item, index) => (
            <tr key={index}>
              <td style={{ color: 'blue' }}>{item.email}</td>
              <td  className=''>{item.product}</td>
              <td style={{ textAlign: 'center' }}><strong>{item.id}</strong></td> {/* Hiển thị id */}
              <td style={{ textAlign: 'center' }}>{item.unitPrice}</td>
              <td style={{ color: item.deliveryMethod === "Nhanh" ? "red" : "black", textAlign: 'center' }}>{item.deliveryMethod}</td>
              <td style={{ color: getOrderStatusColor(item.orderStatus), textAlign: 'center' }}>{item.orderStatus}</td>
              <td style={{ textAlign: 'center' }}>{item.totalProductPrice}</td>
              <td className="total-payment-cell">
                <div className="total-payment-text">{item.totalPayment}</div>
                <div className='detail_image'>
                  <button className="details-button">Chi tiết
                    {/* <img className="icon-back" src={back} alt="Back" /> */}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QLHH;
