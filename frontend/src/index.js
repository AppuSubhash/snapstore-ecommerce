import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './monitorPerformance';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ProtectedRoute from './components/ProtectedRoute';
import AdminAccessRoute from './components/AdminAccessRoute';
import HomePage from './screens/HomePage';
import ProductDetailScreen from './screens/ProductDetailScreen';
import ShoppingCartPage from './screens/ShoppingCartPage';
import LoginPage from './screens/LoginPage';
import UserRegistrationScreen from './screens/UserRegistrationScreen';
import AddressFormScreen from './screens/AddressFormScreen';
import PaymentSelectionScreen from './screens/PaymentSelectionScreen';
import OrderReviewScreen from './screens/OrderReviewScreen';
import OrderPage from './screens/OrderPage';
import UserProfileScreen from './screens/UserProfileScreen';
import AdminOrderListScreen from './screens/admin/AdminOrderListScreen';
import AdminProductManager from './screens/admin/AdminProductManager';
import EditProductScreen from './screens/admin/EditProductScreen';
import UserManagementPage from './screens/admin/UserManagementPage';
import AdminUserUpdateScreen from './screens/admin/AdminUserUpdateScreen';
import store from './appStore';
import { Provider } from 'react-redux';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomePage />} />
      <Route path='/search/:keyword' element={<HomePage />} />
      <Route path='/page/:pageNumber' element={<HomePage />} />
      <Route
        path='/search/:keyword/page/:pageNumber'
        element={<HomePage />}
      />
      <Route path='/product/:id' element={<ProductDetailScreen />} />
      <Route path='/cart' element={<ShoppingCartPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<UserRegistrationScreen />} />
      {/* Registered users */}
      <Route path='' element={<ProtectedRoute />}>
        <Route path='/shipping' element={<AddressFormScreen />} />
        <Route path='/payment' element={<PaymentSelectionScreen />} />
        <Route path='/placeorder' element={<OrderReviewScreen />} />
        <Route path='/order/:id' element={<OrderPage />} />
        <Route path='/profile' element={<UserProfileScreen />} />
      </Route>
      {/* Admin users */}
      <Route path='' element={<AdminAccessRoute />}>
        <Route path='/admin/orderlist' element={<AdminOrderListScreen />} />
        <Route path='/admin/productlist' element={<AdminProductManager />} />
        <Route
          path='/admin/productlist/:pageNumber'
          element={<AdminProductManager />}
        />
        <Route path='/admin/userlist' element={<UserManagementPage />} />
        <Route path='/admin/product/:id/edit' element={<EditProductScreen />} />
        <Route path='/admin/profile/:id/edit' element={<AdminUserUpdateScreen />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true}>
          <RouterProvider router={router} />
        </PayPalScriptProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();
