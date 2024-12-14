import { PRODUCTS_URL } from '../constants';
import { userApiSlice } from './userApiSlice';

// Define the product API slice that manages product-related endpoints
export const productApiSlice = userApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch a list of products based on search keyword and page number
    searchProducts: builder.query({
      query: ({ searchKeyword, currentPage }) => ({
        url: PRODUCTS_URL,
        params: { keyword: searchKeyword, pageNumber: currentPage },
      }),
      keepUnusedDataFor: 5, // Cache the data for 5 seconds after being unused
      providesTags: ['Products'], // Tags the product data for caching purposes
    }),

    // Retrieve details of a specific product by its ID
    fetchProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5, // Cache the data for 5 seconds after being unused
    }),

    // Add a new product to the database
    createNewProduct: builder.mutation({
      query: () => ({
        url: `${PRODUCTS_URL}`,
        method: 'POST',
      }),
      invalidatesTags: ['Products'], // Invalidate the product data after mutation
    }),

    // Update an existing product based on its ID and provided data
    modifyProduct: builder.mutation({
      query: (productData) => ({
        url: `${PRODUCTS_URL}/${productData.productId}`,
        method: 'PUT',
        body: productData,
      }),
      invalidatesTags: ['Products'], // Invalidate the product data after mutation
    }),

    // Upload a product image
    uploadProductImage: builder.mutation({
      query: (imageData) => ({
        url: '/api/upload',
        method: 'POST',
        body: imageData,
      }),
    }),

    // Remove a product from the database by its ID
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
      providesTags: ['Products'], // Tag for invalidating cached data
    }),

    // Create a review for a specific product
    addProductReview: builder.mutation({
      query: (reviewData) => ({
        url: `${PRODUCTS_URL}/${reviewData.productId}/reviews`,
        method: 'POST',
        body: reviewData,
      }),
      invalidatesTags: ['Products'], // Invalidate the product data after mutation
    }),

    // Get a list of top-rated products
    fetchTopRatedProducts: builder.query({
      query: () => `${PRODUCTS_URL}/top`,
      keepUnusedDataFor: 5, // Cache the data for 5 seconds after being unused
    }),
  }),
});

// Export the hooks that will be used in components
export const {
  useSearchProductsQuery,
  useFetchProductDetailsQuery,
  useCreateNewProductMutation, 
  useModifyProductMutation, 
  useUploadProductImageMutation, 
  useDeleteProductMutation, 
  useAddProductReviewMutation, 
  useFetchTopRatedProductsQuery,
} = productApiSlice;
