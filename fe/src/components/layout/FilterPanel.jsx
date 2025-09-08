import React from "react";
import { Select, Slider, Checkbox, Divider } from "antd";

const FilterPanel = ({ categories, filters, onChange }) => {
  const handleCategoryChange = (value) => {
    onChange({ ...filters, category: value });
  };

  const handlePriceChange = (value) => {
    onChange({ ...filters, minPrice: value[0], maxPrice: value[1] });
  };

  const handleCheckboxChange = (e, key) => {
    onChange({ ...filters, [key]: e.target.checked });
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <Divider>Filter</Divider>
      <div style={{ marginBottom: 10 }}>
        <span>Danh mục: </span>
        <Select
          style={{ width: 200 }}
          placeholder="Chọn category"
          allowClear
          value={filters.category || undefined}
          onChange={handleCategoryChange}
        >
          {categories.map((cat) => (
            <Select.Option key={cat} value={cat}>
              {cat}
            </Select.Option>
          ))}
        </Select>
      </div>

      <div style={{ marginBottom: 10 }}>
        <span>Khoảng giá: </span>
        <Slider
          range
          step={10}
          min={0}
          max={1000}
          value={[filters.minPrice || 0, filters.maxPrice || 1000]}
          onChange={handlePriceChange}
          style={{ width: 300 }}
        />
      </div>

      <div>
        <Checkbox
          checked={filters.featured || false}
          onChange={(e) => handleCheckboxChange(e, "featured")}
        >
          Nổi bật
        </Checkbox>
        <Checkbox
          checked={filters.discount || false}
          onChange={(e) => handleCheckboxChange(e, "discount")}
          style={{ marginLeft: 20 }}
        >
          Khuyến mãi
        </Checkbox>
      </div>
    </div>
  );
};

export default FilterPanel;
