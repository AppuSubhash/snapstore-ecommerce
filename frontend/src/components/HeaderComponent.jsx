import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useLogoutUserMutation } from '../slices/userManagementApiSlice';
import { logoutUserAction } from '../slices/authSlice';
import ProductSearchBox from './ProductSearchBox';
import logo from '../assets/logo.jpg';
import { clearCart } from '../slices/cartSlice';

/**
 * HeaderComponent displays the navigation bar for the SnapStore application.
 * It includes cart details, user profile options, and conditional rendering
 * for authenticated users and admin roles.
 */
const HeaderComponent = () => {
  // Select cart items and user info from the Redux store
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutMutation] = useLogoutUserMutation();

  /**
   * Handles user logout by calling the logout API, clearing user state,
   * resetting the cart, and redirecting to the login page.
   */
  const handleLogout = async () => {
    try {
      // Perform the logout action via API call
      await logoutMutation().unwrap();
      dispatch(logoutUserAction());
      // Reset cart to prevent carrying over items from previous sessions
      dispatch(clearCart());
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <header>
      <Navbar className='navbar-style' bg='primary' variant='dark' expand='lg' collapseOnSelect>
        <Container>
          {/* Navbar brand with the logo */}
          <Navbar.Brand as={Link} to='/'>
            <img src={logo} alt='SnapStore' className='logo-img'/>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ms-auto'>
              {/* Search Box */}
              <ProductSearchBox />

              {/* Cart Navigation */}
              <Nav.Link as={Link} to='/cart'>
                <FaShoppingCart /> Cart
                {cartItems.length > 0 && (
                  <Badge pill bg='success' style={{ marginLeft: '5px' }}>
                    {cartItems.reduce((totalQuantity, item) => totalQuantity + item.qty, 0)}
                  </Badge>
                )}
              </Nav.Link>

              {/* User Navigation */}
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='userDropdown'>
                  <NavDropdown.Item as={Link} to='/profile'>
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <Nav.Link as={Link} to='/login'>
                  <FaUser /> Sign In
                </Nav.Link>
              )}

              {/* Admin Navigation */}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title='Admin' id='adminDropdown'>
                  <NavDropdown.Item as={Link} to='/admin/productlist'>
                    Products
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/admin/orderlist'>
                    Orders
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to='/admin/userlist'>
                    Users
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default HeaderComponent;
