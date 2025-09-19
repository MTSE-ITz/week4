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
} from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import {
  getFavoriteProducts,
  addFavoriteProduct,
  deleteFavoriteProduct,
} from '../util/api';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;
const { Text } = Typography;

const FavoriteProduct = () => {
  const [favoritesList, setFavoritesList] = useState([]);
  const [favoritesIds, setFavoritesIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const navigate = useNavigate();

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await getFavoriteProducts();
      if (res?.data?.content) {
        setFavoritesList(res.data.content.map((f) => f.product));
        setFavoritesIds(res.data.content.map((f) => f.product._id));
      }
    } catch (error) {
      console.error('Fetch favorites error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  const toggleFavorite = async (productId, e) => {
    if (e) e.stopPropagation();
    try {
      if (favoritesIds.includes(productId)) {
        await deleteFavoriteProduct(productId);
        setFavoritesIds(favoritesIds.filter((id) => id !== productId));
        setFavoritesList(favoritesList.filter((p) => p._id !== productId));
        api.success({
          message: 'Xóa khỏi yêu thích thành công',
          placement: 'topRight',
        });
      } else {
        await addFavoriteProduct(productId);
        const newProduct =
          favoritesList.find((p) => p._id === productId) || null;
        setFavoritesIds([...favoritesIds, productId]);
        if (newProduct) setFavoritesList([...favoritesList, newProduct]);
        api.success({
          message: 'Thêm vào yêu thích thành công',
          placement: 'topRight',
        });
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
      api.error({ message: 'Có lỗi xảy ra', placement: 'topRight' });
    }
  };

  return (
    <>
      {contextHolder}
      <Spin spinning={loading}>
        {favoritesList.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: 50 }}>
            <Text type='secondary'>Bạn chưa có sản phẩm yêu thích nào.</Text>
          </div>
        ) : (
          <Row
            gutter={[8, 8]}
            style={{
              marginTop: 20,
              paddingInline: 20,
              rowGap: 8,
              marginInline: 4,
            }}
          >
            {favoritesList.map((product) => (
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
                    favoritesIds.includes(product._id) ? (
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
};

export default FavoriteProduct;
