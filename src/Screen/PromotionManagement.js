import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PromotionManagement.css";
import edit from "../assets/images/insert.png";
import deleteimg from "../assets/images/delete.png";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import search from "../assets/images/search.png";

const PromotionManagementment = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKey, setSearchKey] = useState("");
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

  const handleDelete = async (id) => {
    try {
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

      if (result.isConfirmed) {
        await axios.delete(
          `https://server-vert-rho-94.vercel.app/sale/${id}/deleteSale`
        );
        setData(data.filter((item) => item._id !== id));
        Swal.fire("Đã xóa!", "Khuyến mãi đã được xóa.", "success");
      }
    } catch (err) {
      console.error("Lỗi khi xóa khuyến mãi:", err);
      Swal.fire("Lỗi!", "Xóa khuyến mãi không thành công.", "error");
    }
  };

  // Lọc dữ liệu theo tiêu đề
  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchKey.toLowerCase())
  );

  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="appnene">
      <div className="button-container">
        <div
          className="search-box"
          style={{ position: "relative", width: "300px" }}
        >
          <input
            type="text"
            onChange={(e) => setSearchKey(e.target.value)}
            value={searchKey}
            placeholder="Tìm kiếm khuyến mãi theo tiêu đề"
          
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
              <th>Hạn sử dụng</th>
              <th>Trạng thái</th>
              <th>Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => {
              const expirationDate = new Date(row.expirationDate);
              const isExpired = expirationDate < new Date();
              const status = isExpired ? "Đã hết hạn" : "Còn hoạt động";

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
                    {new Date(row.expirationDate).toLocaleDateString("vi-VN")}
                  </td>
                  <td>
                    <span
                      className={isExpired ? "expired-status" : "active-status"}
                    >
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
