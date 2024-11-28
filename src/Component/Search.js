import React, { useState } from "react";
import { Input } from "antd";
import { useNavigate } from "react-router-dom";
import "./Search.css";
import bell from "../assets/images/bell.png";
import mail from "../assets/images/mail.png";
import Noti from "./Noti";

const { Search } = Input;

function SearchComponent() {
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showNoti, setShowNoti] = useState(false); // State quản lý Noti
  const navigate = useNavigate();

  const handleSearch = async (value) => {
    if (!value) {
      setShowSuggestions(false);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:6677/products/search?key=${value}`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.data);
        setShowSuggestions(true);
      } else {
        console.error("Lỗi khi gọi API:", response.status);
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  const handleSelectSuggestion = (productId) => {
    setShowSuggestions(false);
    navigate(`/products?product=${productId}`);
  };

  const toggleNoti = () => {
    setShowNoti(!showNoti);
  };

  return (
    <div className="search-component">
      <Input
        placeholder="Nhập để tìm kiếm..."
        className="search-inside"
        onChange={(e) => handleSearch(e.target.value)}
      />
      <div className="icon-component">
        <div className="bell-wrapper">
          <img
            className="bell-icon"
            src={bell}
            alt="bell"
            onClick={toggleNoti}
          />
          {showNoti && (
            <div className="noti-container">
              <Noti />
            </div>
          )}
        </div>
        <img className="mail-icon" src={mail} alt="mail" />
      </div>

      {showSuggestions && searchResults.length > 0 && (
        <div className="search-suggestions">
          {searchResults.map((product) => (
            <div
              key={product._id}
              className="suggestion-item"
              onClick={() => handleSelectSuggestion(product._id)}
            >
              {product.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchComponent;
