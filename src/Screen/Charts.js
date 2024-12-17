import React, { useEffect, useState } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PieController,
  BarController,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import ChartDataLabels from "chartjs-plugin-datalabels";

const TopProductsChart = () => {
  const getStartOfWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Chủ nhật) đến 6 (Thứ bảy)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(
      today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)
    );
    return startOfWeek.toISOString().split("T")[0];
  };

  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(getStartOfWeek());
  const [chartInstance, setChartInstance] = useState(null);
  const [dateRange, setDateRange] = useState("");
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);

  const calculateDateRange = (startDate) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const formatDate = (date) =>
      `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;

    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  useEffect(() => {
    Chart.register(
      CategoryScale,
      LinearScale,
      PieController,
      BarController,
      BarElement,
      ArcElement,
      Title,
      Tooltip,
      Legend,
      ChartDataLabels
    );

    const fetchData = async () => {
      try {
        const query = `?date=${selectedDate}`;
        const res = await fetch(
          `https://server-vert-rho-94.vercel.app/products/getTop10PW${query}`
        );
        const result = await res.json();

        const fetchedLabels = [];
        const fetchedData = [];
        result.data.forEach((element) => {
          fetchedLabels.push(element.name);
          fetchedData.push(Number(element.sold));
        });

        setLabels(fetchedLabels);
        setData(fetchedData);
        setDateRange(calculateDateRange(selectedDate));

        if (chartInstance) {
          chartInstance.data.labels = fetchedLabels.map(
            (label, index) => `${label} (${fetchedData[index]})`
          );
          chartInstance.data.datasets[0].data = fetchedData;
          chartInstance.update();
        } else {
          const ctx = document.getElementById("myChart").getContext("2d");

          const newChart = new Chart(ctx, {
            type: "pie", // Default to Pie chart
            data: {
              labels: fetchedLabels.map(
                (label, index) => `${label} (${fetchedData[index]})`
              ),
              datasets: [
                {
                  label: "Lượt bán",
                  data: fetchedData,
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.8)",
                    "rgba(54, 162, 235, 0.8)",
                    "rgba(75, 192, 192, 0.8)",
                    "rgba(255, 206, 86, 0.8)",
                    "rgba(153, 102, 255, 0.8)",
                    "rgba(255, 159, 64, 0.8)",
                    "rgba(201, 203, 207, 0.8)",
                    "rgba(90, 203, 207, 0.8)",
                  ],
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: true,
              aspectRatio: 1,
              plugins: {
                legend: {
                  position: "right",
                },
                datalabels: {
                  formatter: (value, context) => {
                    const total = context.chart.data.datasets[0].data.reduce(
                      (acc, val) => acc + val,
                      0
                    );
                    return ((value / total) * 100).toFixed(2) + "%";
                  },
                  color: "white",
                  font: {
                    weight: "bold",
                  },
                },
              },
            },
          });

          setChartInstance(newChart);
        }
      } catch (error) {
        console.error("Error fetching or displaying data:", error);
      }
    };

    fetchData();
  }, [selectedDate, chartInstance]);

  const handleChartChange = (type) => {
    if (chartInstance) {
      chartInstance.destroy(); // Hủy biểu đồ cũ
      const ctx = document.getElementById("myChart").getContext("2d");

      const newChart = new Chart(ctx, {
        type: type, // Toggle chart type (pie/bar)
        data: {
          labels: labels,
          datasets: [
            {
              label: "Lượt bán",
              data: data,
              backgroundColor: [
                "rgba(255, 99, 132, 0.8)",
                "rgba(54, 162, 235, 0.8)",
                "rgba(75, 192, 192, 0.8)",
                "rgba(255, 206, 86, 0.8)",
                "rgba(153, 102, 255, 0.8)",
                "rgba(255, 159, 64, 0.8)",
                "rgba(201, 203, 207, 0.8)",
                "rgba(90, 203, 207, 0.8)",
              ],
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              position: "right",
            },
            datalabels: {
              formatter: (value, context) => {
                const total = context.chart.data.datasets[0].data.reduce(
                  (acc, val) => acc + val,
                  0
                );
                return ((value / total) * 100).toFixed(2) + "%";
              },
              color: "white",
              font: {
                weight: "bold",
              },
            },
          },
        },
      });

      setChartInstance(newChart);
    }
  };

  return (
    <div
      style={{
        padding: 5,
        marginBottom: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          maxWidth: "1000px",
        }}
      >
        <div
          onClick={() => navigate("/ChartRevenue")}
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
          Doanh thu
        </div>

        <h1
          style={{
            color: "#27AAE1",
            fontSize: "24px",
            fontWeight: "bold",
            textAlign: "center",
            textTransform: "uppercase",
            flex: 1,
          }}
        >
          Sản phẩm bán chạy trong ứng dụng
        </h1>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          />
        </div>
      </div>

      <div style={{ width: "100%", textAlign: "center" }}>
        <p style={{ color: "gray", fontWeight: "bold" }}>
          {dateRange} - Tổng số sản phẩm bán:{" "}
          {data.reduce((acc, val) => acc + val, 0)}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "-70px",
            width:"1390px",
            height:"620px",
           paddingTop:"-700px"
          }}
        >
          <canvas id="myChart" ></canvas>
        </div>
      </div>

      {/* <div
        style={{ display: "flex", justifyContent: "center", marginTop: "-60px" }}
      >
        <button
          onClick={() => handleChartChange("pie")}
          style={{
            
            backgroundColor: "#27AAE1",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
            marginRight: "15px",
            
          }}
        >
          Biểu đồ Tròn
        </button>
        <button
          onClick={() => handleChartChange("bar")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#27AAE1",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Biểu đồ Cột
        </button>
      </div> */}
    </div>
  );
};

export default TopProductsChart;
