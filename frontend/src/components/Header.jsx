import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useSendLogoutMutation } from '../redux/authentication/authApiSlice';
import { logOut } from '../redux/authentication/authSlice.js'

const Header = () => {
  const { user, isAuthenticated, isRefreshing } = useSelector((state) => state.auth);
  const [sendLogout, { isLoading }] = useSendLogoutMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // console.log("User and authentication values are: ", user);
  // console.log("User values in header are: ", user);
  // console.log("Authentication in header values are: ", isAuthenticated);

  const handleLogout = async() => {
    try {
      await sendLogout().unwrap();
      
      dispatch(logOut());

      navigate("/")
    } catch (error) {
      console.error('Logout failed: ', error);
    }
  };

  // if (isRefreshing) {
  //   return (
  //     <header className="bg-gray-900 text-white py-4 px-4">
  //       <div className="text-center text-xl">Loading...</div>
  //     </header>
  //   );
  // }
    
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
                        <div className='flex-shrink-0'>
                          <div className='flex items-center relative  hover:text-green-400 transition-colors leading-10 border-2 p-1 rounded-xl gap-2'>
                            {/* image links */}
                            <img 
                              src={user?.avatar || '/default-avatar.png'} 
                              alt="Profile"
                              className="w-10 h-10 rounded-full cursor-pointer object-cover"
                              onClick={() => setShowFullAvatar(true)}
                            />
                            {/* Profile Link */}
                            <Link
                              to="/profile" 
                              className="text-sm font-medium hover:text-blue-400 transition-colors leading-10"
                            >
                              {user?.username || 'My Profile'}
                            </Link>
                          </div>
                          
                          
                        </div>
                        <div className='flex items-center gap-4 h-full'>
                          <button
                            onClick={handleLogout}
                            className="text-sm font-medium hover:text-red-400 transition-colors leading-10 cursor-pointer border-2 p-1 rounded-xl"
                          >
                            Logout
                          </button>
                        </div>
                    </div>
                  ) : (
                      <>
                          <Link to="/register" className="text-sm hover:text-blue-400 transition-colors border-2 p-1 rounded-xl">
                              Register
                          </Link>
                          {/* <span className="text-center">|</span> */}
                          <Link to="/login" className="text-sm hover:text-green-400 transition-colors border-2 p-1 rounded-xl">
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