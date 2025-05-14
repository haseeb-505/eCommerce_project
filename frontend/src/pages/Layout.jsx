import { Outlet, useNavigate } from 'react-router-dom';
import NavigationWrapper from './NavigationWrapper';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserInfo, setUserInfo } from '../redux/authentication/authSlice';
import { useEffect } from 'react';

const Layout = () => {
  document.body.style.overscrollBehavior = 'none';
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  

  
  

  return (
    <div className='bg-slate-700 text-white min-h-screen flex flex-col'>
      <NavigationWrapper />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}

export default Layout;