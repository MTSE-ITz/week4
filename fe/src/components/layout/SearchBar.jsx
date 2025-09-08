import React from "react";
import { Input } from "antd";

const { Search } = Input;

const SearchBar = ({ onSearch }) => {
  return (
    <div style={{ marginBottom: 20 }}>
      <Search
        placeholder="Tìm sản phẩm..."
        allowClear
        enterButton="Search"
        size="large"
        onSearch={(value) => onSearch(value)}
      />
    </div>
  );
};

export default SearchBar;
