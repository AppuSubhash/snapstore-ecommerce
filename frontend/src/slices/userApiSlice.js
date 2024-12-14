import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../constants';
import { logoutUserAction } from './authSlice';

// Custom query function to intercept and handle JWT expiration (401 error)
const customBaseQuery = fetchBaseQuery({
  baseUrl: BASE_URL, // API base URL
});

/**
 * Custom query handler to intercept 401 errors, indicating expired token, and log the user out
 * @param {Object} queryArgs - Arguments required for the query (e.g., headers, endpoint)
 * @param {Object} apiInstance - The API instance to dispatch actions
 * @param {Object} extraArgs - Additional arguments (if any)
 * @returns {Object} - The API request result
 */
async function handleAuthQuery(queryArgs, apiInstance, extraArgs) {
  // Execute the base query request
  const response = await customBaseQuery(queryArgs, apiInstance, extraArgs);

  // Check if a 401 Unauthorized error is received (token expiration)
  if (response.error && response.error.status === 401) {
    // Dispatch action to log the user out if the token is expired
    apiInstance.dispatch(logoutUserAction());
  }

  return response;
}

// API slice configuration with customized query handler
export const userApiSlice = createApi({
  baseQuery: handleAuthQuery, // Use the custom query handler with auth interception
  tagTypes: ['Product', 'Order', 'User'], // Cache tags for management of specific data types
  endpoints: (builder) => ({}), // Define API endpoints here
});
