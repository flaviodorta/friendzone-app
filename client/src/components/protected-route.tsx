// import { useAuthContext } from '@/context/auth.context';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // const { isAuthenticated } = useAuthContext();

  // if (!isAuthenticated) return <Navigate to='/login' />;

  return localStorage.getItem('access_token') ? (
    <Outlet />
  ) : (
    <Navigate to='/login' />
  );
};

export default ProtectedRoute;
