import React, { useEffect, useState } from "react";
import filter from "../assets/images/filter.png";
import searchne from "../assets/images/searchne.png";
import "../Screen/Products.css";
import insert from "../assets/images/insert.png";
import deleteimg from "../assets/images/delete.png";
import eyeOn from "../assets/images/eyeson.png";
import eyeOff from "../assets/images/eyesoff.png";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [searchKey, setSearchKey] = useState("");
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const productId = query.get("product");

  useEffect(() => {
    const getAllCategories = async () => {
      const response = await fetch("https://server-vert-rho-94.vercel.app/categories");
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

      if (searchKey) {
        filtered = filtered.filter((product) =>
          product.name.toLowerCase().includes(searchKey.toLowerCase())
        );
      }

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
        setSearchKey("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: "Xóa sản phẩm thất bại",
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="allofAll">
      <div className="table-all">
        <div className="headersP">
          <div className="filter-sp">
            <img className="filter-icon" src={filter} alt="icon" />
            <div className="mb-3">
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
            </div>
          </div>
          <div className="search-box">
            <input
              type="text"
              placeholder="Nhập để tìm sản phẩm"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
            />
            <img src={searchne} alt="search-icon" />
          </div>
          <a className="insert-btn" href="/insert-Product" alt="insert">
            Thêm mới
          </a>
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
                  <th></th>
                  <th>Hình ảnh</th>
                  <th>Danh mục</th>
                  <th>Tên sản phẩm</th>
                  <th>Đơn vị đo</th>
                  <th>Giá tiền</th>
                  <th>Loại hàng</th>
                  <th>Xuất xứ</th>
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
                      <td className="cube1">
                        <div className="cube1-container">
                          <img
                            className="tick"
                            src={item.isHidden ? eyeOff : eyeOn}
                            alt="tick"
                          />
                        </div>
                      </td>
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
                      <td className="cube">{item.price}</td>
                      <td className="cubeST">{item.preserve.preserve_name}</td>
                      <td className="cube">{item.origin}</td>
                      <td className="cubeF">
                        <div className="btn-container">
                          <a
                            href={`/update-Product/${item._id}`}
                            className="update-button"
                          >
                            <img
                              className="insertimg"
                              src={insert}
                              alt="insert"
                            />
                          </a>
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
  );
}

export default Products;
