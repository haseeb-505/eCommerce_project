import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useRefreshMutation, useCheckLoginStatusMutation } from '../redux/authentication/authApiSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo, setAuthCheckComplete, resetAuthState } from '../redux/authentication/authSlice';
import LoadingScreen from './LoadingScreen.jsx';

const PersistLogin = () => {
  const [refresh] = useRefreshMutation();
  const [checkLoginStatus] = useCheckLoginStatusMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isInitialCheckComplete, isAuthenticated } = useSelector((state) => state.auth);
  const [isVerifying, setIsVerifying] = useState(true); 
  const isMountedRef = useRef(true);

  useEffect(() => {
    const verifyAuthStatus = async () => {
      setIsVerifying(true);
      try {
        console.log('Checking login status');
        const response  = await checkLoginStatus().unwrap();
        console.log('Check-login-status response:', JSON.stringify(response, null, 2));

        if (!response.isLoggedIn) {
          console.log('User is not logged in, skipping refresh');
          if (isMountedRef.current) {
            dispatch(resetAuthState());
            dispatch(setAuthCheckComplete());
            if (location.pathname !== '/' && location.pathname !== '/login') {
              console.log('Not authenticated, redirecting to login from:', location.pathname);
              navigate('/login', { replace: true });
            }
          }
          return;
        }

        console.log('User is logged in, attempting refresh token');
        try {
          const refreshData = await refresh().unwrap();
          // console.log('Refresh response:', JSON.stringify(refreshData, null, 2));
          // console.log("Val is: ", isMounted)
          // console.log("Val is: ", refreshData.user)
          // console.log("Val is: ", refreshData.accessToken)
          // console.log("Val is: ", refreshData.isAuthenticated)
          // console.log("Collective val ius: ", isMounted && refreshData?.user && refreshData?.accessToken && refreshData?.isAuthenticated)
          if (isMountedRef.current && refreshData?.user && refreshData?.accessToken && refreshData?.isAuthenticated) {
            console.log('Refresh successful, setting user info');
            dispatch(setUserInfo(refreshData));
            dispatch(setAuthCheckComplete());
          } else {
            console.log('No valid user or accessToken in refresh response');
            if (isMountedRef.current) {
              console.log("we are in no valid user and isMounted case")
              dispatch(setAuthCheckComplete());
              // Only redirect if on protected route
              if (location.pathname !== '/' && location.pathname !== '/login') {
                console.log('Not authenticated, redirecting to login from:', location.pathname);
                navigate('/login', { replace: true });
              }
            }
          }
        } catch (refreshErr) {
          console.log('Refresh token error:', JSON.stringify(refreshErr, null, 2));
          if (isMountedRef.current) {
            dispatch(setAuthCheckComplete());
            // Redirect only for specific errors (e.g., 401)
            if (
              refreshErr?.data?.status === 'UNAUTHORIZED' ||
              refreshErr?.data?.message?.includes('Invalid refresh token') ||
              refreshErr?.data?.message?.includes('User is not logged in')
            ) {
              dispatch(resetAuthState());
              if (location.pathname !== '/' && location.pathname !== '/login') {
                console.log('Not authenticated, redirecting to login from:', location.pathname);
                navigate('/login', { replace: true });
              }
            }
          }
        }
      } catch (statusErr) {
        console.log('Check-login-status error:', JSON.stringify(statusErr, null, 2));
        if (isMountedRef.current) {
          dispatch(setAuthCheckComplete());
          dispatch(resetAuthState());
          if (location.pathname !== '/' && location.pathname !== '/login') {
            console.log('Not authenticated, redirecting to login from:', location.pathname);
            navigate('/login', { replace: true });
          }
        }
      } finally {
        if (isMountedRef.current) {
          setIsVerifying(false);
        }
      }
    };

    if (!isInitialCheckComplete && !isAuthenticated) {
      console.log('Triggering auth verification');
      verifyAuthStatus();
    } else if (!isAuthenticated && isInitialCheckComplete && location.pathname !== '/' && location.pathname !== '/login') {
      console.log('Not authenticated, redirecting to login from:', location.pathname);
      navigate('/login', { replace: true });
    }

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  if (isVerifying || !isInitialCheckComplete) {
    return <LoadingScreen />;
  }

  return <Outlet />;
};

export default PersistLogin;