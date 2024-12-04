import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import "./AddSale.css";
import { useNavigate, useParams } from "react-router-dom";

const UpdateSale = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    fixedDiscount: "",
    minOrderValue: "",
    percentDiscount: "",
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSaleData = async () => {
      try {
        const response = await axios.get(
          `https://server-vert-rho-94.vercel.app/sale/${id}/getDetailSale`
        );
        const sale = response.data.data;

        setFormData({
          title: sale.title || "",
          fixedDiscount: sale.discountAmount || "", // Dữ liệu trống nếu không có giá trị
          minOrderValue: sale.minOrderValue || "",
          percentDiscount: sale.discountPercent || "", // Dữ liệu trống nếu không có giá trị
          startDate: sale.createAt
            ? new Date(sale.createAt).toISOString().split("T")[0]
            : "",
          endDate: sale.expirationDate
            ? new Date(sale.expirationDate).toISOString().split("T")[0]
            : "",
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching sale data:", error);
        Swal.fire("Lỗi", "Không thể tải dữ liệu khuyến mãi!", "error");
        setIsLoading(false);
      }
    };

    fetchSaleData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    // Kiểm tra giá trị nhập vào của các discount, thay thế chuỗi rỗng và undefined bằng 0
    const fixedDiscount =
      formData.fixedDiscount !== "" ? formData.fixedDiscount : ""; // Sử dụng chuỗi rỗng nếu không có giá trị
    const percentDiscount =
      formData.percentDiscount !== "" ? formData.percentDiscount : ""; // Sử dụng chuỗi rỗng nếu không có giá trị

    // Kiểm tra lỗi nhập liệu
    if (!formData.title) newErrors.title = "Vui lòng nhập tiêu đề";
    if (fixedDiscount === "" && percentDiscount === "") {
      newErrors.fixedDiscount =
        "Vui lòng nhập số tiền giảm cố định hoặc giảm theo %";
    }

    // Kiểm tra lỗi: Không thể có cả hai giá trị > 0
    if (fixedDiscount > 0 && percentDiscount > 0) {
      newErrors.fixedDiscount =
        "Chỉ được phép nhập một trong hai: giảm theo số tiền cố định hoặc giảm theo phần trăm.";
    }

    if (!formData.minOrderValue)
      newErrors.minOrderValue = "Vui lòng nhập giá trị đơn hàng tối thiểu";
    if (!formData.startDate)
      newErrors.startDate = "Vui lòng chọn ngày khuyến mãi";
    if (!formData.endDate) newErrors.endDate = "Vui lòng chọn ngày hết hạn";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Tạo đối tượng gửi lên server, xử lý các giá trị chuỗi rỗng
      const saleData = {
        title: formData.title,
        discountAmount: fixedDiscount !== "" ? parseFloat(fixedDiscount) : "", // Nếu không có giá trị, gửi chuỗi rỗng
        discountPercent:
          percentDiscount !== "" ? parseFloat(percentDiscount) : "", // Nếu không có giá trị, gửi chuỗi rỗng
        minOrderValue:
          formData.minOrderValue !== "" ? parseInt(formData.minOrderValue) : "", // Nếu không có giá trị, gửi chuỗi rỗng
        createAt: formData.startDate,
        expirationDate: formData.endDate,
      };

      // Gửi yêu cầu PUT đến server
      const response = await axios.put(
        `https://server-vert-rho-94.vercel.app/sale/${id}/updateSale`,
        saleData
      );

      if (response.data.status) {
        Swal.fire({
          title: "Thành công!",
          text: "Cập nhật khuyến mãi thành công!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate(-1); // Quay lại trang trước
        });
      } else {
        Swal.fire("Lỗi", "Cập nhật khuyến mãi thất bại!", "error");
      }
    } catch (error) {
      console.error("Error updating sale:", error);
      Swal.fire("Lỗi", "Đã xảy ra lỗi khi cập nhật khuyến mãi!", "error");
    }
  };

  if (isLoading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  return (
    <div className="box">
      <div className="content4">
        <div className="form-container">
          <h3>Chỉnh sửa khuyến mãi</h3>
          <form onSubmit={handleSubmit}>
            <label className="tieude">Tiêu đề</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <p className="error">{errors.title}</p>}

            <label className="date">Số tiền giảm cố định</label>
            <input
              type="number"
              name="fixedDiscount"
              value={formData.fixedDiscount}
              onChange={handleChange}
            />
            {errors.fixedDiscount && (
              <p className="error">{errors.fixedDiscount}</p>
            )}

            <label className="date">Giá trị đơn hàng tối thiểu</label>
            <input
              type="number"
              name="minOrderValue"
              value={formData.minOrderValue}
              onChange={handleChange}
            />
            {errors.minOrderValue && (
              <p className="error">{errors.minOrderValue}</p>
            )}

            <label className="date">Giảm theo %</label>
            <input
              type="number"
              name="percentDiscount"
              value={formData.percentDiscount}
              onChange={handleChange}
            />
            {errors.percentDiscount && (
              <p className="error">{errors.percentDiscount}</p>
            )}

            <div className="date-container">
              <label className="date">Ngày khuyến mãi</label>
              <label className="dateof">Ngày hết hạn</label>
            </div>

            <div className="date-container">
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
            {errors.startDate && <p className="error">{errors.startDate}</p>}
            {errors.endDate && <p className="error">{errors.endDate}</p>}

            <div className="buttons">
              <button
                onClick={() => navigate(-1)}
                type="button"
                className="cancel"
              >
                Hủy
              </button>
              <button type="submit" className="submit">
                Cập nhật
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateSale;
