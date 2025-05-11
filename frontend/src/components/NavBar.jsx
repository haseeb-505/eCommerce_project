import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu as MenuIcon, X as XIcon, Search as SearchIcon } from 'lucide-react';
import { GiShoppingBag } from 'react-icons/gi';

const Navbar = ({ currentUser, handleLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchButtonClick = () => {
    console.log(`Search Value: ${searchValue}`);
    setSearchValue("");
  };

  return (
    <nav className="bg-gray-900 w-full px-4 py-2 shadow-md">
      <div className="container mx-auto flex ml-2 mr-3 justify-between items-center md:gap-4">
        <div className="logo flex font-bold text-2xl text-white">
          <span className="pt-1 mr-2"><GiShoppingBag /></span>
          e
          <span className="text-green-700">Commerce</span>
        </div>
        
        {/* Navigation Links */}
        <ul className="hidden md:flex md:gap-3 lg:gap-6 md:text-lg lg:text-xl font-medium text-white">
          <li><Link to="/" className="hover:text-blue-300 active:text-blue-600">Home</Link></li>
          <li><Link to="/add-product" className="hover:text-blue-300 active:text-blue-600">Add Product</Link></li>
          <li><Link to="/cart" className="hover:text-blue-300 active:text-blue-600">Cart(0)</Link></li>
          {/* {!currentUser && (
            <li><Link to="/register" className="hover:text-blue-300 active:text-blue-600">Register</Link></li>
          )} */}
        </ul>
        
        {/* Search Bar */}
        <div className="relative flex flex-col justify-between">
          <input 
            type="search" 
            placeholder="Search" 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="bg-gray-100 text-black pl-2 pr-10 py-2 rounded-md text-sm focus:outline-none" 
          />
          <button 
            onClick={handleSearchButtonClick} 
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-blue-500 text-white rounded-md p-2"
          >
            <SearchIcon className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex gap-4 items-center">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <XIcon className='bg-gray-500 h-9 w-9 text-white p-2'/> 
            ) : (
              <MenuIcon className='bg-gray-500 h-9 w-9 text-white p-2'/>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <ul className='md:hidden px-4 py-2 text-white bg-gray-700 space-y-2'>
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          {currentUser && (
            <li><Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link></li>
          )}
          <li><Link to="/add-product" onClick={() => setMenuOpen(false)}>Add Product</Link></li>
          <li><Link to="/cart" onClick={() => setMenuOpen(false)}>Cart(0)</Link></li>
          {/* {!currentUser ? (
            <li><Link to="/register" onClick={() => setMenuOpen(false)}>Register</Link></li>
          ) : (
            <li><button onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button></li>
          )} */}
        </ul>
      )} 
    </nav>
  );
};

export default Navbar;