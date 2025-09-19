import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Spin,
  Image,
  Tag,
  Row,
  Col,
  Card,
  Typography,
  Button,
  notification,
  Input,
  List,
} from 'antd';
import {
  HeartOutlined,
  HeartFilled,
  DeleteOutlined,
  LikeOutlined,
  DislikeOutlined,
  DislikeFilled,
  LikeFilled,
} from '@ant-design/icons';
import {
  getProductDetailApi,
  getProductSimilar,
  addFavoriteProduct,
  deleteFavoriteProduct,
  getFavoriteProducts,
  addViewedProduct,
  getComments,
  addComment,
  deleteComment,
  toggleDislikeComment,
  toggleLikeComment,
  countProductPurchase,
} from '../util/api';
import Meta from 'antd/es/card/Meta';
import { useContext } from 'react';
import { AuthContext } from '../components/context/auth.context';

const { Text, Title } = Typography;
const { TextArea } = Input;

const ProductDetailPage = () => {
  const { auth } = useContext(AuthContext);
  const user = auth.user;
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [productSimilar, setProductSimilar] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 0,
  });
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [totalPurchases, setTotalPurchases] = useState(0);

  const fetchSimilar = async (page = 1, size = 4, append = false) => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await getProductSimilar({ id, page, size });
      if (res?.result) {
        setProductSimilar((prev) =>
          append ? [...prev, ...res.data.content] : res.data.content
        );
        setPagination({
          current: page,
          pageSize: size,
          total: res.data.totalElements,
        });
      }
    } catch (error) {
      console.error('Fetch similar products error:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await getComments(id);
      if (res?.data) {
        setComments(
          res.data.content.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
      }
    } catch (error) {
      console.error('Fetch comments error:', error);
    }
  };

  const handleAddComment = async () => {
    if (!commentContent.trim()) return;
    try {
      await addComment(id, commentContent);
      setCommentContent('');
      api.success({ message: 'Thêm bình luận thành công' });
      await fetchComments();
    } catch (error) {
      console.error(error);
      api.error({ message: 'Có lỗi xảy ra khi thêm bình luận' });
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      api.success({ message: 'Xóa bình luận thành công' });
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error(error);
      api.error({ message: 'Có lỗi xảy ra khi xóa bình luận' });
    }
  };

  const fetchTotalPurchases = async () => {
    try {
      const res = await countProductPurchase(id);
      if (res?.result) {
        setTotalPurchases(res.data.totalPurchases);
      }
    } catch (error) {
      console.error('Fetch total purchases error:', error);
    }
  };

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const res = await getProductDetailApi(id);
      if (res?.result) setProduct(res.data);

      const favRes = await getFavoriteProducts();
      setFavorites(favRes.data.content.map((f) => f.product._id));

      await addViewedProduct(id);
      await fetchComments();
      await fetchTotalPurchases(id);
    } catch (error) {
      console.error('Fetch product detail error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
    fetchSimilar(1, pagination.pageSize);
  }, [id]);

  if (loading && !product) return <Spin style={{ marginTop: 50 }} />;
  if (!product) return <p>Không tìm thấy sản phẩm</p>;

  const toggleFavorite = async (productId, e) => {
    if (e) e.stopPropagation();
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
      console.error(error);
      api.error({ message: 'Có lỗi xảy ra', placement: 'topRight' });
    }
  };

  const handleToggleLike = async (commentId) => {
    try {
      await toggleLikeComment(commentId);
      await fetchComments();
    } catch (error) {
      console.error(error);
      api.error({ message: 'Có lỗi xảy ra khi like bình luận' });
    }
  };

  const handleToggleDislike = async (commentId) => {
    try {
      await toggleDislikeComment(commentId);
      await fetchComments();
    } catch (error) {
      console.error(error);
      api.error({ message: 'Có lỗi xảy ra khi dislike bình luận' });
    }
  };

  return (
    <>
      {contextHolder}
      <div style={{ padding: 20 }}>
        <Row gutter={24}>
          <Col xs={24} md={10}>
            {product.images?.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                style={{
                  width: '100%',
                  borderRadius: 8,
                  height: 400,
                  objectFit: 'cover',
                }}
              />
            ) : (
              <Tag color='red'>No Image</Tag>
            )}
          </Col>
          <Col xs={24} md={14}>
            <h2>{product.name}</h2>
            <p>
              <b>Giá:</b> 💰 {product.price.toLocaleString()} đ
            </p>
            <p>
              <b>Thương hiệu:</b> {product.brand}
            </p>
            <p>
              <b>Mô tả:</b> {product.description}
            </p>
            <p>
              <b>Tình trạng:</b>{' '}
              {product.inStock ? (
                <Tag color='green'>Còn hàng</Tag>
              ) : (
                <Tag color='red'>Hết hàng</Tag>
              )}
            </p>
            <p>
              <b>Đã bán:</b> {totalPurchases}
            </p>
            <p>
              <b>Đánh giá:</b> {product.totalReviews} lượt
            </p>
            <p>
              <b>Danh mục:</b> {product.category?.name}
            </p>
            {favorites.includes(product._id) ? (
              <HeartFilled
                style={{ color: 'red', fontSize: 24, cursor: 'pointer' }}
                onClick={() => toggleFavorite(product._id)}
              />
            ) : (
              <HeartOutlined
                style={{ fontSize: 24, cursor: 'pointer' }}
                onClick={() => toggleFavorite(product._id)}
              />
            )}
          </Col>
        </Row>

        <Card
          title='Thông số kỹ thuật'
          style={{ marginTop: 20, borderRadius: 8 }}
        >
          <Row gutter={16}>
            {Object.entries(product.specifications || {}).map(
              ([key, value]) => (
                <Col span={12} key={key} style={{ marginBottom: 8 }}>
                  <b>{key.toUpperCase()}:</b> {value}
                </Col>
              )
            )}
          </Row>
        </Card>

        <Card title='Bình luận' style={{ marginTop: 20 }}>
          <TextArea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            rows={3}
            placeholder='Viết bình luận...'
          />
          <Button
            type='primary'
            style={{ marginTop: 8 }}
            onClick={handleAddComment}
          >
            Gửi
          </Button>

          <List
            style={{ marginTop: 20 }}
            dataSource={comments}
            renderItem={(item) => {
              const hasLiked = item.likes.includes(user.id);
              const hasDisliked = item.dislikes.includes(user.id);

              return (
                <List.Item
                  actions={[
                    <span
                      key='like'
                      style={{
                        cursor: 'pointer',
                        marginRight: 8,
                        color: hasLiked ? '#1890ff' : undefined,
                      }}
                      onClick={() => handleToggleLike(item._id)}
                    >
                      {hasLiked ? <LikeFilled /> : <LikeOutlined />}{' '}
                      {item.likes.length}
                    </span>,
                    <span
                      key='dislike'
                      style={{
                        cursor: 'pointer',
                        marginRight: 8,
                        color: hasDisliked ? '#ff4d4f' : undefined,
                      }}
                      onClick={() => handleToggleDislike(item._id)}
                    >
                      {hasDisliked ? (
                        <DislikeFilled style={{ marginRight: 4 }} />
                      ) : (
                        <DislikeOutlined style={{ marginRight: 4 }} />
                      )}
                      {item.dislikes.length}
                    </span>,
                    ...(item.user?._id === user.id
                      ? [
                          <Button
                            key='delete'
                            type='text'
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() => handleDeleteComment(item._id)}
                          />,
                        ]
                      : []),
                  ]}
                >
                  <List.Item.Meta
                    title={item.user?.name || 'Người dùng'}
                    description={item.content}
                  />
                  <Text type='secondary'>
                    {new Date(item.createdAt).toLocaleString('vi-VN')}
                  </Text>
                </List.Item>
              );
            }}
          />
        </Card>

        <Title level={3} style={{ textAlign: 'center', marginTop: 20 }}>
          Sản phẩm cùng danh mục
        </Title>
        <Row gutter={[10, 10]} style={{ marginTop: 20, paddingInline: 20 }}>
          {productSimilar.map((p) => (
            <Col key={p._id} xs={24} sm={12} md={8} lg={6}>
              <Card
                hoverable
                onClick={() => navigate(`/product/${p._id}`)}
                cover={
                  p.images?.length > 0 ? (
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      style={{
                        height: 200,
                        objectFit: 'contain',
                        width: '100%',
                      }}
                      preview={true}
                    />
                  ) : (
                    <Tag color='red'>No Image</Tag>
                  )
                }
                actions={[
                  favorites.includes(p._id) ? (
                    <HeartFilled
                      key='heart'
                      style={{ color: 'red' }}
                      onClick={(e) => toggleFavorite(p._id, e)}
                    />
                  ) : (
                    <HeartOutlined
                      key='heart'
                      onClick={(e) => toggleFavorite(p._id, e)}
                    />
                  ),
                ]}
              >
                <Meta
                  title={p.name}
                  description={
                    <>
                      <p>💰 {p.price.toLocaleString()} đ</p>
                      <p>🏷 {p.brand}</p>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default ProductDetailPage;
