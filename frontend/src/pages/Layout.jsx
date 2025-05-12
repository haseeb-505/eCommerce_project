import { Outlet, useNavigate } from 'react-router-dom';
import NavigationWrapper from './NavigationWrapper';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { clearUserInfo, setUserInfo } from '../redux/authentication/authSlice';
import { useGetCurrentUserQuery } from "../redux/authentication/authApi.js";
import { useEffect } from 'react';

const Layout = () => {
  document.body.style.overscrollBehavior = 'none';
  const dispatch = useDispatch();
  const { data, error, isLoading, isFetching } = useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 300000 // 5 minute revalidation
  });

  // Sync state with query results
  useEffect(() => {
    if (data?.user) {
      dispatch(setUserInfo({
        user: data.user,
        isAuthenticated: true
      }));
    }
  }, [data, dispatch]);

  // Immediate error handling
  useEffect(() => {
    if (error) {
      dispatch(clearUserInfo());
    }
  }, [error, dispatch]);

  console.log("Data in layout is: ", data);


  // Show loading state while checking auth
  if (isLoading || isFetching) {
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