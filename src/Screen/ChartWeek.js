import React, { useEffect, useState } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";

const RevenueChart = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [chartInstance, setChartInstance] = useState(null);
  const [dateRange, setDateRange] = useState("");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isDateError, setIsDateError] = useState(false);
  const [isStartDateGreater, setIsStartDateGreater] = useState(false);

  const navigate = useNavigate();

  const calculateDateRange = (startDate, endDate) => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay());

    const formatDate = (date) =>
      `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;

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

  const isDateRangeValid = (startDate, endDate) => {
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const differenceInTime = endDateObj.getTime() - startDateObj.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    return differenceInDays <= 7;
  };

  useEffect(() => {
    const { startDate, endDate, formattedRange } = calculateDateRange();
    setStartDate(startDate);
    setEndDate(endDate);
    setDateRange(formattedRange);
  }, []);

  useEffect(() => {
    if (!isDateRangeValid(startDate, endDate)) {
      setIsDateError(true);
    } else {
      setIsDateError(false);
    }

    Chart.register(
      CategoryScale,
      LinearScale,
      BarElement,
      BarController,
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

        if (result.status === true && result.data.length > 0) {
          const labels = [];
          const data = [];
          let total = 0;

          result.data.forEach((element) => {
            labels.push(element.day);
            const revenue = Number(element.revenue);
            data.push(revenue);
            total += revenue;
          });

          setTotalRevenue(total);

          const ctx = document.getElementById("myChart");
          if (!ctx) {
            console.error("Canvas element not found!");
            return;
          }

          const chartContext = ctx.getContext("2d");
          if (chartInstance) {
            chartInstance.destroy();
          }

          const newChart = new Chart(chartContext, {
            type: "bar",
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
                      return tooltipItem.raw.toLocaleString() + "đ";
                    },
                  },
                },
              },
              scales: {
                y: {
                  ticks: {
                    callback: function (value) {
                      return value.toLocaleString() + "đ";
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
            backgroundColor: "#f0f8ff",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "all 0.3s ease",
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
              const newStartDate = e.target.value;
              if (new Date(newStartDate) > new Date(endDate)) {
                setIsStartDateGreater(true);
              } else {
                setIsStartDateGreater(false);
              }
              setStartDate(newStartDate);
              const updatedRange = calculateDateRange(newStartDate, endDate);
              setDateRange(updatedRange.formattedRange);
            }}
            style={{
              padding: "8px 12px",
              fontSize: "14px",
              border: `1px solid ${
                isStartDateGreater ? "red" : isDateError ? "red" : "#ccc"
              }`,
              borderRadius: "5px",
              cursor: "pointer",
            }}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => {
              const newEndDate = e.target.value;
              if (new Date(startDate) > new Date(newEndDate)) {
                setIsStartDateGreater(true);
              } else {
                setIsStartDateGreater(false);
              }
              setEndDate(newEndDate);
              const updatedRange = calculateDateRange(startDate, newEndDate);
              setDateRange(updatedRange.formattedRange);
            }}
            style={{
              padding: "8px 12px",
              fontSize: "14px",
              margin: "0 10px",
              border: `1px solid ${
                isStartDateGreater ? "red" : isDateError ? "red" : "#ccc"
              }`,
              borderRadius: "5px",
              cursor: "pointer",
            }}
          />
        </div>
      </div>

      {isStartDateGreater && (
        <p style={{ color: "red", textAlign: "center", fontSize: "14px" }}>
          Ngày bắt đầu không được lớn hơn ngày kết thúc!
        </p>
      )}

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
            marginTop: "10px",
            fontWeight: "bold",
            color: "#27aae1",
          }}
        >
          Tổng doanh thu: {totalRevenue.toLocaleString()}đ
        </div>
      )}
    </div>
  );
};

export default RevenueChart;
