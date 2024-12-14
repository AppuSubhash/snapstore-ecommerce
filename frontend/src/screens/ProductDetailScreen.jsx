import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useFetchProductDetailsQuery, useAddProductReviewMutation } from '../slices/productApiSlice';
import RatingStars from '../components/RatingStars';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertMessage from '../components/AlertMessage';
import PageMeta from '../components/PageMeta';
import { addToCart } from '../slices/cartSlice';

/**
 * ProductDetailScreen Component
 * This screen displays detailed information about a product, including product details, reviews,
 * and a form to submit a review.
 */
const ProductDetailScreen = () => {
  const { id: productId } = useParams(); // Retrieve product ID from URL parameters

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State variables for managing quantity, rating, and comment for the review
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  // Handler to add the product to the cart
  const handleAddToCart = () => {
    dispatch(addToCart({ ...product, qty: quantity }));
    navigate('/cart'); // Redirect to the cart page
  };

  // Fetch product details using the provided product ID
  const { data: product, isLoading, refetch, error } = useFetchProductDetailsQuery(productId);

  // Access user information from the Redux store
  const { userInfo } = useSelector((state) => state.auth);

  // Mutation hook for creating a product review
  const [createReview, { isLoading: reviewLoading }] = useAddProductReviewMutation();

  /**
   * Handler for submitting a product review
   * Sends the review data to the server and refreshes the product details
   */
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch(); // Refetch product details to get the updated reviews
      toast.success('Review created successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error); // Display error message if review creation fails
    }
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <AlertMessage variant="danger">{error?.data?.message || error.error}</AlertMessage>
      ) : (
        <>
          <PageMeta title={product.name} description={product.description} />
          <Row>
            <Col md={6}>
              <Image src={product.image} alt={product.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>
                  <RatingStars value={product.rating} text={`${product.numReviews} reviews`} />
                </ListGroup.Item>
                <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                <ListGroup.Item>Description: {product.description}</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <Row>
                      <Col>Price:</Col>
                      <Col>
                        <strong>${product.price}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>Status:</Col>
                      <Col>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</Col>
                    </Row>
                  </ListGroup.Item>

                  {/* Quantity selection */}
                  {product.countInStock > 0 && (
                    <ListGroup.Item>
                      <Row>
                        <Col>Qty</Col>
                        <Col>
                          <Form.Control
                            as="select"
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                          >
                            {[...Array(product.countInStock).keys()].map((x) => (
                              <option key={x + 1} value={x + 1}>
                                {x + 1}
                              </option>
                            ))}
                          </Form.Control>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  )}

                  <ListGroup.Item>
                    <Button
                      className="btn-block"
                      type="button"
                      disabled={product.countInStock === 0}
                      onClick={handleAddToCart}
                    >
                      Add To Cart
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
          <Row className="review">
            <Col md={6}>
              <h2>Reviews</h2>
              {product.reviews.length === 0 && <AlertMessage>No Reviews</AlertMessage>}
              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <RatingStars value={review.rating} />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item>
                  <h2>Write a Customer Review</h2>

                  {reviewLoading && <LoadingSpinner />}

                  {userInfo ? (
                    <Form onSubmit={handleReviewSubmit}>
                      <Form.Group className="my-2" controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Control
                          as="select"
                          required
                          value={rating}
                          onChange={(e) => setRating(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1 - Poor</option>
                          <option value="2">2 - Fair</option>
                          <option value="3">3 - Good</option>
                          <option value="4">4 - Very Good</option>
                          <option value="5">5 - Excellent</option>
                        </Form.Control>
                      </Form.Group>
                      <Form.Group className="my-2" controlId="comment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                          as="textarea"
                          row="3"
                          required
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></Form.Control>
                      </Form.Group>
                      <Button disabled={reviewLoading} type="submit" variant="primary">
                        Submit
                      </Button>
                    </Form>
                  ) : (
                    <AlertMessage>
                      Please <Link to="/login">sign in</Link> to write a review
                    </AlertMessage>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ProductDetailScreen;
