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
import { useSelector } from 'react-redux';


function App() {

  const { isAuthenticated, isLoading }= useSelector((state => state.auth))
  // console.log("is authenticated has following info: ", isAuthenticated)

  if (isLoading) {
    return (
      <div className="bg-slate-900 text-white min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading authentication status...</div>
      </div>
    );
  }

  return (
    <div className='bg-slate-900 text-white'>

      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/add-product' element={ isAuthenticated ? <AddProduct /> : <Navigate to="/login" /> } />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={ !isAuthenticated ? <Login /> : <Navigate to="/profile" /> } />
          <Route path="/profile" element={ isAuthenticated ? <Profile /> : <Navigate to="/login" /> } />
          <Route path="/cart" element={ isAuthenticated ? <Cart /> : <Navigate to="/login" /> } />
        </Route>
      </Routes>
    </div>
  )
}

export default App
