import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Pagination,
  Spin,
  Tag,
  Image,
  notification,
} from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import {
  addFavoriteProduct,
  addViewedProduct,
  deleteFavoriteProduct,
  getFavoriteProducts,
  getProductApi,
} from '../util/api';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;

const ProductPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0,
  });
  const [api, contextHolder] = notification.useNotification();

  const navigate = useNavigate();

  const fetchData = async (page = 1, size = 8) => {
    setLoading(true);
    try {
      const res = await getProductApi({ page, size });
      if (res?.data?.content) {
        setData(res.data.content);
        setPagination({
          current: page,
          pageSize: size,
          total: res.data.totalElements,
        });
      }

      const favRes = await getFavoriteProducts();
      setFavorites(favRes.data.content.map((f) => f.product._id));
    } catch (error) {
      console.error('Fetch products error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.current, pagination.pageSize);
  }, []);

  const handlePageChange = (page, pageSize) => {
    fetchData(page, pageSize);
  };

  const handleCardClick = async (id) => {
    navigate(`/product/${id}`);
    await addViewedProduct(id);
  };

  const toggleFavorite = async (productId, e) => {
    e.stopPropagation();
    try {
      if (favorites.includes(productId)) {
        await deleteFavoriteProduct(productId);
        setFavorites(favorites.filter((id) => id !== productId));
        api.success({
          message: 'Xóa khỏi yêu thích thành công',
          placement: 'topRight',
        });
      } else {
        await addFavoriteProduct(productId);
        setFavorites([...favorites, productId]);
        api.success({
          message: 'Thêm vào yêu thích thành công',
          placement: 'topRight',
        });
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
    }
  };

  return (
    <>
      {contextHolder}
      <Spin spinning={loading}>
        <Row
          gutter={[8, 8]}
          style={{
            marginTop: 20,
            paddingInline: 20,
            rowGap: 8,
            marginInline: 4,
          }}
        >
          {data.map((product) => (
            <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                onClick={() => handleCardClick(product._id)}
                cover={
                  product.images?.length > 0 ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        height: '100%',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Image
                        alt={product.name}
                        src={product.images[0]}
                        style={{
                          height: 200,
                          objectFit: 'contain',
                          width: '100%',
                        }}
                        preview={true}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        height: 200,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#f5f5f5',
                      }}
                    >
                      <Tag color='red'>No Image</Tag>
                    </div>
                  )
                }
                actions={[
                  favorites.includes(product._id) ? (
                    <HeartFilled
                      key='heart'
                      style={{ color: 'red' }}
                      onClick={(e) => toggleFavorite(product._id, e)}
                    />
                  ) : (
                    <HeartOutlined
                      key='heart'
                      onClick={(e) => toggleFavorite(product._id, e)}
                    />
                  ),
                ]}
              >
                <Meta
                  title={product.name}
                  description={
                    <>
                      <p>💰 {product.price.toLocaleString()} đ</p>
                      <p>🏷 {product.brand}</p>
                      <p>📦 {product.category?.name || 'Không có danh mục'}</p>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <Pagination
            style={{ justifyContent: 'center' }}
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePageChange}
          />
        </div>
      </Spin>
    </>
  );
};

export default ProductPage;
