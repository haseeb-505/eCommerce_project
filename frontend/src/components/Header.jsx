import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const Header = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    
    // console.log("User and authentication values are: ", user);
    console.log("User values in header are: ", user);
    console.log("Authentication in header values are: ", isAuthenticated);
    
    return (
        <header className="bg-gray-900 text-white py-2 px-4">
            <div className="container mx-auto flex justify-between items-center">
                {/* Social Media Links */}
                <div className="flex space-x-4">
                    <a href="#" className="hover:text-blue-400 transition-colors">
                        <FaFacebook size={18} />
                    </a>
                    <a href="#" className="hover:text-blue-400 transition-colors">
                        <FaTwitter size={18} />
                    </a>
                    <a href="#" className="hover:text-blue-400 transition-colors">
                        <FaInstagram size={18} />
                    </a>
                    <a href="#" className="hover:text-blue-400 transition-colors">
                        <FaLinkedin size={18} />
                    </a>
                </div>
                
                {/* Auth Links */}
                <div className="flex space-x-4">
                    {isAuthenticated ? (
                        <div className='flex items-center justify-between gap-4'>
                        <div className='flex-shrink-0 relative'>
                          <img 
                            src={user?.avatar || '/default-avatar.png'} 
                            alt="Profile"
                            className="w-10 h-10 rounded-full border border-white cursor-pointer object-cover"
                            onClick={() => setShowFullAvatar(true)}
                          />
                        </div>
                        <div className='flex items-center gap-4 h-full'>
                          <Link 
                            to="/profile" 
                            className="text-sm font-medium hover:text-blue-400 transition-colors leading-10"
                          >
                            {user?.username || 'My Profile'}
                          </Link>
                          <Link 
                            to="/logout" 
                            className="text-sm font-medium hover:text-red-400 transition-colors leading-10"
                          >
                            Logout
                          </Link>
                        </div>
                      </div>
                    ) : (
                        <>
                            <Link to="/register" className="text-sm hover:text-blue-400 transition-colors">
                                Register
                            </Link>
                            <Link to="/login" className="text-sm hover:text-green-400 transition-colors">
                                Login
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;