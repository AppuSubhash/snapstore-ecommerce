import { Navigate as RedirectTo, Outlet as RouteOutlet } from 'react-router-dom';
import { useSelector as selectState } from 'react-redux';

const AdminAccessRoute = () => {
    const { userAccountDetails } = selectState((applicationState) => applicationState.auth);

    return userAccountDetails && userAccountDetails.isAdmin ? (
        <RouteOutlet />
    ) : (
        <RedirectTo to='/login' replace />
    );
};

export default AdminAccessRoute;

