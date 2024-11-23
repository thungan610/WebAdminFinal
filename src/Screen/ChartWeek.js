import React, { useEffect, useState } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PieController,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

const TopProductsChart = () => {
  const [week, setWeek] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [chartInstance, setChartInstance] = useState(null);
  const [weekRange, setWeekRange] = useState("");

  const calculateWeekRange = (week, year) => {
    const firstDayOfYear = new Date(year, 0, 1);
    const days = (week - 1) * 7;
    const startOfWeek = new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + days));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const formatDate = (date) =>
      `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;

    return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
  };

  useEffect(() => {
    Chart.register(
      CategoryScale,
      LinearScale,
      PieController,
      ArcElement,
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
          type: "pie",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Lượt bán",
                data: data,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.6)",
                  "rgba(54, 162, 235, 0.6)",
                  "rgba(75, 192, 192, 0.6)",
                  "rgba(255, 206, 86, 0.6)",
                  "rgba(153, 102, 255, 0.6)",
                  "rgba(255, 159, 64, 0.6)",
                  "rgba(201, 203, 207, 0.6)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
                  "rgba(201, 203, 207, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 1.5, // Tăng giảm tỉ lệ (nhỏ hơn 2 để thu nhỏ)
            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Top sản phẩm bán chạy",
              },
            },
          },
        });

        setChartInstance(newChart);

        if (week) {
          setWeekRange(calculateWeekRange(Number(week), year));
        } else {
          setWeekRange("");
        }
      } catch (error) {
        console.error("Error fetching or displaying data:", error);
      }
    };

    fetchData();
  }, [week, year]);

  const weeks = Array.from({ length: 52 }, (_, i) => i + 1);

  return (
    <div style={{ padding: 5, marginBottom: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <a
          className="btn-chart"
          href="/charts"
          style={{
            textAlign: "center",
            marginTop: 10,
            color: "#27aae1",
            textDecoration: "none",
            marginRight: 18,
            fontSize: 16,
            fontWeight: 600,
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

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ marginRight: 10 }}>
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

      {weekRange && (
        <p
          style={{
            textAlign: "center",
            marginTop: "10px",
            fontSize: "14px",
            color: "#555",
          }}
        >
          Tuần {week}: {weekRange}
        </p>
      )}

      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        <canvas id="myChart" style={{ maxWidth: "100%", height: "auto" }}></canvas>
      </div>
    </div>
  );
};

export default TopProductsChart;
