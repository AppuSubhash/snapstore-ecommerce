import { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormWrapper from '../components/FormWrapper';
import CheckoutProgress from '../components/CheckoutProgress';
import { savePaymentMethod } from '../slices/cartSlice';

/**
 * PaymentSelectionScreen Component
 * This screen allows the user to select a payment method.
 * Redirects to the shipping page if the shipping address is missing.
 */
const PaymentSelectionScreen = () => {
  // Retrieve the cart and shipping address from Redux store
  const cartState = useSelector((state) => state.cart);
  const { shippingAddress } = cartState;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State to track the selected payment method
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('PayPal');

  /**
   * Effect hook to ensure the user has a shipping address.
   * Redirects to the shipping screen if no address is provided.
   */
  useEffect(() => {
    if (!shippingAddress.address) {
      // If shipping address is missing, navigate to the shipping page
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  /**
   * Handles form submission to save the selected payment method
   * and redirects to the place order page.
   * 
   * @param {Event} event - The form submission event
   */
  const handlePaymentSelectionSubmit = (event) => {
    event.preventDefault();
    dispatch(savePaymentMethod(selectedPaymentMethod)); // Save the payment method to the store
    navigate('/placeorderscreen'); // Navigate to the place order page
  };

  return (
    <FormWrapper>
      {/* Checkout progress component to indicate the current step */}
      <CheckoutProgress step1 step2 step3 />

      {/* Payment method selection form */}
      <h1>Select Payment Method</h1>
      <Form onSubmit={handlePaymentSelectionSubmit}>
        <Form.Group>
          <Form.Label as="legend">Choose a Payment Method</Form.Label>
          <Col>
            {/* PayPal or Credit Card option */}
            <Form.Check
              className="my-2"
              type="radio"
              label="PayPal or Credit Card"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              checked
              onChange={(event) => setSelectedPaymentMethod(event.target.value)}
            />
          </Col>
        </Form.Group>

        {/* Submit button to continue */}
        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormWrapper>
  );
};

export default PaymentSelectionScreen;
