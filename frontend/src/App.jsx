import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
// pages import
import Layout from './pages/Layout.jsx'
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import AddProduct from './pages/AddProduct.jsx';
// components import
import Home from './components/Home.jsx';
import Category from './components/Category';
import Cart from './components/Cart.jsx';
import Profile from './components/Profile.jsx';
import PersistLogin from './components/PersistLogin'; // Import the PersistLogin component
import RequireAuth from './components/RequireAuth'; // We'll create this
import { useSelector } from 'react-redux';
import LoadingScreen from './components/LoadingScreen';

function App() {

  return (
    <div className='bg-slate-900 text-white'>
      <Routes>
        <Route element={<Layout />}>
          {/* Public routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route element={<PersistLogin />}>
            {/* Public routes that persist login */}
            <Route path='/' element={<Home />} />
            
            {/* Authenticated-only routes */}
            <Route element={<RequireAuth />}>
              <Route path='/add-product' element={<AddProduct />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />
            </Route>
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;