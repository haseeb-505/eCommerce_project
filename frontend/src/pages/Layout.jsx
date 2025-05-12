import { Outlet, useNavigate } from 'react-router-dom';
import NavigationWrapper from './NavigationWrapper';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserInfo, setUserInfo } from '../redux/Authentication/authSlice';
import { useGetCurrentUserQuery } from "../redux/authentication/authApi.js";
import { useEffect } from 'react';

const Layout = () => {
  document.body.style.overscrollBehavior = 'none';
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: responseData, isLoading } = useGetCurrentUserQuery();

  useEffect(() => {
    if (responseData?.data) {
      dispatch(setUserInfo(responseData.data));
    }
  }, [responseData, dispatch]);

  console.log("Data in layout is: ", responseData?.data);


  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Checking authentication...
      </div>
    );
  }

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