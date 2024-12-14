import { Table, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import AlertMessage from '../../components/AlertMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useFetchAllUserOrdersQuery } from '../../slices/orderApiSlice';
import { Link } from 'react-router-dom';

/**
 * AdminOrderListScreen component displays a list of all orders.
 * It allows admin users to view order details such as the user, date, total, payment, and delivery status.
 */
const AdminOrderListScreen = () => {
  const { data: orders, isLoading, error } = useFetchAllUserOrdersQuery();

  return (
    <>
      <h1>Orders</h1>

      {/* Display a loading spinner while fetching orders */}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        // Show an error message if there is an issue fetching the orders
        <AlertMessage variant='danger'>
          {error?.data?.message || error.error}
        </AlertMessage>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Order Date</th>
              <th>Total Price</th>
              <th>Payment Status</th>
              <th>Delivery Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Loop through the orders and display each order's details */}
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user?.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  {/* Button to view the order details */}
                  <Button
                    as={Link}
                    to={`/orderDetails/${order._id}`}
                    variant='light'
                    className='btn-sm'
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default AdminOrderListScreen;
