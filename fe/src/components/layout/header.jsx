import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { useContext, useState } from 'react';
import { Menu } from 'antd';
import {
  UsergroupAddOutlined,
  HomeOutlined,
  SettingOutlined,
  HeartOutlined,
  HistoryOutlined,
} from '@ant-design/icons';

const Header = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useContext(AuthContext);
  const [current, setCurrent] = useState('mail');
  console.log('>>> check auth: ', auth);
  const items = [
    {
      label: <Link to={'/'}>Home Page</Link>,
      key: 'home',
      icon: <HomeOutlined />,
    },
    ...(auth.isAuthenticated
      ? [
          {
            label: <Link to={'/user'}>Users</Link>,
            key: 'user',
            icon: <UsergroupAddOutlined />,
          },
          {
            label: <Link to={'/products'}>Products</Link>,
            key: 'product',
            icon: <UsergroupAddOutlined />,
          },
          {
            label: <Link to={'/favorites'}>Favorite Product</Link>,
            key: 'favorite-product',
            icon: <HeartOutlined />,
          },
          {
            label: <Link to={'/viewed'}>Viewed Product</Link>,
            key: 'viewed-product',
            icon: <HistoryOutlined />,
          },
        ]
      : []),

    {
      label: `Welcome ${auth?.user?.email ?? ''}`,
      key: 'SubMenu',
      icon: <SettingOutlined />,
      children: [
        ...(auth.isAuthenticated
          ? [
              {
                label: (
                  <span
                    onClick={() => {
                      localStorage.clear('access_token');
                      setCurrent('home');
                      setAuth({
                        isAuthenticated: false,
                        user: {
                          email: '',
                          name: '',
                        },
                      });
                      navigate('/');
                    }}
                  >
                    Đăng xuất
                  </span>
                ),
                key: 'logout',
              },
            ]
          : [
              {
                label: <Link to={'/login'}>Đăng nhập</Link>,
                key: 'login',
              },
            ]),
      ],
    },
  ];
  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode='horizontal'
      items={items}
    />
  );
};

export default Header;
