import React, { useEffect, useState } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController, // Đăng ký BarController
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";

const RevenueChart = () => {
  const [startDate, setStartDate] = useState(""); // Ngày bắt đầu
  const [endDate, setEndDate] = useState(""); // Ngày kết thúc
  const [chartInstance, setChartInstance] = useState(null);
  const [dateRange, setDateRange] = useState(""); // Khoảng thời gian hiển thị
  const [totalRevenue, setTotalRevenue] = useState(0); // Biến lưu tổng doanh thu
  const [isDateError, setIsDateError] = useState(false); // Biến kiểm tra lỗi ngày
  const navigate = useNavigate();
  // Hàm tính toán ngày bắt đầu và kết thúc cho khoảng thời gian mặc định (từ đầu tuần đến hôm nay)
  const calculateDateRange = (startDate, endDate) => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0]; // Ngày hôm nay

    // Tính ngày đầu tuần (Chủ nhật là ngày đầu tuần)
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay()); // Đặt về Chủ nhật trước đó

    const formatDate = (date) =>
      `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;

    // Nếu chưa có ngày bắt đầu hoặc kết thúc, trả về khoảng thời gian mặc định
    if (!startDate || !endDate) {
      return {
        startDate: firstDayOfWeek.toISOString().split("T")[0],
        endDate: todayStr,
        formattedRange: `${formatDate(firstDayOfWeek)} - ${formatDate(today)}`,
      };
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    return {
      startDate,
      endDate,
      formattedRange: `${formatDate(startDateObj)} - ${formatDate(endDateObj)}`,
    };
  };

  // Hàm kiểm tra nếu khoảng thời gian vượt quá 7 ngày
  const isDateRangeValid = (startDate, endDate) => {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const differenceInTime = endDateObj.getTime() - startDateObj.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays <= 7; // Nếu chênh lệch vượt quá 7 ngày, trả về false
  };

  // Thiết lập ngày mặc định là từ đầu tuần đến hôm nay khi load trang
  useEffect(() => {
    const { startDate, endDate, formattedRange } = calculateDateRange();
    setStartDate(startDate);
    setEndDate(endDate);
    setDateRange(formattedRange);
  }, []);

  useEffect(() => {
    // Kiểm tra nếu khoảng thời gian không hợp lệ (vượt quá 1 tuần)
    if (!isDateRangeValid(startDate, endDate)) {
      setIsDateError(true);
    } else {
      setIsDateError(false);
    }

    // Đăng ký các phần tử cần thiết cho biểu đồ
    Chart.register(
      CategoryScale,
      LinearScale,
      BarElement,
      BarController, // Đăng ký BarController
      Title,
      Tooltip,
      Legend
    );

    const fetchData = async () => {
      try {
        const query = `?startDate=${startDate}&endDate=${endDate}`;
        const res = await fetch(
          `https://server-vert-rho-94.vercel.app/oder/revenue/daily${query}`
        );
        const result = await res.json();

        console.log(result); // Kiểm tra dữ liệu trả về

        if (result.status === true && result.data.length > 0) {
          const labels = [];
          const data = [];
          let total = 0; // Khởi tạo biến tổng doanh thu

          result.data.forEach((element) => {
            labels.push(element.day);
            const revenue = Number(element.revenue); // Chuyển doanh thu thành số
            data.push(revenue);
            total += revenue; // Cộng dồn doanh thu vào tổng
          });

          // Cập nhật tổng doanh thu
          setTotalRevenue(total);

          const ctx = document.getElementById("myChart");
          if (!ctx) {
            console.error("Canvas element not found!");
            return;
          }

          const chartContext = ctx.getContext("2d");
          if (chartInstance) {
            chartInstance.destroy(); // Hủy biểu đồ cũ nếu có
          }

          const newChart = new Chart(chartContext, {
            type: "bar", // Biểu đồ cột
            data: {
              labels: labels,
              datasets: [
                {
                  label: "Doanh thu",
                  data: data,
                  backgroundColor: "rgba(39, 170, 225, 0.6)",
                  borderColor: "rgba(39, 170, 225, 1)",
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              aspectRatio: 1.5,
              plugins: {
                legend: {
                  position: "top",
                },
               
                tooltip: {
                  callbacks: {
                    label: function (tooltipItem) {
                      return tooltipItem.raw.toLocaleString() + "đ"; // Thêm dấu phân cách hàng nghìn trong tooltip
                    },
                  },
                },
              },
              scales: {
                y: {
                  ticks: {
                    callback: function (value) {
                      return value.toLocaleString() + "đ"; // Thêm dấu phân cách hàng nghìn cho trục Y
                    },
                  },
                },
              },
            },
          });

          setChartInstance(newChart);
        } else {
          console.log("Không có dữ liệu trong khoảng thời gian này");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  return (
    <div style={{ padding: 5, marginBottom: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          className="btn-chart"
          onClick={() => navigate("/charts")}
          style={{
    textAlign: "center",
    color: "#27aae1",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    padding: "10px 20px",
    borderRadius: "5px",
    backgroundColor: "#f0f8ff", // Subtle background to highlight
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Add depth
    transition: "all 0.3s ease", // Smooth hover effect
  }}
        >
          Thống kê lượt bán
        </div>
        <h1
          style={{
            paddingLeft: 140,
            color: "#27AAE1",
            fontSize: "24px",
            fontWeight: "bold",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          Doanh thu hàng ngày
        </h1>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <input
            type="date"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              const updatedRange = calculateDateRange(e.target.value, endDate);
              setDateRange(updatedRange.formattedRange); // Cập nhật khoảng thời gian khi chọn ngày mới
            }}
            style={{
              padding: "8px 12px",
              fontSize: "14px",
              padding: "10px",
                
              border: `1px solid ${isDateError ? "red" : "#ccc"}`, // Thay đổi màu viền khi có lỗi
              borderRadius: "5px",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              const updatedRange = calculateDateRange(
                startDate,
                e.target.value
              );
              setDateRange(updatedRange.formattedRange); // Cập nhật khoảng thời gian khi chọn ngày mới
            }}
            style={{
                padding: "8px 12px",
                fontSize: "14px",
                padding: "10px",
                margin: "0 10px",
                border: `1px solid ${isDateError ? "red" : "#ccc"}`, // Thay đổi màu viền khi có lỗi
                borderRadius: "5px",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
          />
        </div>
      </div>

      {isDateError && (
        <p style={{ color: "red", textAlign: "center", fontSize: "14px" }}>
          Khoảng thời gian không được vượt quá 1 tuần!
        </p>
      )}

      {dateRange && (
        <p
          style={{
            textAlign: "center",
            marginTop: "10px",
            fontSize: "14px",
            color: "#555",
          }}
        >
          Khoảng thời gian: {dateRange}
        </p>
      )}

      <div style={{ maxWidth: "730px", margin: "0 auto" }}>
        <canvas
          id="myChart"
          style={{ maxWidth: "100%", height: "auto" }}
        ></canvas>
      </div>

      {totalRevenue > 0 && (
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            fontSize: "18px",
            fontWeight: "bold",
            color: "#27aae1",
          }}
        >
          <p>Tổng doanh thu: {totalRevenue.toLocaleString()}đ</p>
        </div>
      )}
    </div>
  );
};

export default RevenueChart;
