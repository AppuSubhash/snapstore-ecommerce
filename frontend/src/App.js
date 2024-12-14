import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import HeaderComponent from './components/HeaderComponent';
import FooterSection from './components/FooterSection';
import { logoutUserAction } from './slices/authSlice';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AppLayout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Retrieve expiration time from localStorage
    const sessionExpiration = localStorage.getItem('sessionExpiration');
    
    // Check if expiration time is set
    if (sessionExpiration) {
      const currentTimestamp = new Date().getTime();

      // If the session has expired, log the user out
      if (currentTimestamp > sessionExpiration) {
        dispatch(logoutUserAction());
      }
    }
  }, [dispatch]);

  return (
    <>
      <ToastContainer />
      <HeaderComponent />
      <main className='py-3'>
        <Container>
          <Outlet />
        </Container>
      </main>
      <FooterSection />
    </>
  );
};

export default AppLayout;
