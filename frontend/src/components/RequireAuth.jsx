import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const RequireAuth = () => {
  const { isAuthenticated, isInitialCheckComplete } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isInitialCheckComplete) {
    // PersistLogin handles the loading state
    return null;
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;