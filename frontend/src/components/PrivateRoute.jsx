// components/PrivateRoute.jsx
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isRefreshing, isInitialCheckComplete } = useSelector((state) => state.auth);
  const location = useLocation();

  // if (isRefreshing) {
  //   return (
  //     <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
  //       <p className="text-xl">Loading...</p>
  //     </div>
  //   );
  // }

  if (!isInitialCheckComplete) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;
