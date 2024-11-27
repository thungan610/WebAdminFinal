// import React, { useEffect, useState } from "react";
// import {
//   Chart,
//   CategoryScale,
//   LinearScale,
//   PieController,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// const TopProductsChart = () => {
//   const getStartOfWeek = () => {
//     const today = new Date();
//     const dayOfWeek = today.getDay(); // 0 (Chủ nhật) đến 6 (Thứ bảy)
//     const startOfWeek = new Date(today);
//     startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Nếu Chủ nhật, lấy thứ Hai trước đó
//     return startOfWeek.toISOString().split("T")[0]; // Trả về dạng 'YYYY-MM-DD'
//   };

//   const [selectedDate, setSelectedDate] = useState(getStartOfWeek());
//   const [chartInstance, setChartInstance] = useState(null);
//   const [dateRange, setDateRange] = useState("");

//   const calculateDateRange = (startDate) => {
//     const start = new Date(startDate);
//     const end = new Date(start);
//     end.setDate(start.getDate() + 6);

//     const formatDate = (date) =>
//       `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
//         .toString()
//         .padStart(2, "0")}/${date.getFullYear()}`;

//     return `${formatDate(start)} - ${formatDate(end)}`;
//   };

//   useEffect(() => {
//     Chart.register(
//       CategoryScale,
//       LinearScale,
//       PieController,
//       ArcElement,
//       Title,
//       Tooltip,
//       Legend
//     );

//     const fetchData = async () => {
//       try {
//         const query = `?date=${selectedDate}`;
//         const res = await fetch(
//           `https://server-vert-rho-94.vercel.app/products/getTop10PW${query}`
//         );
//         const result = await res.json();

//         const labels = [];
//         const data = [];
//         result.data.forEach((element) => {
//           labels.push(element.name);
//           data.push(Number(element.sold));
//         });

//         const ctx = document.getElementById("myChart").getContext("2d");

//         if (chartInstance) {
//           chartInstance.destroy();
//         }

//         const newChart = new Chart(ctx, {
//           type: "pie",
//           data: {
//             labels: labels,
//             datasets: [
//               {
//                 label: "Lượt bán",
//                 data: data,
//                 backgroundColor: [
//                   "rgba(255, 99, 132, 0.6)",
//                   "rgba(54, 162, 235, 0.6)",
//                   "rgba(75, 192, 192, 0.6)",
//                   "rgba(255, 206, 86, 0.6)",
//                   "rgba(153, 102, 255, 0.6)",
//                   "rgba(255, 159, 64, 0.6)",
//                   "rgba(201, 203, 207, 0.6)",
//                 ],
//                 borderColor: [
//                   "rgba(255, 99, 132, 1)",
//                   "rgba(54, 162, 235, 1)",
//                   "rgba(75, 192, 192, 1)",
//                   "rgba(255, 206, 86, 1)",
//                   "rgba(153, 102, 255, 1)",
//                   "rgba(255, 159, 64, 1)",
//                   "rgba(201, 203, 207, 1)",
//                 ],
//                 borderWidth: 1,
//               },
//             ],
//           },
//           options: {
//             responsive: true,
//             maintainAspectRatio: true,
//             aspectRatio: 1.5,
//             plugins: {
//               legend: {
//                 position: "top",
//               },
//               title: {
//                 display: true,
//                 text: "Top sản phẩm bán chạy",
//               },
//             },
//           },
//         });

//         setChartInstance(newChart);

//         setDateRange(calculateDateRange(selectedDate));
//       } catch (error) {
//         console.error("Error fetching or displaying data:", error);
//       }
//     };

//     fetchData();
//   }, [selectedDate]);

//   return (
//     <div style={{ padding: 5, marginBottom: "20px" }}>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <a
//           className="btn-chart"
//           href="/charts"
//           style={{
//             textAlign: "center",
//             marginTop: 10,
//             color: "#27aae1",
//             textDecoration: "none",
//             marginRight: 18,
//             fontSize: 16,
//             fontWeight: 600,
//           }}
//         >
//           Quay lại
//         </a>
//         <h1
//           style={{
//             paddingLeft: 20,
//             color: "#27AAE1",
//             fontSize: "24px",
//             fontWeight: "bold",
//             textAlign: "center",
//             textTransform: "uppercase",
//           }}
//         >
//           Sản phẩm bán chạy trong khoảng thời gian
//         </h1>

//         <div style={{ display: "flex", justifyContent: "center" }}>
//           <input
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             style={{
//               padding: "8px 12px",
//               fontSize: "14px",
//               border: "none",
//               borderRadius: "5px",
//               backgroundColor: "rgba(39, 170, 225, 0.6)",
//               color: "white",
//               cursor: "pointer",
//               boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//             }}
//           />
//         </div>
//       </div>

//       {dateRange && (
//         <p
//           style={{
//             textAlign: "center",
//             marginTop: "10px",
//             fontSize: "14px",
//             color: "#555",
//           }}
//         >
//           Khoảng thời gian: {dateRange}
//         </p>
//       )}

//       <div style={{ maxWidth: "400px", margin: "0 auto" }}>
//         <canvas id="myChart" style={{ maxWidth: "100%", height: "auto" }}></canvas>
//       </div>
//     </div>
//   );
// };

// export default TopProductsChart;
