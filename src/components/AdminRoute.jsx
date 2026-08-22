import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AdminRoute({ children }) {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo || (!userInfo.isAdmin && userInfo.role !== 'admin')) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}

export default AdminRoute;
