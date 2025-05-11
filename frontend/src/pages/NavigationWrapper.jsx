import React from 'react';
import Navbar from "../components/NavBar";
import Header from "../components/Header";



const NavigationWrapper = () => {
  return (
    <div className="fixed top-0 w-full z-10">
    <Header />
    <Navbar />
  </div>
  )
}

export default NavigationWrapper
