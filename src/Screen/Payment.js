import React from "react";
import "../Screen/Payment.css";
import logo from "../assets/images/bapcai.png";

const data = [
  {
    author: "Tuấn Phát",
    email: "thantuanphat21@gmail.com",
    productName: "Bắp cải trắng",
    productCode: "bdeaih2311232432",
    price: "1 jack VND",
    paymentMethod: "Tiền mặt",
    status: "Hoàn thành",
    paymentDate: "29/09/2024 lúc 3:51",
  },
  {
    author: "Tuấn Phát",
    email: "thantuanphat21@gmail.com",
    productName: "Bắp cải trắng",
    productCode: "bdeaih2311232432",
    price: "1 jack VND",
    paymentMethod: "Ngân hàng",
    status: "Hoàn thành",
    paymentDate: "29/09/2024 lúc 3:51",
  },
  {
    author: "Tuấn Phát",
    email: "thantuanphat21@gmail.com",
    productName: "Bắp cải trắng",
    productCode: "bdeaih2311232432",
    price: "1 jack VND",
    paymentMethod: "MoMo",
    status: "Hoàn thành",
    paymentDate: "29/09/2024 lúc 3:51",
  },
  {
    author: "Tuấn Phát",
    email: "thantuanphat21@gmail.com",
    productName: "Bắp cải trắng",
    productCode: "bdeaih2311232432",
    price: "1 jack VND",
    paymentMethod: "Chưa thanh toán",
    status: "Chưa thanh toán",
    paymentDate: "Chưa thanh toán",
  },
];

function Payment() {
  return (
    <div className="app-container">
      <div className="filter-container">
        <button>Sản phẩm</button>
        <button>Ngày</button>
        <button>Tháng</button>
        <button>Năm</button>
      </div>
      <div className="data-table">
        {data.map((item, index) => (
          <div className="data-row" key={index}>
            <div className="data-author">
              <p>
                <strong>Tác giả:</strong> <br></br> {item.author}{" "}
              </p>
              <p>{item.email}</p>
            </div>
            <div className="data-product">
              <img src={logo} alt={item.productName} />
              <div>
                <p>
                  <strong>Tên sản phẩm:</strong>
                  <br></br> {item.productName}
                </p>
                <p>Mã sản phẩm: {item.productCode}</p>
              </div>
            </div>
            <div className="data-price">
              <p>
                <strong>Giá sản phẩm</strong>
                <br></br>
              </p>
              <p>{item.price}</p>
            </div>
            <div className="data-payment">
              <div className="cpntt">
                <p>
                  <strong>Thanh toán</strong>
                  <br></br>
                </p>
                <p>{item.paymentMethod}</p>
              </div>
            </div>
            <div className="cpntt">
              <p>
                <strong>Trạng thái</strong>
                <br></br>
              </p>
              <div
                className={`data-status ${
                  item.status === "Chưa thanh toán" ? "pending" : ""
                }`}
              >
                <p>{item.status}</p>
              </div>
            </div>

            <div className="data-date">
              <p>
                <strong>Ngày thanh toán</strong>
                <br></br>
              </p>
              <p>{item.paymentDate}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Payment;
