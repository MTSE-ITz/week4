import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RegisterPage from './pages/register.jsx';
import UserPage from './pages/user.jsx';
import HomePage from './pages/home.jsx';
import LoginPage from './pages/login.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';
import ProductPage from './pages/product.jsx';
import ProductDetailPage from './pages/productDetail.jsx';
import FavoriteProduct from './pages/favoriteProduct.jsx';
import ViewedProductPage from './pages/viewedProduct.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'user',
        element: <UserPage />,
      },
      {
        path: 'products',
        element: <ProductPage />,
      },
      {
        path: 'product/:id',
        element: <ProductDetailPage />,
      },
      {
        path: 'favorites',
        element: <FavoriteProduct />,
      },
      {
        path: 'viewed',
        element: <ViewedProductPage />,
      },
    ],
  },
  {
    path: 'register',
    element: <RegisterPage />,
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>
);
