import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
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
          fixedDiscount: sale.discountAmount || "",
          minOrderValue: sale.minOrderValue || "",
          percentDiscount: sale.discountPercent || "",
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
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);

    // Bắt lỗi ngày không hợp lệ
    if (!formData.startDate) newErrors.startDate = "Vui lòng chọn ngày khuyến mãi";
    if (!formData.endDate) newErrors.endDate = "Vui lòng chọn ngày hết hạn";
    if (formData.startDate && formData.endDate && startDate > endDate) {
      newErrors.startDate = "Ngày bắt đầu không được lớn hơn ngày kết thúc.";
      newErrors.endDate = "Ngày kết thúc không được nhỏ hơn ngày bắt đầu.";
    }

    // Các kiểm tra khác
    if (!formData.title) newErrors.title = "Vui lòng nhập tiêu đề";
    if (!formData.fixedDiscount && !formData.percentDiscount) {
      newErrors.fixedDiscount =
        "Vui lòng nhập số tiền giảm cố định hoặc giảm theo %";
    }

    if (formData.fixedDiscount && formData.percentDiscount) {
      newErrors.fixedDiscount =
        "Chỉ được phép nhập giảm theo số tiền cố định hoặc phần trăm, không cả hai.";
    }

    if (!formData.minOrderValue)
      newErrors.minOrderValue = "Vui lòng nhập giá trị đơn hàng tối thiểu";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Cập nhật lỗi nếu có
    } else {
      try {
        const saleData = {
          title: formData.title,
          discountAmount: parseFloat(formData.fixedDiscount) || 0,
          discountPercent: parseFloat(formData.percentDiscount) || 0,
          minOrderValue: parseInt(formData.minOrderValue),
          createAt: formData.startDate,
          expirationDate: formData.endDate,
        };

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
    }
  };

  // Kiểm tra lỗi ngay khi nhập ngày
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "startDate" || name === "endDate") {
      const startDate = new Date(
        name === "startDate" ? value : formData.startDate
      );
      const endDate = new Date(
        name === "endDate" ? value : formData.endDate
      );

      if (startDate > endDate) {
        setErrors({
          ...errors,
          startDate: "Ngày bắt đầu không được lớn hơn ngày kết thúc.",
          endDate: "Ngày kết thúc không được nhỏ hơn ngày bắt đầu.",
        });
      } else {
        setErrors({ ...errors, startDate: "", endDate: "" });
      }
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
                className={errors.startDate ? "error-border" : ""}
                value={formData.startDate}
                onChange={handleDateChange}
              />
              <input
                type="date"
                name="endDate"
                className={errors.endDate ? "error-border" : ""}
                value={formData.endDate}
                onChange={handleDateChange}
              />
            </div>
            <div style={{ display: "flex", gap: "212px" }}>
              {errors.startDate && <p className="error">{errors.startDate}</p>}
              {errors.endDate && <p className="error">{errors.endDate}</p>}
            </div>
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