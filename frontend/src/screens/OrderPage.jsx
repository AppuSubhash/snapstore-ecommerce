import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  useConfirmOrderDeliveryMutation,
  useFetchOrderInfoQuery,
  useRetrievePaypalIdQuery,
  useSubmitOrderPaymentMutation,
} from '../slices/orderApiSlice';

/**
 * OrderPage Component
 * Displays detailed information for a specific order, including shipping, 
 * payment status, items, and the ability to process payments via PayPal
 * or mark the order as delivered by an admin.
 */
const OrderPage = () => {
  // Retrieve order ID from the URL parameters
  const { id: orderId } = useParams();

  // Fetch order details from API
  const { data: order, refetch, isLoading, error } = useFetchOrderInfoQuery(orderId);

  // Mutations for processing order payment and marking as delivered
  const [processPayment, { isLoading: isProcessingPayment }] = useSubmitOrderPaymentMutation();
  const [markAsDelivered, { isLoading: isMarkingAsDelivered }] = useConfirmOrderDeliveryMutation();

  // Retrieve PayPal client ID and status from the API
  const { data: paypal, isLoading: isLoadingPaypal, error: paypalError } = useRetrievePaypalIdQuery();

  // User information from the Redux store
  const { userInfo } = useSelector((state) => state.auth);

  // PayPal script loading status
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  /**
   * Effect hook to load PayPal script only if required
   */
  useEffect(() => {
    // Ensure PayPal script is loaded only when needed
    if (!paypalError && !isLoadingPaypal && paypal?.clientId) {
      const loadPaypalScript = () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };

      // Load PayPal script if the order is not paid yet and PayPal isn't already loaded
      if (order && !order.isPaid && !window.paypal) {
        loadPaypalScript();
      }
    }
  }, [paypalError, isLoadingPaypal, paypal, order, paypalDispatch]);

  /**
   * Handle payment approval from PayPal
   * @param {object} data - PayPal order data
   * @param {object} actions - PayPal actions to capture the payment
   */
  const handlePaymentApproval = async (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        // Mark the order as paid
        await processPayment({ orderId, details });
        refetch(); // Refresh the order details
        toast.success('Order payment was successful');
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    });
  };

  /**
   * Handle any error during PayPal payment process
   * @param {object} error - Error object from PayPal
   */
  const handlePaymentError = (error) => {
    toast.error(`Payment Error: ${error.message}`);
  };

  /**
   * Create PayPal order for payment processing
   * @param {object} data - PayPal order data
   * @param {object} actions - PayPal actions to create the order
   */
  const createPaypalOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: order.totalPrice, // Total price of the order
            },
          },
        ],
      })
      .then((orderID) => orderID); // Return the created order ID
  };

  /**
   * Mark the order as delivered
   */
  const handleDelivery = async () => {
    try {
      await markAsDelivered(orderId); // Update order status to delivered
      refetch(); // Refresh order details
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  // Show loading spinner if the order details are still being fetched
  if (isLoading) return <LoadingSpinner />;

  // Display error message if there's an issue fetching the order details
  if (error) return <AlertMessage variant="danger">{error.data.message}</AlertMessage>;

  return (
    <>
      <h1>Order {order._id}</h1>
      <Row>
        {/* Order Details Section */}
        <Col md={8}>
          <ListGroup variant="flush">
            {/* Shipping Information */}
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p><strong>Name: </strong>{order.user.name}</p>
              <p><strong>Email: </strong><a href={`mailto:${order.user.email}`}>{order.user.email}</a></p>
              <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
              {order.isDelivered ? (
                <AlertMessage variant="success">Delivered on {order.deliveredAt}</AlertMessage>
              ) : (
                <AlertMessage variant="danger">Not Delivered</AlertMessage>
              )}
            </ListGroup.Item>

            {/* Payment Information */}
            <ListGroup.Item>
              <h2>Payment Method</h2>
              <p><strong>Method: </strong>{order.paymentMethod}</p>
              {order.isPaid ? (
                <AlertMessage variant="success">Paid on {order.paidAt}</AlertMessage>
              ) : (
                <AlertMessage variant="danger">Not Paid</AlertMessage>
              )}
            </ListGroup.Item>

            {/* Order Items Section */}
            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <AlertMessage>Order is empty</AlertMessage>
              ) : (
                <ListGroup variant="flush">
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image src={item.image} alt={item.name} fluid rounded />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>{item.name}</Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Order Summary Section */}
        <Col md={4}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              {/* Item Prices */}
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* Shipping Price */}
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* Tax Price */}
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>${order.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* Total Price */}
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>

              {/* PayPal Payment Section */}
              {!order.isPaid && (
                <ListGroup.Item>
                  {isProcessingPayment && <LoadingSpinner />}
                  {isPending ? (
                    <LoadingSpinner />
                  ) : (
                    <PayPalButtons
                      createOrder={createPaypalOrder}
                      onApprove={handlePaymentApproval}
                      onError={handlePaymentError}
                    />
                  )}
                </ListGroup.Item>
              )}

              {/* Admin Delivery Button */}
              {isMarkingAsDelivered && <LoadingSpinner />}
              {userInfo?.isAdmin && order.isPaid && !order.isDelivered && (
                <ListGroup.Item>
                  <Button className="btn-block" onClick={handleDelivery}>
                    Mark As Delivered
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderPage;
