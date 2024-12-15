import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./InsertProduct.css";
import { FloatButton } from "antd";

const UpdateProduct = (props) => {
  // lấy id từ url;
  let { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [preserves, setPreserves] = useState([]);
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [origin, setOrigin] = useState("");
  const [price, setPrice] = useState("");
  const [fiber, setFiber] = useState("");
  const [oum, setOum] = useState("");
  const [preserve, setPreserve] = useState("");
  const [supplier, setSupplier] = useState("");
  const [uses, setUses] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");

  const [errors, setErrors] = useState({
    name: false,
    category: false,
    quantity: false,
    price: false,
    oum: false,
    preserve: false,
    images: false,
  });

  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch(
          `https://server-vert-rho-94.vercel.app/products/getProductDetailById_App/${id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        const product = result.products;
        setName(product.name);
        setCategory(product.category.category_id);
        setQuantity(product.quantity);
        setOrigin(product.origin);
        setPrice(product.price);
        setFiber(product.fiber);
        setOum(product.oum);
        setPreserve(product.preserve.preserve_id);
        setSupplier(product.supplier);
        setUses(product.uses);
        setDiscount(product.discount);
        setImages(product.images);
        setDescription(product.description);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };
    getProducts();
  }, [id]);

  // useEffect(() => {
  //   if (categories.length > 0 && preserves.length > 0) {
  //     // Bảo đảm dữ liệu đã tải xong trước khi đặt giá trị mặc định
  //     setCategory((prev) => prev || product.category._id);
  //     setPreserve((prev) => prev || product.preserve._id);
  //   }
  // }, [categories, preserves]);

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
    const getAllPreserves = async () => {
      const response = await fetch(
        "https://server-vert-rho-94.vercel.app/preserves"
      );
      const result = await response.json();
      setPreserves(result.data);
    };
    getAllPreserves();
  }, []);

  const uploadToCloundinary = async () => {
    try {
      const file = document.getElementById("image").files[0];
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "ml_default");
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dffuzgy5h/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const result = await response.json();
      setImages([...images, result.secure_url]);
    } catch (error) {
      console.error("Failed to upload image:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể upload ảnh!",
      });
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrl) {
      setImages([...images, imageUrl]);
      setImageUrl(""); // Reset input
    }
  };

  const removeImage = (img) => {
    const newImages = images.filter(
      (item) => item.toString() !== img.toString()
    );
    setImages(newImages);
  };

  // const handleCancle = async() => {
  //   try {

  //   } catch (error) {

  //   }
  // }

  const handleSubmit = async () => {
    try {
      // Kiểm tra các trường bắt buộc
      let formErrors = { ...errors };

      formErrors.name = !name;
      formErrors.category = !category;
      formErrors.quantity = !quantity;
      formErrors.price = !price;
      formErrors.oum = !oum;
      formErrors.preserve = !preserve;
      formErrors.images = images.length === 0;

      setErrors(formErrors);

      if (
        formErrors.name ||
        formErrors.category ||
        formErrors.quantity ||
        formErrors.price ||
        formErrors.oum ||
        formErrors.preserve ||
        formErrors.images
      ) {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: "Vui lòng nhập đầy đủ thông tin cần thiết",
        });
        return;
      }
      if (quantity <= 0) {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: "Số lượng phải từ 1 trở lên",
        });
        return;
      }
      if (price < 0) {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: "Giá tiền không được là số âm",
        });
        return;
      }
      if (discount < 0) {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: "Giá giảm không được là số âm",
        });
        return;
      }
      const unitRegex = /^(?:\d*\s*(kg|chai|bó|gram|lít|thùng|con|ml))$/i; // Cập nhật regex cho phép nhập số hoặc không có số, sau đó là đơn vị hợp lệ

      // Kiểm tra xem đơn vị có hợp lệ không
      if (!unitRegex.test(oum.trim())) {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: "Đơn vị không hợp lệ. Vui lòng nhập: kg, chai, bó, gram, lít, thùng, con, ml.",
        });
        return;
      }
      
      
      

      const body = {
        name: name,
        category: category,
        quantity: quantity,
        origin: origin || "",
        price: price,
        fiber: fiber || "",
        oum: oum || "",
        preserve: preserve,
        supplier: supplier || "",
        uses: uses || "",
        discount: discount || "",
        images: images,
        description: description || "",
      };

      const result = await fetch(
        //http://localhost:6677/products/6728dd246ff2d4dd89c96bf8/update
        `https://server-vert-rho-94.vercel.app/products/${id}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const response = await result.json();

      if (response.status) {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Sửa sản phẩm thành công",
        });

        setName("");
        setCategory("");
        setQuantity("");
        setOrigin("");
        setPrice("");
        setFiber("");
        setOum("");
        setPreserve("");
        setSupplier("");
        setUses("");
        setDiscount("");
        setImages([]);
        setDescription("");

        navigate("/products");
      } else {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: "Sửa sản phẩm thất bại",
        });
      }
    } catch (error) {
      console.log("....Loi:", error);
      Swal.fire({
        icon: "error",
        title: "Thất bại",
        text: "Sửa sản phẩm thất bại",
      });
    }
  };

  return (
    <div className="containerne">
      <form className="form-container">
        <div className="titleF">
          <h1>Sửa sản phẩm</h1>
        </div>

        <div className="n-c-q-x-container">
          <div className="mb-4 mt-4">
            <div className="inside-container">
              <label className="form-label">Tên sản phẩm:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập name"
                value={name}
                style={{
                  borderColor: errors.name ? "red" : "",
                }}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3">
            <div className="inside-container">
              <label className="form-label">Danh mục:</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((item, index) => {
                  return (
                    <option key={index} value={item._id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="mb-3">
            <div className="inside-container">
              <label className="form-label">Số lượng:</label>
              <input
                type="number"
                className="form-control"
                placeholder="Nhập quantity"
                style={{
                  borderColor: errors.quantity ? "red" : "",
                }}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3">
            <div className="inside-container">
              <label className="form-label">Xuất xứ:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập description"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="g-d-c-l-container">
          <div className="mb-3">
            <div className="inside-container">
              <label className="form-label">Giá sản phẩm:</label>
              <input
                type="number"
                className="form-control"
                placeholder="Nhập price"
                style={{
                  borderColor: errors.price ? "red" : "",
                }}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3">
            <div className="inside-container">
              <label className="form-label">Chất sơ:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập fiber"
                value={fiber}
                onChange={(e) => setFiber(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3">
            <div className="inside-container">
              <label className="form-label">Đơn vị tính:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập oum"
                style={{
                  borderColor: errors.oum ? "red" : "",
                }}
                value={oum}
                onChange={(e) => setOum(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <div className="inside-container">
              <label className="form-label">Loại hàng:</label>
              <select
                className="form-select"
                value={preserve}
                onChange={(e) => setPreserve(e.target.value)}
              >
                {preserves.map((item, index) => {
                  return (
                    <option key={index} value={item._id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        <div className="n-c-a-container">
          <div className="mb-3">
            <div className="inside-container">
              <label className="form-label">Nhà cung cấp:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập supplier"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <div className="inside-container">
              <label className="form-label">Công dụng:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập uses"
                value={uses}
                onChange={(e) => setUses(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3">
            <div className="inside-container">
              <label className="form-label">Giảm giá:</label>
              <input
                type="number"
                className="form-control"
                placeholder="Nhập giá giảm"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3 link-container">
            <div className="inside-container">
              <label className="form-label">Hoặc dán link ảnh:</label>
              <div className="linkimg-container">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Dán link ảnh vào đây"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                <FloatButton
                  shape="square"
                  className="btn-link"
                  onClick={handleAddImageUrl}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="image-upload-container">
          <div className="inside-container">
            <label className="form-label">Ảnh từ thiết bị:</label>
            <input
              type="file"
              className="form-controlimg"
              style={{
                borderColor: errors.images ? "red" : "",
              }}
              id="image"
              onChange={uploadToCloundinary}
            />
          </div>

          <div className="image-preview-container">
            {images.map((item, index) => (
              <div key={index} className="image-preview">
                <img src={item} alt="preview" />
                <button
                  onClick={() => removeImage(item)}
                  className="remove-image-btn"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-3">
          <div className="inside-container">
            <label className="form-label">Mô tả:</label>
            <textarea
              className="form-controlD"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="btn-container2">
          <button
            onClick={() => navigate("/products")}
            className="btn-primaryC"
          >
            Hủy
          </button>
          <button onClick={handleSubmit} type="button" className="btn-primary">
            Sửa
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
