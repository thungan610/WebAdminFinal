import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./InsertProduct.css";

const InsertProduct = () => {
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

  useEffect(() => {
    const getAllCategories = async () => {
      const response = await fetch("http://localhost:6677/categories");
      const result = await response.json();
      setCategories(result.data);
      if (result.data.length > 0) {
        setCategory(result.data[0]._id); // Đặt giá trị ban đầu cho category là mục đầu tiên
      }
    };
    getAllCategories();
  }, []);

  useEffect(() => {
    const getAllPreserves = async () => {
      const response = await fetch("http://localhost:6677/preserves");
      const result = await response.json();
      setPreserves(result.data);
      if (result.data.length > 0) {
        setPreserve(result.data[0]._id); // Đặt giá trị ban đầu cho preserve là mục đầu tiên
      }
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
      console.error("Lỗi tải ảnh:", error);
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

  const handleSubmit = async () => {
    try {
      if (
        !name ||
        !category ||
        !quantity ||
        !price ||
        !oum ||
        !preserve ||
        images.length === 0
      ) {
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: "Vui lòng nhập đầy đủ thông tin",
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

      const body = {
        name: name,
        category: category,
        quantity: quantity,
        origin: origin,
        price: price,
        fiber: fiber,
        oum: oum,
        preserve: preserve,
        supplier: supplier,
        uses: uses,
        images: images,
        description: description,
      };
      const result = await fetch("http://localhost:6677/products/addSP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const response = await result.json();
      // debugger
      if (response.success) {
        // alert("Thêm sản phẩm thành công");
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Thêm sản phẩm thành công",
        });
        // reset form
      } else {
        // alert("Thêm sản phẩm không thành công");
        Swal.fire({
          icon: "error",
          title: "Thất bại",
          text: "Thêm sản phẩm thất bại",
        });
      }
    } catch (error) {
      console.log("....Loi:", error);
      Swal.fire({
        icon: "error",
        title: "Thất bại",
        text: "Thêm sản phẩm thất bại",
      });
    }
    const _result = await Swal.fire({
      title: "Are you sure?",
      text: "Bạn có chắc chắn thêm sản phẩm này không?",
      icon: "success",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, I'm sure",
    });

    if (!_result.isConfirmed) {
      return;
    }
    setName("");
    setCategory(categories[0]?._id || ""); // Đặt lại category về mục đầu tiên
    setQuantity("");
    setOrigin("");
    setPrice("");
    setFiber("");
    setOum("");
    setPreserve(preserves[0]?._id || ""); // Đặt lại preserve về mục đầu tiên
    setSupplier("");
    setUses("");
    setImages([]);
    setDescription("");

    // quay về trang ds
    navigate(-1);
  };

  return (
    <div className="containerne">
      <form className="form-container">
        <div className="titleF">
          <h1>Thêm sản phẩm</h1>
        </div>

        <div className="n-c-q-x-container">
          <div className="mb-4 mt-4">
            <div className="inside-container">
              <label className="form-label">Tên sản phẩm:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter name"
                value={name}
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
                placeholder="Enter quantity"
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
                placeholder="Enter description"
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
                placeholder="Enter price"
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
                placeholder="Enter fiber"
                value={fiber}
                onChange={(e) => setFiber(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3">
            <div className="inside-container">
              <label className="form-label">Đơn vị đo:</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter oum"
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
                placeholder="Enter supplier"
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
                placeholder="Enter uses"
                value={uses}
                onChange={(e) => setUses(e.target.value)}
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
                <button
                  type="button"
                  className="btn-link"
                  onClick={handleAddImageUrl}
                >
                  Dán 
                </button>
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
            Thêm mới
          </button>
        </div>
      </form>
    </div>
  );
};

export default InsertProduct;
