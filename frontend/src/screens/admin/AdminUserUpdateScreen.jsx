import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Notification from '../../components/AlertMessage';
import SpinnerLoader from '../../components/LoadingSpinner';
import FormWrapper from '../../components/FormWrapper';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import {
  useFetchUserDetailsQuery,
  useModifyUserMutation,
} from '../../slices/userManagementApiSlice';

const AdminUserUpdateScreen = () => {
  const { id: targetUserId } = useParams();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isAdministrator, setIsAdministrator] = useState(false);

  const {
    data: userDetails,
    isLoading: isFetching,
    error: fetchError,
    refetch: reloadDetails,
  } = useFetchUserDetailsQuery(targetUserId);

  const [modifyUser, { isLoading: isUpdating }] = useModifyUserMutation();

  const navigation = useNavigate();

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await modifyUser({ targetUserId, userName, userEmail, isAdministrator });
      toast.success('User information updated successfully!');
      reloadDetails();
      navigation('/admin/userlisting');
    } catch (updateError) {
      toast.error(updateError?.data?.message || updateError.error);
    }
  };

  useEffect(() => {
    if (userDetails) {
      setUserName(userDetails.name);
      setUserEmail(userDetails.email);
      setIsAdministrator(userDetails.isAdmin);
    }
  }, [userDetails]);

  return (
    <>
      <Link to='/admin/userlisting' className='btn btn-light my-3'>
        Return
      </Link>
      <FormWrapper>
        <h1>Modify User Details</h1>
        {isUpdating && <SpinnerLoader />}
        {isFetching ? (
          <SpinnerLoader />
        ) : fetchError ? (
          <Notification variant='danger'>
            {fetchError?.data?.message || fetchError.error}
          </Notification>
        ) : (
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className='my-2' controlId='userName'>
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter user name'
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </Form.Group>

            <Form.Group className='my-2' controlId='userEmail'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter user email'
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className='my-2' controlId='isAdministrator'>
              <Form.Check
                type='checkbox'
                label='Administrator Privileges'
                checked={isAdministrator}
                onChange={(e) => setIsAdministrator(e.target.checked)}
              />
            </Form.Group>

            <Button type='submit' variant='success'>
              Save Changes
            </Button>
          </Form>
        )}
      </FormWrapper>
    </>
  );
};

export default AdminUserUpdateScreen;
 