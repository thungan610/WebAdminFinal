import React, { useState } from "react";
import axios from "axios"; // Import axios
import "./AddSale.css";

const AddSale = () => {
    const [formData, setFormData] = useState({
        title: "",
        fixedDiscount: "",
        minOrderValue: "",
        percentDiscount: "",
        startDate: "",
        endDate: "",
    });

    const [errors, setErrors] = useState({});
    const [responseMessage, setResponseMessage] = useState(""); // Lưu thông báo phản hồi

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" }); // Xóa lỗi khi người dùng bắt đầu nhập lại
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra dữ liệu form
        const newErrors = {};
        if (!formData.title) newErrors.title = "Vui lòng nhập tiêu đề";
        if (!formData.fixedDiscount && !formData.percentDiscount) {
            newErrors.fixedDiscount = "Vui lòng nhập số tiền giảm cố định hoặc giảm theo %";
        }
        if (!formData.minOrderValue) newErrors.minOrderValue = "Vui lòng nhập giá trị đơn hàng tối thiểu";
        if (!formData.startDate) newErrors.startDate = "Vui lòng chọn ngày khuyến mãi";
        if (!formData.endDate) newErrors.endDate = "Vui lòng chọn ngày hết hạn";

        // Kiểm tra xem chỉ nhập một trong hai: giảm giá cố định hoặc giảm theo %
        if (formData.fixedDiscount && formData.percentDiscount) {
            newErrors.fixedDiscount = "Chỉ được phép nhập giảm theo số tiền cố định hoặc phần trăm, không cả hai.";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors); // Cập nhật lỗi nếu có
        } else {
            try {
                // Tạo đối tượng dữ liệu để gửi tới API
                const saleData = {
                    date: formData.startDate, // Ngày bắt đầu khuyến mãi
                    title: formData.title,
                    discountPercent: parseFloat(formData.percentDiscount) || 0, // Giảm theo %
                    minOrderValue: parseInt(formData.minOrderValue),
                    expirationDate: formData.endDate, // Ngày hết hạn
                    isExpired: false, // Đặt giá trị mặc định cho isExpired
                };

                // Gửi dữ liệu tới API
                const response = await axios.post("http://localhost:6677/sale/addSale", saleData);

                // Xử lý phản hồi từ server
                if (response.data.status) {
                    setResponseMessage("Thêm khuyến mãi thành công!");
                } else {
                    setResponseMessage("Thêm khuyến mãi thất bại!");
                }
            } catch (error) {
                console.error("Error adding sale:", error);
                setResponseMessage("Đã xảy ra lỗi khi thêm khuyến mãi!");
            }
        }
    };

    return (
        <div className="box">
            <div className="content">
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
                            name="fixedDiscount"
                            value={formData.fixedDiscount}
                            onChange={handleChange}
                        />
                        {errors.fixedDiscount && <p className="error">{errors.fixedDiscount}</p>}

                        <label className="date">Giá trị đơn hàng tối thiểu</label>
                        <input
                            type="number"
                            name="minOrderValue"
                            value={formData.minOrderValue}
                            onChange={handleChange}
                        />
                        {errors.minOrderValue && <p className="error">{errors.minOrderValue}</p>}

                        <label className="date">Giảm theo %</label>
                        <input
                            type="number"
                            name="percentDiscount"
                            value={formData.percentDiscount}
                            onChange={handleChange}
                        />
                        {errors.percentDiscount && <p className="error">{errors.percentDiscount}</p>}

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
                            <button type="button" className="cancel">Hủy</button>
                            <button type="submit" className="submit">Thêm mới</button>
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
