import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * SearchBox component provides a search bar to allow users to search for products.
 * It navigates to the search results page with the entered keyword.
 */
const ProductSearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();

  // Initialize the state with the keyword from the URL or an empty string
  const [searchKeyword, setSearchKeyword] = useState(urlKeyword || '');

  /**
   * Handles the form submission.
   * If the search keyword is present, it navigates to the search results page.
   * If no keyword is provided, it navigates to the homepage.
   */
  const submitHandler = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/search/${searchKeyword.trim()}`);
      setSearchKeyword(''); // Clear the search input after submission
    } else {
      navigate('/'); // Navigate to homepage if no keyword
    }
  };

  return (
    <Form onSubmit={submitHandler} className='d-flex'>
      <Form.Control
        type='text'
        name='q'
        onChange={(e) => setSearchKeyword(e.target.value)}
        value={searchKeyword}
        placeholder='Search Products...'
        className='mr-sm-2 ml-sm-5'
      />
      <Button type='submit' variant='outline-success' className='p-2 mx-2'>
        Search
      </Button>
    </Form>
  );
};

export default ProductSearchBox;
