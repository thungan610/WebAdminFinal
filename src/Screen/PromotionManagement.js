import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PromotionManagement.css";
import edit from "../assets/images/insert.png";
import deleteimg from "../assets/images/delete.png";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const PromotionManagementment = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get(
          "https://server-vert-rho-94.vercel.app/sale/getSale"
        );
        if (Array.isArray(response.data.data)) {
          setData(response.data.data);
        } else {
          throw new Error("Dữ liệu từ API không hợp lệ");
        }
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching promotions:", err);
        setError("Không thể tải dữ liệu từ API.");
        setIsLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  // Hàm xử lý xóa
  const handleDelete = async (id) => {
    try {
      // Hiển thị bảng xác nhận
      const result = await Swal.fire({
        title: "Bạn có chắc chắn muốn xóa?",
        text: "Hành động này không thể hoàn tác!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Đồng ý",
        cancelButtonText: "Hủy",
      });

      // Nếu người dùng chọn "Đồng ý"
      if (result.isConfirmed) {
        await axios.delete(
          `https://server-vert-rho-94.vercel.app/sale/${id}/deleteSale`
        );
        setData(data.filter((item) => item._id !== id));

        // Thông báo xóa thành công
        Swal.fire("Đã xóa!", "Khuyến mãi đã được xóa.", "success");
      }
    } catch (err) {
      console.error("Lỗi khi xóa khuyến mãi:", err);
      Swal.fire("Lỗi!", "Xóa khuyến mãi không thành công.", "error");
    }
  };

  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="appnene">
      <div className="button-container">
        <button className="add-button" onClick={() => navigate("/AddSale")}>
          Thêm mới
        </button>
      </div>
      <div style={{ height: "500px", overflowY: "scroll" }}>
        <table className="sale-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Số tiền giảm</th>
              <th>Giảm theo phần trăm</th>
              <th>Giá trị đơn hàng tối thiểu</th>
              <th>Ngày tạo</th>
              <th>Thời gian hết hạn</th>
              <th>Trạng thái</th> {/* New status column */}
              <th>Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const expirationDate = new Date(row.expirationDate);
              const isExpired = expirationDate < new Date();
              const status = isExpired ? "Đã hết hạn" : "Còn hoạt động"; // New status logic

              return (
                <tr key={row._id}>
                  <td>{row.title}</td>
                  <td>{row.discountAmount?.toLocaleString()}đ</td>
                  <td>{row.discountPercent}%</td>
                  <td>{row.minOrderValue?.toLocaleString()}đ</td>
                  <td>
                    {row.createAt
                      ? new Date(row.createAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    {/* Display expiration date in dd/mm/yyyy format */}
                    {new Date(row.expirationDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td>
                    {/* Conditionally apply CSS class based on status */}
                    <span className={isExpired ? "expired-status" : "active-status"}>
                      {status}
                    </span>
                  </td>
                  <td>
                    <div className="editDiv">
                      <div className="editIcon">
                        <div onClick={() => navigate(`/UpdateSale/${row._id}`)}>
                          <img className="edit" src={edit} alt="Edit" />
                        </div>
                      </div>
                      <div
                        className="deleteIcon"
                        onClick={() => handleDelete(row._id)}
                      >
                        <img className="delete" src={deleteimg} alt="Delete" />
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromotionManagementment;
