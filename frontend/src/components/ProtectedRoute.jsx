import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

/**
 * ProtectedRoute component is a route guard that ensures only authenticated users can access the protected routes.
 * If the user is not authenticated, they are redirected to the login page.
 */
const ProtectedRoute = () => {
  // Select user information from the Redux store
  const { userInfoDetails } = useSelector((stateDetails) => stateDetails.auth);

  // If the user is authenticated, render the child routes; otherwise, redirect to login
  return userInfoDetails ? <Outlet /> : <Navigate to='/login' replace />;
};

export default ProtectedRoute;
