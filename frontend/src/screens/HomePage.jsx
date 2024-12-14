import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useSearchProductsQuery } from '../slices/productApiSlice';
import Product from '../components/Product';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import PaginationControls from '../components/PaginationControls';
import ProductCarousel from '../components/ProductCarousel';
import PageMeta from '../components/PageMeta';

/**
 * HomePage Component
 * Displays a carousel of featured products, a list of the latest products,
 * and pagination controls.
 */
const HomePage = () => {
  // Extract page number and keyword from the route parameters
  const { pageNumber, keyword } = useParams();

  // Fetch products data based on the keyword and page number
  const { data: productData, isLoading, error } = useSearchProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      {/* Show the ProductCarousel only if no keyword is provided */}
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light mb-4">
          Go Back
        </Link>
      )}

      {/* Handle loading, error, and data display states */}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <AlertMessage variant="danger">
          {error?.data?.message || error.error}
        </AlertMessage>
      ) : (
        <>
          {/* Add metadata for the page */}
          <PageMeta />
          <h1>Latest Products</h1>
          <Row>
            {/* Render a grid of product components */}
            {productData.products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          {/* Add pagination controls for navigating through product pages */}
          <PaginationControls
            pages={productData.pages}
            page={productData.page}
            keyword={keyword || ''}
          />
        </>
      )}
    </>
  );
};

export default HomePage;
