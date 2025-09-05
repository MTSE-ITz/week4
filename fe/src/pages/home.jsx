import React, { useEffect, useState } from "react";
import { Result, List, Card, Pagination, Spin } from "antd";
import { CrownOutlined } from "@ant-design/icons";
import { getProductApi } from "../util/api";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(6);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (pageNumber = 1) => {
  try {
    setLoading(true);
    const res = await getProductApi(pageNumber, pageSize);
    console.log("API response:", res);

    if (res) {
      setProducts(res.items || []);
      setTotal(res.totalItems || 0);
    }
  } catch (error) {
    console.error("Fetch products error: ", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  return (
    <div style={{ padding: 20 }}>
      <Result icon={<CrownOutlined />} title="Home Page" />

      {loading ? (
        <div style={{ textAlign: "center", marginTop: 50 }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
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
          <Pagination
            current={page}
            pageSize={pageSize}
            total={total}
            onChange={(p) => setPage(p)}
            style={{ textAlign: "center", marginTop: 20 }}
          />
        </>
      )}
    </div>
  );
};

export default HomePage;
