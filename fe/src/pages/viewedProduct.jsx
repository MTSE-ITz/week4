import React, { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Spin,
  Tag,
  Image,
  notification,
  Typography,
  Button,
} from 'antd';
import { HeartOutlined, HeartFilled, DeleteOutlined } from '@ant-design/icons';
import {
  getViewedProducts,
  deleteViewedProduct,
  getFavoriteProducts,
  addFavoriteProduct,
  deleteFavoriteProduct,
} from '../util/api';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;
const { Text } = Typography;

export default function ViewedProductPage() {
  const [viewedList, setViewedList] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  // Fetch both viewed products & favorite products
  const fetchData = async () => {
    setLoading(true);
    try {
      const [viewedRes, favRes] = await Promise.all([
        getViewedProducts(),
        getFavoriteProducts(),
      ]);

      if (viewedRes?.data?.content) setViewedList(viewedRes.data.content);
      if (favRes?.data?.content)
        setFavoriteIds(favRes.data.content.map((f) => f.product._id));
    } catch (error) {
      console.error('Fetch viewed/favorite products error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCardClick = (id) => navigate(`/product/${id}`);

  const toggleFavorite = async (productId, e) => {
    if (e) e.stopPropagation();
    try {
      if (favoriteIds.includes(productId)) {
        await deleteFavoriteProduct(productId);
        setFavoriteIds(favoriteIds.filter((id) => id !== productId));
        api.success({ message: 'Xóa khỏi yêu thích thành công' });
      } else {
        await addFavoriteProduct(productId);
        setFavoriteIds([...favoriteIds, productId]);
        api.success({ message: 'Thêm vào yêu thích thành công' });
      }
    } catch (error) {
      console.error(error);
      api.error({ message: 'Có lỗi xảy ra' });
    }
  };

  const removeViewed = async (productId, e) => {
    if (e) e.stopPropagation();
    try {
      await deleteViewedProduct(productId);
      setViewedList(viewedList.filter((p) => p._id !== productId));
      api.success({ message: 'Xóa khỏi sản phẩm đã xem thành công' });
    } catch (error) {
      console.error(error);
      api.error({ message: 'Có lỗi xảy ra' });
    }
  };

  return (
    <>
      {contextHolder}
      <Spin spinning={loading}>
        {viewedList.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: 50 }}>
            <Text type='secondary'>Bạn chưa xem sản phẩm nào.</Text>
          </div>
        ) : (
          <Row
            gutter={[8, 8]}
            style={{ marginTop: 20, paddingInline: 20, marginInline: 0 }}
          >
            {viewedList.map((product) => (
              <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  onClick={() => handleCardClick(product._id)}
                  cover={
                    product.images?.length > 0 ? (
                      <Image
                        alt={product.name}
                        src={product.images[0]}
                        style={{
                          height: 200,
                          objectFit: 'contain',
                          width: '100%',
                        }}
                        preview={true}
                        onClick={(e) => e.stopPropagation()}
                      />
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
                    <Button variant='link' style={{ border: 'none' }}>
                      {favoriteIds.includes(product._id) ? (
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
                      )}
                    </Button>,
                    <Button
                      variant='link'
                      style={{ border: 'none', cursor: 'pointer' }}
                      key='remove'
                      onClick={(e) => removeViewed(product._id, e)}
                      color='red'
                    >
                      <DeleteOutlined />
                    </Button>,
                  ]}
                >
                  <Meta
                    title={product.name}
                    description={
                      <>
                        <p>💰 {product.price.toLocaleString()} đ</p>
                        <p>🏷 {product.brand}</p>
                        <p>
                          📦 {product.category?.name || 'Không có danh mục'}
                        </p>
                      </>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Spin>
    </>
  );
}
