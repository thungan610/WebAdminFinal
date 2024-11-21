import React, { useEffect, useState } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

const TopProductsChart = () => {
  const [week, setWeek] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    Chart.register(
      CategoryScale,
      LinearScale,
      BarController,
      BarElement,
      Title,
      Tooltip,
      Legend
    );

    const fetchData = async () => {
      try {
        const query = `?week=${week || ""}&year=${year}`;
        const res = await fetch(
          `http://localhost:6677/products/getTop10PW${query}`
        );
        const result = await res.json();

        const labels = [];
        const data = [];
        result.data.forEach((element) => {
          labels.push(element.name);
          data.push(Number(element.sold));
        });

        const ctx = document.getElementById("myChart").getContext("2d");

        if (chartInstance) {
          chartInstance.destroy();
        }

        const newChart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Lượt bán",
                data: data,
                borderWidth: 1,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(75, 192, 192, 1)",
                ],
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });

        setChartInstance(newChart);
      } catch (error) {
        console.error("Error fetching or displaying data:", error);
      }
    };

    fetchData();
  }, [week, year]);

  // Tạo danh sách tuần từ 1 đến 52
  const weeks = Array.from({ length: 52 }, (_, i) => i + 1);

  return (
    <div style={{ padding: 5, marginBottom: "20px"}}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
      <a
          className="btn-chart"
          href="/charts"
          alt="insert"
          style={{
            display: "block",
            alignItems: "center",
            textAlign: "center" /* Căn giữa văn bản */,
            marginTop: 10 /* Khoảng cách giữa nút và liên kết */,
            color: "#27aae1" /* Màu chữ cho liên kết */,
            textDecoration: "none" /* Bỏ gạch chân */,
            marginRight: 18,
            fontSize: 16,
            fontWeight: 600,
            paddingLeft: 20,

          }}
        >
         Quay lại
        </a>
        <h1
          style={{
            paddingLeft: 20,
            color: "#27AAE1",
            fontSize: "24px",
            fontWeight: "bold",
            textAlign: "center",
            textTransform: "uppercase",
          }}
        >
          Sản phẩm bán chạy trong tuần
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
   

          }}
        >
          <div style={{ marginRight: 10 }}>
            <label
              htmlFor="week"
              style={{ fontWeight: "bold", marginRight: 5 }}
            >

            </label>
            <select
              id="week"
              value={week}
              onChange={(e) => setWeek(e.target.value)}
              style={{
                padding: "8px 12px",
                width: "95px",
                fontSize: "13px",
                textAlign: "center",
                border: "none",
                color: "white",
                borderRadius: "5px",
                backgroundColor: "rgba(39, 170, 225, 0.6)",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                outline: "none",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.borderColor = "#27AAE1")}
              onMouseLeave={(e) => (e.target.style.borderColor = "#ccc")}
              onFocus={(e) => {
                e.target.style.borderColor = "#27AAE1";
                e.target.style.boxShadow = "0 0 5px rgba(39, 170, 225, 0.5)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#ccc";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="">Tất cả</option>
              {weeks.map((w) => (
                <option key={w} value={w}>
                  Tuần {w}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="year"
              style={{ fontWeight: "bold", marginRight: 5 }}
            >
            </label>
            <select
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              style={{
                padding: "8px 12px",
                width: "95px",
                fontSize: "13px",
                textAlign: "center",
                border: "none",
                color: "white",
                borderRadius: "5px",
                backgroundColor: "rgba(39, 170, 225, 0.6)",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                outline: "none",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.borderColor = "#27AAE1")}
              onMouseLeave={(e) => (e.target.style.borderColor = "#ccc")}
              onFocus={(e) => {
                e.target.style.borderColor = "#27AAE1";
                e.target.style.boxShadow = "0 0 5px rgba(39, 170, 225, 0.5)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#ccc";
                e.target.style.boxShadow = "none";
              }}
            >
              {[2023, 2024, 2025].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <canvas id="myChart"></canvas>
    </div>
  );
};

export default TopProductsChart;
