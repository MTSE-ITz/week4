import React from "react";
import { List, Card } from "antd";

const ProductList = ({ products }) => {
  if (!products || products.length === 0) {
    return <p style={{ textAlign: "center" }}>Không tìm thấy sản phẩm.</p>;
  }

  return (
    <List
      grid={{ gutter: 16, column: 3 }}
      dataSource={products}
      renderItem={(item) => (
        <List.Item key={item.id}>
          <Card
            hoverable
            cover={
              <img
                alt={item.name}
                src={item.image}
                style={{ height: 200, objectFit: "cover" }}
              />
            }
            title={item.name}
          >
            <p>📚 Category: {item.category}</p>
            <p>💰 Price: {item.price} $</p>
            <p>{item.description}</p>
          </Card>
        </List.Item>
      )}
    />
  );
};

export default ProductList;
