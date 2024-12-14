import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from '../components/LoadingSpinner';
import FormWrapper from '../components/FormWrapper';
import { useLoginUserMutation } from '../slices/userManagementApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

/**
 * LoginPage Component
 * Renders a login form where users can enter their email and password to sign in.
 */
const LoginPage = () => {
  // Component state to store email and password input
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux Toolkit Query hook for login mutation
  const [login, { isLoading }] = useLoginUserMutation();

  // Extract the logged-in user information from the Redux store
  const { userInfo } = useSelector((state) => state.auth);

  // Extract query parameters from the URL
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirectUrl = searchParams.get('redirect') || '/';

  // Redirect the user if already logged in
  useEffect(() => {
    if (userInfo) {
      navigate(redirectUrl);
    }
  }, [navigate, redirectUrl, userInfo]);

  /**
   * Handle form submission
   * Logs in the user with the provided email and password.
   * @param {Object} event - The form submission event.
   */
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...response }));
      navigate(redirectUrl);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <FormWrapper>
      
      <h1>Sign In</h1>

      <Form onSubmit={handleLoginSubmit}>
        {/* Email Input */}
        <Form.Group className="my-2" controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        {/* Password Input */}
        <Form.Group className="my-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        {/* Submit Button */}
        <Button disabled={isLoading} type="submit" variant="primary">
          Sign In
        </Button>

        {/* Loading Spinner */}
        {isLoading && <LoadingSpinner />}
      </Form>

      {/* Redirect to Registration Link */}
      <Row className="py-3">
        <Col>
          New Customer?{' '}
          <Link to={redirectUrl ? `/registerUser?redirect=${redirectUrl}` : '/registerUser'}>
            Register
          </Link>
        </Col>
      </Row>
    </FormWrapper>
  );
};

export default LoginPage;
