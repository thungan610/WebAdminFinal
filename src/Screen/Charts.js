import React, { useEffect } from "react";
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
  useEffect(() => {
    // Register the necessary components for the chart
    Chart.register(
      CategoryScale,
      LinearScale,
      BarController,
      BarElement,
      Title,
      Tooltip,
      Legend
    );

    const getTop10 = async () => {
      try {
        const res = await fetch(
          "http://localhost:6677/products/getTopProductSell"
        );
        const result = await res.json();

        const labels = [];
        const data = [];
        result.data.forEach((element) => {
          labels.push(element.name);
          data.push(Number(element.sold)); // Ensure quantity is a number
        });

        const ctx = document.getElementById("myChart").getContext("2d");
        if (ctx) {
          // Destroy old chart instance if it exists
          if (Chart.getChart("myChart")) {
            Chart.getChart("myChart").destroy();
          }

          new Chart(ctx, {
            type: "bar",
            data: {
              labels: labels,
              datasets: [
                {
                  label: "Lượt bán",
                  data: data,
                  borderWidth: 1,
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.6)", // Color 1
                    "rgba(54, 162, 235, 0.6)", // Color 2
                    "rgba(75, 192, 192, 0.6)", // Color 3
                  ],
                  borderColor: [
                    "rgba(255, 99, 132, 1)", // Border Color 1
                    "rgba(54, 162, 235, 1)", // Border Color 2
                    "rgba(75, 192, 192, 1)", // Border Color 3
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
        }
      } catch (error) {
        console.log("Error fetching or displaying data:", error);
      }
    };
    getTop10();
  }, []);

  return (
    <div
      style={{
        padding: 5,
      }}
    >
      <div style={{
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",  
      }}>
        <div>
          
        </div>
        <h1
          style={{
           
            paddingLeft: 90,
            color: "#27AAE1",
            fontSize: "24px", // Kích thước chữ
            fontWeight: "bold", // Đậm chữ
            textAlign: "center", // Căn giữa
            textTransform: "uppercase", // Chuyển chữ thành in hoa
          }}
        >
          Top 10 sản phẩm bán chạy nhất
        </h1>
        <a
          className="btn-chart"
          href="/ChartWeek"
          alt="insert"
          style={{
            display: "block",
            textAlign: "center" /* Căn giữa văn bản */,
            marginTop: 10 /* Khoảng cách giữa nút và liên kết */,
            color: "#27aae1" /* Màu chữ cho liên kết */,
            textDecoration: "none" /* Bỏ gạch chân */,
            marginRight: 18,
            fontSize: 16,
            fontWeight: 600,

          }}
        >
          Theo tuần
        </a>
      </div>

      <canvas id="myChart"></canvas>
    </div>
  );
};

export default TopProductsChart;
