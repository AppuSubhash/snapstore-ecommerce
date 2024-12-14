import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * CheckoutProgress component renders the navigation bar for checkout progress.
 * It displays the steps and highlights each one based on whether the step is completed.
 * 
 * @param {boolean} isStep1Completed - Indicates if step 1 (Sign In) is completed.
 * @param {boolean} isStep2Completed - Indicates if step 2 (Shipping) is completed.
 * @param {boolean} isStep3Completed - Indicates if step 3 (Payment) is completed.
 * @param {boolean} isStep4Completed - Indicates if step 4 (Place Order) is completed.
 */
const CheckoutProgress = ({ isStep1Completed, isStep2Completed, isStep3Completed, isStep4Completed }) => {
  return (
    <Nav className='justify-content-center mb-4'>
      {/* Step 1: Sign In */}
      <Nav.Item>
        {isStep1Completed ? (
          <Nav.Link as={Link} to='/login'>
            Sign In
          </Nav.Link>
        ) : (
          <Nav.Link disabled>Sign In</Nav.Link>
        )}
      </Nav.Item>

      {/* Step 2: Shipping */}
      <Nav.Item>
        {isStep2Completed ? (
          <Nav.Link as={Link} to='/shipping'>
            Shipping
          </Nav.Link>
        ) : (
          <Nav.Link disabled>Shipping</Nav.Link>
        )}
      </Nav.Item>

      {/* Step 3: Payment */}
      <Nav.Item>
        {isStep3Completed ? (
          <Nav.Link as={Link} to='/paymentSection'>
            Payment
          </Nav.Link>
        ) : (
          <Nav.Link disabled>Payment</Nav.Link>
        )}
      </Nav.Item>

      {/* Step 4: Place Order */}
      <Nav.Item>
        {isStep4Completed ? (
          <Nav.Link as={Link} to='/placeorderscreen'>
            Place Order
          </Nav.Link>
        ) : (
          <Nav.Link disabled>Place Order</Nav.Link>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default CheckoutProgress;
