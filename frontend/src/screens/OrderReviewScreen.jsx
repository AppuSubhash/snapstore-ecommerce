import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import AlertMessage from '../components/AlertMessage';
import CheckoutProgress from '../components/CheckoutProgress';
import LoadingSpinner from '../components/LoadingSpinner';
import { useInitiateNewOrderMutation } from '../slices/orderApiSlice';
import { clearCartItems } from '../slices/cartSlice';

/**
 * OrderReviewScreen Component
 * This screen displays the order summary and allows the user to confirm and place the order.
 * It ensures the user has provided shipping and payment information before proceeding.
 */
const OrderReviewScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Access the cart details from Redux state
  const cartDetails = useSelector((state) => state.cart);

  // Mutation hook for creating an order
  const [createOrderMutation, { isLoading, error }] = useInitiateNewOrderMutation();

  // Effect hook that ensures the user has a valid shipping address and payment method
  useEffect(() => {
    if (!cartDetails.shippingAddress.address) {
      navigate('/shipping'); // Redirect to shipping if no address is found
    } else if (!cartDetails.paymentMethod) {
      navigate('/paymentSection'); // Redirect to payment if no payment method is found
    }
  }, [cartDetails.paymentMethod, cartDetails.shippingAddress.address, navigate]);

  /**
   * Handles the order placement by calling the createOrder mutation.
   * After successful order creation, it clears the cart and navigates to the order details page.
   */
  const handlePlaceOrder = async () => {
    try {
      // Creating the order with cart details
      const orderResponse = await createOrderMutation({
        orderItems: cartDetails.cartItems,
        shippingAddress: cartDetails.shippingAddress,
        paymentMethod: cartDetails.paymentMethod,
        itemsPrice: cartDetails.itemsPrice,
        shippingPrice: cartDetails.shippingPrice,
        taxPrice: cartDetails.taxPrice,
        totalPrice: cartDetails.totalPrice,
      }).unwrap();

      // Clear cart items after successful order placement
      dispatch(clearCartItems());

      // Navigate to the order details page
      navigate(`/orderDetails/${orderResponse._id}`);
    } catch (err) {
      toast.error(err); // Display error if order creation fails
    }
  };

  return (
    <>
      {/* Progress bar showing current checkout step */}
      <CheckoutProgress step1 step2 step3 step4 />

      <Row>
        <Col md={8}>
          {/* Shipping and payment information display */}
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping Information</h2>
              <p>
                <strong>Address:</strong> {cartDetails.shippingAddress.address}, {cartDetails.shippingAddress.city}{' '}
                {cartDetails.shippingAddress.postalCode}, {cartDetails.shippingAddress.country}
              </p>
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Payment Information</h2>
              <strong>Method: </strong>
              {cartDetails.paymentMethod}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {cartDetails.cartItems.length === 0 ? (
                <AlertMessage>Your cart is empty</AlertMessage>
              ) : (
                <ListGroup variant="flush">
                  {cartDetails.cartItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items Total</Col>
                  <Col>${cartDetails.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping Fee</Col>
                  <Col>${cartDetails.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${cartDetails.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Grand Total</Col>
                  <Col>${cartDetails.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {/* Display error message if there's an issue creating the order */}
              <ListGroup.Item>
                {error && <AlertMessage variant="danger">{error.data.message}</AlertMessage>}
              </ListGroup.Item>

              {/* Button to place the order */}
              <ListGroup.Item>
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cartDetails.cartItems.length === 0}
                  onClick={handlePlaceOrder}
                >
                  Confirm and Place Order
                </Button>
                {isLoading && <LoadingSpinner />}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderReviewScreen;
