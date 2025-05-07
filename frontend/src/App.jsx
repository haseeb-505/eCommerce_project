import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout.jsx'
import Home from './components/Home';
import Register from './components/Register';
import Category from './components/Category';
import Login from './components/Login';
import Cart from './components/Cart';
import PrivateRoute from './components/PrivateRoute.jsx';
import AddProduct from './components/AddProduct.jsx';

function App() {

  return (
    <div className='bg-slate-900 text-white'>

          <Routes>
            <Route element={<Layout />}>
              <Route path='/' element={<Home />} />
              <Route path='/add-product' element={<AddProduct />} />
              <Route path="/category" element={<Category />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
            </Route>
          </Routes>
    </div>
  )
}

export default App
