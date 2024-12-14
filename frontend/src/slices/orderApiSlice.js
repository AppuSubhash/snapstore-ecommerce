import { userApiSlice } from './userApiSlice';
import { ORDERS_URL, PAYPAL_URL } from '../constants';

// Create an API slice for handling order-related actions
export const orderApiSlice = userApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Place a new order
    initiateNewOrder: builder.mutation({
      query: (orderData) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: orderData,
      }),
    }),

    // Retrieve details of a specific order by its ID
    fetchOrderInfo: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
      }),
      keepUnusedDataFor: 5, // Cache data for 5 seconds after being unused
    }),

    // Handle payment for a specific order
    submitOrderPayment: builder.mutation({
      query: ({ orderId, paymentData }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: 'PUT',
        body: paymentData,
      }),
    }),

    // Fetch PayPal client ID for payment processing
    retrievePaypalId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
      keepUnusedDataFor: 5, // Cache data for 5 seconds after being unused
    }),

    // Get all orders made by the current user
    fetchUserOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5, // Cache data for 5 seconds after being unused
    }),

    // Get a list of all orders (for admin use)
    fetchAllUserOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
      keepUnusedDataFor: 5, // Cache data for 5 seconds after being unused
    }),

    // Mark an order as delivered
    confirmOrderDelivery: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}/deliver`,
        method: 'PUT',
      }),
    }),
  }),
});

export const {
  useInitiateNewOrderMutation,
  useFetchOrderInfoQuery, 
  useSubmitOrderPaymentMutation, 
  useRetrievePaypalIdQuery,
  useFetchUserOrdersQuery, 
  useFetchAllUserOrdersQuery, 
  useConfirmOrderDeliveryMutation,
} = orderApiSlice;
