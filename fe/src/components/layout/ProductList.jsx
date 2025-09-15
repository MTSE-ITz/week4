import React from "react";
import { List, Card } from "antd";
import { HeartOutlined } from "@ant-design/icons";

const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const ProductList = ({ products }) => {
  if (!products || products.length === 0) {
    return <p style={{ textAlign: "center" }}>Không tìm thấy sản phẩm.</p>;
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={products}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card
              hoverable
              style={{ minHeight: 430 }}
              cover={
                <img
                  alt={item.name}
                  src={item.image}
                  style={{ height: 200, objectFit: "cover" }}
                />
              }
              title={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontWeight: "bold" }}>{item.name}</span>
                  <HeartOutlined style={{ color: "#ff4d4f", fontSize: 20 }} />
                </div>
              }
            >
              <p>📚 Category: {item.category}</p>
              <p>💰 Price: {item.price} $</p>
              {/* Rút gọn description nếu dài */}
              <p>{truncateText(item.description, 120)}</p>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default ProductList;
