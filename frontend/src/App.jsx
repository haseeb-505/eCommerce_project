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

function App() {
  // We can remove the isLoading check from here since PersistLogin will handle it
  return (
    <div className='bg-slate-900 text-white'>
      <Routes>
        <Route element={<Layout />}>
          {/* Public routes */}
          <Route path='/' element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes - Wrapped with PersistLogin */}
          <Route element={<PersistLogin />}>
            {/* These routes require authentication */}
            <Route element={<RequireAuth />}>
              <Route path='/add-product' element={<AddProduct />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />
              {/* Add other protected routes here */}
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;