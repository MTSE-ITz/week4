import React, { useEffect, useState } from "react";
import { Spin, Empty, Pagination, Card } from "antd";
import { listFavouriteApi } from "../util/api";
import "../styles/FavouritePage.css";

const FavouritePage = ({ userId }) => {
  const [favourites, setFavourites] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const fetchFavourites = async () => {
    try {
      setLoading(true);
      console.log(">>> userId: ", userId);
      
      const res = await listFavouriteApi(userId, page, pageSize);
      console.log(">>> res: ", res);
      
      setFavourites(res.items.map(item => item.product));
      setTotal(res.totalItems);
    } catch (error) {
      console.error("Fetch favourites error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFavourites();
    }
  }, [page, userId]);

  return (
    <div className="favourite-page">
      <h2 className="page-title">Sản phẩm yêu thích</h2>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : favourites.length === 0 ? (
        <Empty description="Chưa có sản phẩm yêu thích" className="empty-favourite" />
      ) : (
        <>
          <div className="product-grid">
            {favourites.map(product => (
              <Card
                key={product.id}
                hoverable
                cover={
                  <img
                    alt={product.name}
                    src={product.image}
                    className="product-image"
                  />
                }
                className="product-card"
              >
                <h3 className="product-name">{product.name}</h3>
                <p className="product-category">📚 {product.category}</p>
                <p className="product-price">💰 {product.price} $</p>
                <p className="product-description">{product.description}</p>
              </Card>
            ))}
          </div>

          <div className="pagination-container">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default FavouritePage;
