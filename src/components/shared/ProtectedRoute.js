import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  if (role && role !== user.role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/employee'} />;
  }

  return children;
};

export default ProtectedRoute;