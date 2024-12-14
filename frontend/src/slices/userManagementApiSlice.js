import { userApiSlice } from './userApiSlice';
import { USERS_URL } from '../constants';

// Define the user API slice for handling user-related endpoints
export const userManagementApiSlice = userApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // User login mutation
    loginUser: builder.mutation({
      query: (credentials) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: credentials,
      }),
    }),

    // User registration mutation
    registerUser: builder.mutation({
      query: (userData) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: userData,
      }),
    }),

    // User logout mutation
    logoutUser: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),

    // Update user profile mutation
    updateUserProfile: builder.mutation({
      query: (profileData) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: profileData,
      }),
    }),

    // Get all users query
    fetchUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ['User'], // Cache tag for user-related data
      keepUnusedDataFor: 5, // Cache data for 5 seconds after being unused
    }),

    // Delete a user mutation
    removeUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE',
      }),
    }),

    // Fetch details of a specific user by ID query
    fetchUserDetails: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
      }),
      keepUnusedDataFor: 5, // Cache data for 5 seconds after being unused
    }),

    // Update user details mutation
    modifyUser: builder.mutation({
      query: (userData) => ({
        url: `${USERS_URL}/${userData.userId}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'], // Invalidate cached user data after mutation
    }),
  }),
});

// Export hooks for using the API calls
export const {
  useLoginUserMutation, // Hook for logging in a user
  useLogoutUserMutation, // Hook for logging out a user
  useRegisterUserMutation, // Hook for registering a user
  useUpdateUserProfileMutation, // Hook for updating user profile
  useFetchUsersQuery, // Hook for fetching all users
  useRemoveUserMutation, // Hook for deleting a user
  useModifyUserMutation, // Hook for modifying user data
  useFetchUserDetailsQuery, // Hook for fetching user details
} = userManagementApiSlice;
