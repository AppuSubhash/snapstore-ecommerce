import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import AlertMessage from '../../components/AlertMessage';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
  useRemoveUserMutation,
  useFetchUsersQuery,
} from '../../slices/userManagementApiSlice';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

/**
 * UserManagementPage Component
 * Displays a list of users with options to edit or delete them.
 */
const UserManagementPage = () => {
  // Fetch users data and API mutation hooks
  const {
    data: userList,
    refetch: refreshUserList,
    isLoading: isUserListLoading,
    error: userListError,
  } = useFetchUsersQuery();

  const [deleteUser] = useRemoveUserMutation();

  /**
   * Handles deleting a user.
   * Prompts for confirmation and calls the delete user API.
   * @param {string} userId - ID of the user to delete
   */
  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        refreshUserList();
        toast.success('User deleted successfully.');
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <>
      <h1>User Management</h1>
      {isUserListLoading ? (
        <LoadingSpinner />
      ) : userListError ? (
        <AlertMessage variant="danger">
          {userListError?.data?.message || userListError.error}
        </AlertMessage>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Admin</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
                <td>
                  {user.isAdmin ? (
                    <FaCheck style={{ color: 'green' }} />
                  ) : (
                    <FaTimes style={{ color: 'red' }} />
                  )}
                </td>
                <td>
                  {!user.isAdmin && (
                    <>
                      <Button
                        as={Link}
                        to={`/admin/profile/${user._id}/edit`}
                        variant="light"
                        className="btn-sm"
                        style={{ marginRight: '10px' }}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        <FaTrash style={{ color: 'white' }} />
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default UserManagementPage;
