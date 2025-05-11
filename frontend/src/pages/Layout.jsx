import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationWrapper from './NavigationWrapper'
import Footer from '../components/Footer';

const Layout = () => {
  document.body.style.overscrollBehavior = 'none';
  return (
    <div className='bg-slate-700 text-white min-h-screen flex flex-col'>
      <NavigationWrapper />
      
      <main className="flex-grow">
        <Outlet />  {/* This renders the current route's component */}
      </main>
      
      <Footer />
    </div>
  )
}

export default Layout
