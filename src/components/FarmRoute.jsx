import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function FarmRoute({ children }) {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  // Allow farm accounts, users with a brand tag, or admins inspecting
  const isFarmOrAdmin =
    userInfo.role === 'farm' ||
    userInfo.brand ||
    userInfo.isAdmin ||
    userInfo.role === 'admin';

  if (!isFarmOrAdmin) {
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
}

export default FarmRoute;
