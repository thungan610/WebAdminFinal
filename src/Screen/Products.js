import React, { useEffect, useState } from "react";
import filter from "../assets/images/filter.png";
import search from "../assets/images/search.png"
import "../Screen/Products.css";
import insert from "../assets/images/insert.png";
import deleteimg from "../assets/images/delete.png";
import eyeOn from "../assets/images/eyeson.png";
import eyeOff from "../assets/images/eyesoff.png";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const productId = query.get("product");
  const navigate = useNavigate();
  useEffect(() => {
    const getAllCategories = async () => {
      const response = await fetch(
        "https://server-vert-rho-94.vercel.app/categories"
      );
      const result = await response.json();
      setCategories(result.data);
    };
    getAllCategories();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      let url = "https://server-vert-rho-94.vercel.app/products/getProducts";
      if (category) {
        url = `https://server-vert-rho-94.vercel.app/products/filter/${category}`;
      }
  
      const response = await fetch(url);
      const result = await response.json();
      let filtered = result.data;
  
      // Lọc theo từ khóa tìm kiếm
      if (searchKey) {
        filtered = filtered.filter((product) =>
          product.name.toLowerCase().includes(searchKey.toLowerCase())
        );
      }
  
      // Sắp xếp theo số lượng tăng dần
      filtered.sort((a, b) => a.quantity - b.quantity);
  
      setProducts(filtered);
  
      if (productId) {
        const selectedProduct = filtered.find(
          (product) => product._id === productId
        );
        if (selectedProduct) {
          setProducts([selectedProduct]);
        }
      }
    };
  
    getProducts();
  }, [category, searchKey, productId]);
  

  // const handleDelete = async (id) => {
  //   try {
  //     const _result = await Swal.fire({
  //       title: "Bạn có chắc chắn?",
  //       text: "Không thể hoàn tác hành động này!",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Vâng, xóa nó!",
  //     });
  //     if (!_result.isConfirmed) {
  //       return;
  //     }
  //     const response = await fetch(
  //       `https://server-vert-rho-94.vercel.app/products/${id}/delete`,
  //       { method: "DELETE" }
  //     );
  //     const result = await response.json();
  //     if (result.success) {
  //       setProducts(products.filter((item) => item._id !== id));
  //       setSearchKey("");
  //     } else {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Thất bại",
  //         text: "Xóa sản phẩm thất bại",
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error deleting product:", error);
  //   }
  // };
  const handleDelete = async (id) => {
    try {
      const _result = await Swal.fire({
        title: "Bạn có chắc chắn?",
        text: "Không thể hoàn tác hành động này!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Vâng, xóa nó!",
      });
      if (!_result.isConfirmed) {
        return;
      }
  
      const response = await fetch(
        `https://server-vert-rho-94.vercel.app/products/${id}/delete`,
        { method: "DELETE" }
      );
      const result = await response.json();
  
      if (result.success) {
        setProducts(products.filter((item) => item._id !== id));
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Sản phẩm đã được xóa",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: result.message || "Xóa sản phẩm thất bại",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã xảy ra lỗi trong khi xóa sản phẩm",
      });
      console.error("Error deleting product:", error);
    }
  };
  

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <h1
        style={{
          padding: "5px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          color: "#27AAE1",
          fontSize: "25px",
          fontWeight: "bold",
          textTransform: "uppercase",
          paddingBottom: "12px"
        }}
      >
        Quản lý sản phẩm
      </h1>
      <div className="allofAll">
        <div className="table-all">
          <div className="headersP">
            <div className="filter-sp">
              <img className="filter-icon" src={filter} alt="icon" />
              <div className="mb-3" style={{ display: "flex", gap: "10px" }}>
                <div className="inside-container2">
                  <select
                    className="form-selectne"
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setSearchKey("");
                    }}
                  >
                    <option value="">Tất cả danh mục</option>
                    {categories.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Nhập để tìm sản phẩm"
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
            
                  />
                  <img src={search} alt="search-icon" />
                </div>
              </div>
            </div>

            <button
              className="insert-btn"
              onClick={() => navigate("/insert-product")}
            >
              Thêm mới
            </button>
          </div>
          <div className="nene">
            <div className="table-small">
              <table
                className="product-table"
                border={1}
                cellPadding="10"
                cellSpacing="0"
              >
                <thead>
                  <tr className="boder-tr">
                    
                    <th>Hình ảnh</th>
                    <th>Danh mục</th>
                    <th>Tên sản phẩm</th>
                    <th>Đơn vị đo</th>
                    <th>Giá tiền</th>
                    <th>Số lượng</th>
                    <th>Lượt bán</th>
                    <th>Tác vụ</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan="9"
                        style={{ textAlign: "center", padding: "20px" }}
                      >
                        Chưa có sản phẩm
                      </td>
                    </tr>
                  ) : (
                    products.map((item, index) => (
                      <tr className="table" key={index}>
                        
                        <td className="cube">
                          {item.images && item.images.length > 0 ? (
                            <img
                              className="imgP"
                              src={item.images[0]}
                              alt={item.name}
                              width="100"
                              height="100"
                            />
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td className="cube">{item.category.category_name}</td>
                        <td className="cubeN">
                          {item.name}
                          <div className="">
                            {item.quantity === 0 && (
                              <span
                                style={{
                                  display: "inline-block",
                                  marginLeft: "10px",
                                  padding: "3px 8px",
                                  backgroundColor: "red",
                                  color: "white",
                                  borderRadius: "5px",
                                  fontSize: "12px",
                                }}
                              >
                                Hết hàng
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="cube">{item.oum}</td>
                        <td className="cube">
                          <div style={{ position: "relative" }}>
                            {/* Giá cũ (gạch ngang nếu có giảm giá) */}
                            <div>
                              <span
                                style={{
                                  color: item.discount > 0 ? "gray" : "black",
                                  fontSize: "14px",
                                  textDecoration:
                                    item.discount > 0 ? "line-through" : "none", // Gạch giá cũ nếu có giảm giá
                                }}
                              >
                                {item.price.toLocaleString()}đ
                              </span>
                            </div>

                            {/* Giá mới (bên dưới giá cũ nếu có giảm giá) */}
                            {item.discount > 0 && (
                              <div>
                                <span
                                  style={{
                                    paddingTop: "10px",
                                    color: "green",
                                    fontSize: "16px", // Font lớn hơn để làm nổi bật
                                    fontWeight: "bold", // Bôi đậm giá mới
                                  }}
                                >
                                  {(
                                    item.price - item.discount
                                  ).toLocaleString()}
                                  đ
                                </span>
                              </div>
                            )}

                            {/* Tag giảm giá (vẫn nằm ở vị trí cũ) */}
                            {/* Tag giảm giá hiển thị đ hoặc % */}
                            {item.discount != null && item.discount > 0 && (
                              <span
                                style={{
                                  position: "absolute",
                                  bottom: "29px",
                                  left: "47px",
                                  backgroundColor: "red",
                                  color: "white",
                                  padding: "2px 6px",
                                  borderRadius: "5px",
                                  fontSize: "10px",
                                  transform: "rotate(45deg)",
                                  textAlign: "center",
                                }}
                              >
                                {item.discount >= 100
                                  ? `- ${item.discount.toLocaleString()}đ`
                                  : `- ${item.discount.toLocaleString()}%`}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="cubeST">{item.quantity}</td>
                        <td className="cube">{item.sold || 0}</td>
                        <td className="cubeF">
                          <div className="btn-container">
                            <button
                              className="update-button"
                              onClick={() =>
                                navigate(`/update-product/${item._id}`)
                              }
                            >
                              <img
                                className="insertimg"
                                src={insert}
                                alt="insert"
                              />
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="delete-button"
                            >
                              <img
                                className="deleteimg"
                                src={deleteimg}
                                alt="delete"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
