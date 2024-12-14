import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import AlertMessage from '../../components/AlertMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import FormWrapper from '../../components/FormWrapper';
import { toast } from 'react-toastify';
import {
  useFetchProductDetailsQuery,
  useModifyProductMutation,
  useUploadProductImageMutation,
} from '../../slices/productApiSlice';

/**
 * EditProductScreen component allows the admin to edit a product's details.
 * It fetches the current product details and provides a form to update product information.
 */
const EditProductScreen = () => {
  const { id: productId } = useParams();

  // State variables to store form data
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');

  // Fetch the product details for editing
  const { data: product, isLoading, refetch, error } = useFetchProductDetailsQuery(productId);

  // Mutation hooks for updating product and uploading an image
  const [updateProduct, { isLoading: loadingUpdate }] = useModifyProductMutation();
  const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

  const navigate = useNavigate();

  /**
   * Handles the form submission for updating a product.
   * It sends the updated product data to the backend.
   */
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      }).unwrap();
      toast.success('Product updated successfully');
      refetch();
      navigate('/admin/productlist');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // Set the form fields to the fetched product data when the product details are available
  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
    }
  }, [product]);

  /**
   * Handles the file upload for a product's image.
   * It uploads the image and updates the image state with the returned image URL.
   */
  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image); // Set the uploaded image URL to the state
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      <FormWrapper>
        <h1>Edit Product</h1>
        {loadingUpdate && <LoadingSpinner />}
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <AlertMessage variant='danger'>{error.data.message}</AlertMessage>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter product name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='image'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image URL'
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <Form.Control
                label='Choose File'
                onChange={uploadFileHandler}
                type='file'
              />
              {loadingUpload && <LoadingSpinner />}
            </Form.Group>

            <Form.Group controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter brand'
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='countInStock'>
              <Form.Label>Stock Quantity</Form.Label>
              <Form.Control
                type='number'
                placeholder='Enter stock quantity'
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter category'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>

            <Button
              type='submit'
              variant='primary'
              style={{ marginTop: '1rem' }}
            >
              Update Product
            </Button>
          </Form>
        )}
      </FormWrapper>
    </>
  );
};

export default EditProductScreen;
