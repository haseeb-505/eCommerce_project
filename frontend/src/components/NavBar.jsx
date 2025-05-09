import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon, SearchIcon, XIcon } from '@heroicons/react/solid';
import {GiShoppingBag} from 'react-icons/gi'

const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchValue, setSearchValue] = useState("");

    const handleSearchButtonClick = () => {
        setSearchOpen(!searchOpen); // Toggle on mobile
        console.log(`Search Value: ${searchValue}`);
        setSearchValue("");
    };

  return (
    <nav className="bg-gray-900 fixed top-0 z-10 w-full px-4 py-2 shadow-md">
        <div className="container flex ml-2 mr-3 justify-between items-center  md:gap-4">
        <div className="logo flex font-bold text-2xl">
            <span className="text-white pt-1 mr-2"><GiShoppingBag /></span>
            e
            <span className="text-green-700">Commerce</span>
        </div>
            {/* Naviation Links */}
            <ul className="hidden md:flex md:gap-3 lg:gap-6 md:text-lg lg:text-xl font-medium">
                <li><Link to="/" className="hover:text-blue-300 active:text-blue-600">Home</Link></li>
                <li><Link to="/profile" className="hover:text-blue-300 active:text-blue-600">Profile</Link></li>
                <li><Link to="/add-product" className="hover:text-blue-300 active:text-blue-600">Add Product</Link></li>
                {/* <li><Link to="/category" className="hover:text-blue-300 active:text-blue-600">Category</Link></li> */}
                <li><Link to="/register" className="hover:text-blue-300 active:text-blue-600">Register</Link></li>
                <li><Link to="/cart" className="hover:text-blue-300 active:text-blue-600">Cart(0)</Link></li>
            </ul>
            {/* search button desktop */}
            <div className="relative flex flex-col justify-between">
                <input type="search" placeholder="Search" 
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="bg-gray-100 text-black pl-2 pr-3 py-2 rounded-md text-sm focus:outline-none" />
                <button onClick={handleSearchButtonClick} className="absolute right-0 top-1/2 -translate-y-1/2 bg-blue-500 text-white rounded-md p-2">
                    <SearchIcon className="h-5 w-5 text-white" />
                </button>
            </div>

            {/* Mobile Icons , serch and menu */}
            <div className="md:hidden flex gap-4 items-canter">
                {/* Menu Toggle */}
                <button onClick={() => setMenuOpen(!menuOpen)}>
                    { menuOpen ? (<XIcon className='bg-gray-500 h-9 w-9 text-white'/>) : ( <MenuIcon className='bg-gray-500 h-9 w-9 text-white'/>)}
                </button>
            </div>
        </div>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <ul className='md:hidden px-4 py-2 text-white bg-gray-700 space-y-2'>
                    <li><Link to="/" onClick={() => setMenuOpen(false)} >Home</Link></li>
                    <li><Link to="/profile" onClick={() => setMenuOpen(false)} >Profile</Link></li>
                    <li><Link to="/add-product" onClick={() => setMenuOpen(false)} >Add Product</Link></li>
                    <li><Link to="/category" onClick={() => setMenuOpen(false)} >Category</Link></li>
                    <li><Link to="/register" onClick={() => setMenuOpen(false)} >Register</Link></li>
                    <li><Link to="/cart" onClick={() => setMenuOpen(false)} >Cart(0)</Link></li>
                </ul>
            )} 
    </nav>
  )
}

export default NavBar;
