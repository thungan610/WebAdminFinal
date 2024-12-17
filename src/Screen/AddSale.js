import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./AddSale.css";
import { useNavigate } from "react-router-dom";

const AddSale = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    discountAmount: "", // Giảm theo số tiền cố định
    minOrderValue: "",
    discountPercent: "", // Giảm theo phần trăm
    startDate: "",
    endDate: "",
  });

  const [errors, setErrors] = useState({});
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });

    // Nếu người dùng thay đổi một trong các trường giảm giá, làm trống trường còn lại
    if (name === "discountAmount") {
      setFormData((prevState) => ({
        ...prevState,
        discountPercent: "", // Xóa phần trăm nếu nhập số tiền cố định
      }));
    }

    if (name === "discountPercent") {
      setFormData((prevState) => ({
        ...prevState,
        discountAmount: "", // Xóa số tiền cố định nếu nhập phần trăm
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.title) newErrors.title = "Vui lòng nhập tiêu đề";
    if (formData.discountAmount === "" && formData.discountPercent === "") {
      newErrors.discountAmount =
        "Vui lòng nhập số tiền giảm cố định hoặc giảm theo %";
    }
    if (!formData.minOrderValue)
      newErrors.minOrderValue = "Vui lòng nhập giá trị đơn hàng tối thiểu";
    if (!formData.startDate)
      newErrors.startDate = "Vui lòng chọn ngày khuyến mãi";
    if (!formData.endDate) newErrors.endDate = "Vui lòng chọn ngày hết hạn";

    // Kiểm tra chỉ cho phép nhập một trong hai trường: giảm giá cố định hoặc giảm theo phần trăm
    if (formData.discountAmount && formData.discountPercent) {
      newErrors.discountAmount =
        "Chỉ được phép nhập giảm theo số tiền cố định hoặc phần trăm, không cả hai.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        // Kiểm tra giảm theo % không vượt quá 100%
        if (formData.discountPercent > 100) {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Giảm theo % không thể vượt quá 100%",
          });
          return;
        }

        // Định dạng ngày hết hạn và kiểm tra trạng thái hết hạn
        const expirationDate = new Date(formData.endDate);
        const isExpired = new Date() > expirationDate;

        const saleData = {
          date: formData.startDate,
          title: formData.title,
          discountAmount:
            formData.discountAmount === ""
              ? 0
              : parseFloat(formData.discountAmount), // Nếu discountAmount trống, đặt là 0
          discountPercent:
            formData.discountPercent === ""
              ? 0
              : parseFloat(formData.discountPercent), // Nếu discountPercent trống, đặt là 0
          minOrderValue: parseInt(formData.minOrderValue),
          expirationDate: expirationDate.toISOString(), // Đảm bảo định dạng đúng
          isExpired: isExpired, // Trạng thái hết hạn
        };

        // Gửi dữ liệu đến API
        const response = await axios.post(
          "https://server-vert-rho-94.vercel.app/sale/addSale",
          saleData
        );

        // Xử lý phản hồi từ server
        if (response.data.status) {
          Swal.fire({
            icon: "success",
            title: "Thành công",
            text: "Thêm khuyến mãi thành công!",
          });
          setResponseMessage("Thêm khuyến mãi thành công!");
          // Reset form sau khi thêm thành công
          setFormData({
            title: "",
            discountAmount: "",
            minOrderValue: "",
            discountPercent: "",
            startDate: "",
            endDate: "",
          });
          // Quay lại trang trước sau khi thêm thành công
          navigate(-1);
        } else {
          Swal.fire({
            icon: "error",
            title: "Thất bại",
            text: "Thêm khuyến mãi thất bại!",
          });
          setResponseMessage("Thêm khuyến mãi thất bại!");
        }
      } catch (error) {
        console.error("Error adding sale:", error);
        Swal.fire({
          icon: "error",
          title: "Đã xảy ra lỗi",
          text: "Đã xảy ra lỗi khi thêm khuyến mãi!",
        });
        setResponseMessage("Đã xảy ra lỗi khi thêm khuyến mãi!");
      }
    }
  };

  return (
    <div className="box">
      <div className="content4">
        <div className="form-container">
          <h3>Thêm khuyến mãi</h3>
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
              name="discountAmount"
              value={formData.discountAmount}
              onChange={handleChange}
            />
            {errors.discountAmount && (
              <p className="error">{errors.discountAmount}</p>
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
              name="discountPercent"
              value={formData.discountPercent}
              onChange={handleChange}
            />
            {errors.discountPercent && (
              <p className="error">{errors.discountPercent}</p>
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
                Thêm mới
              </button>
            </div>
          </form>

          {/* Hiển thị thông báo phản hồi */}
          {responseMessage && <p className="response">{responseMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default AddSale;