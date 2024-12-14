import { Table, Button, Row, Col } from 'react-bootstrap';
import { FaPencilAlt, FaPlusSquare, FaTrashAlt } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import AlertMessage from '../../components/AlertMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import PaginationControls from '../../components/PaginationControls';
import {
  useSearchProductsQuery,
  useDeleteProductMutation,
  useCreateNewProductMutation,
} from '../../slices/productApiSlice';
import { toast } from 'react-toastify';

const AdminProductManager = () => {
  const { pageId } = useParams();

  const { data: productData, isLoading, error, refetch } = useSearchProductsQuery({
    pageId,
  });

  const [removeProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you certain you want to delete this product?')) {
      try {
        await removeProduct(productId);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const [addProduct, { isLoading: isCreating }] = useCreateNewProductMutation();

  const handleAddProduct = async () => {
    if (window.confirm('Confirm creating a new product?')) {
      try {
        await addProduct();
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <>
      <Row className='align-items-center'>
        <Col>
          <h1>Product Management</h1>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={handleAddProduct}>
            <FaPlusSquare /> Add Product
          </Button>
        </Col>
      </Row>

      {isCreating && <LoadingSpinner />}
      {isDeleting && <LoadingSpinner />}
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <AlertMessage variant='danger'>{error.data.message}</AlertMessage>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Title</th>
                <th>Cost</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {productData.products.map((item) => (
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{item.name}</td>
                  <td>${item.price}</td>
                  <td>{item.category}</td>
                  <td>{item.brand}</td>
                  <td>
                    <Button
                      as={Link}
                      to={`/admin/product/${item._id}/edit`}
                      variant='light'
                      className='btn-sm mx-2'
                    >
                      <FaPencilAlt />
                    </Button>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => handleDeleteProduct(item._id)}
                    >
                      <FaTrashAlt style={{ color: 'white' }} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <PaginationControls
            pages={productData.pages}
            page={productData.page}
            isAdmin={true}
          />
        </>
      )}
    </>
  );
};

export default AdminProductManager;
