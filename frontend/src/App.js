import React, { useEffect, useState } from 'react'
import './App.css';
import "react-router"
import axios from "axios"
import Products from "./components/products/Products"
import Home from './components/home/Home.js';
import Search from './components/products/Search.js';
import ProductDetail from "./components/productDetail/ProductDetail.js"
import Footer from './components/layout/footer/Footer.js';
import Header from './components/layout/header/Header.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginSignup from './components/user/LoginSignup';
import { getuserDetail, loadUser } from './redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import UserOptions from './components/layout/header/UserOptions.js';
import Profile from './components/user/Profile.js';
import UpdateProfile from './components/user/UpdateProfile.js';
import UpdatePassword from './components/user/UpdatePassword.js';
import ProtectedRoute from './components/Route/ProtectedRoute';
import ForgotPassword from './components/user/ForgotPassword';
import ResetPassword from './components/user/ResetPassword.js';
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping.js';
import ConfirmOrder from './components/cart/ConfirmOrder.js';
import Payment from './components/cart/Payment.js';
import OrderSuccess from './components/cart/OrderSuccess.js';
// to use card number elements
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import MyOrders from './components/order/MyOrders';
import OrderDetails from './components/order/OrderDetails.js';
import Dashboard from './components/admin/Dashboard.js';
import ProductList from './components/admin/ProductList.js';
import NewProduct from './components/admin/NewProduct.js';
import UpdateProduct from './components/admin/UpdateProduct.js';
import OrderList from './components/admin/OrderList.js';
import ProcessOrder from './components/admin/ProcessOrder.js';
import UsersList from './components/admin/UsersList.js';
import UpdateUser from './components/admin/UpdateUser.js';
import ProductReview from './components/admin/ProductReviews.js';
import About from './components/layout/About.js';
import Contact from './components/layout/Contact.js';
import NotFound from './components/layout/NotFound.js';

function App() {

  
  // fetching user details at the entry of the website
  const user = useSelector(getuserDetail)
  const dispatch = useDispatch()
  const isAuthenticated = user.isAuthenticated
  // for getting stripe api key
  const [stripeApiKey, setStripeApiKey] = useState("pk_test_51KZ78NSJ298es8eSsPdAXQanFZ8xQWCFwkhwAVF8i…wRSi66PMCZvBy4MhpoRn3QsBJQHESwpSs84eFiy00yHyhU6Bc");
  // pk_test_51KZ78NSJ298es8eSsPdAXQanFZ8xQWCFwkhwAVF8i…wRSi66PMCZvBy4MhpoRn3QsBJQHESwpSs84eFiy00yHyhU6Bc
  async function getStripeApiKey() {
    const { data } = await axios.get("/api/v1/stripeapikey");
    // set as variable
    // set Func not working 
    setStripeApiKey(data.stripeApiKey);
    console.log(stripeApiKey)
  }


  useEffect(() => {
    dispatch(loadUser())
    getStripeApiKey()
    // not loading
    
  }, [dispatch, loadUser])

  // to restrict using right click button on website
  // so that nobody can inspect
  window.addEventListener("contextmenu",(e)=>e.preventDefault())

  return (
    <Router>
      <Header />
      {/* user options is only for logged in users */}
      {isAuthenticated && <UserOptions userDetail={user} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/products" element={<Products />} />
        {/* through search results*/}
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route path="/" element={<ProtectedRoute />} >
          {/* routing components through protected route component */}
          <Route path="/account" element={<Profile />} />
          <Route path="/me/update" element={<UpdateProfile />} />
          <Route path="/update/password" element={<UpdatePassword />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/order/confirm" element={<ConfirmOrder />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/order/:id" element={<OrderDetails />} />

          <Route
            path="/process/payment"
            element={stripeApiKey &&
              (
                <Elements stripe={loadStripe(stripeApiKey)}>
                  <Payment />
                </Elements>
              )
            }
          />
        </Route>
        <Route path="/forgot/password" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/admin" element={<ProtectedRoute />} >

          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<ProductList />} />
          <Route path="/admin/product/new" element={<NewProduct />} />
          <Route path="/admin/product/:id" element={<UpdateProduct />} />
          <Route path="/admin/orders" element={<OrderList />} />
          <Route path="/admin/order/:id" element={<ProcessOrder />} />
          <Route path="/admin/users" element={<UsersList />} />
          <Route path="/admin/user/:id" element={<UpdateUser />} />
          <Route path="/admin/reviews" element={<ProductReview />} />
        </Route>
        <Route path="/*" element={<NotFound />} />
      </Routes>


      <Footer />
    </Router>


  );
}

export default App;
