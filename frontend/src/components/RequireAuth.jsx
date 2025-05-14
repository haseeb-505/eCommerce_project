import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectCurrentToken } from '../redux/authentication/authSlice';

const RequireAuth = () => {
  const token = useSelector(selectCurrentToken);
  
  return token
    ? <Outlet />
    : <Navigate to="/login" replace />;
};

export default RequireAuth;