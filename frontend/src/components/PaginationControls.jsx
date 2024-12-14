import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

/**
 * Paginate component displays pagination controls to navigate through multiple pages.
 * It conditionally renders the pagination links based on the total number of pages.
 *
 * @param {number} pages - Total number of pages to paginate through.
 * @param {number} page - The current active page.
 * @param {boolean} isAdmin - Flag to determine if the user is an admin (used to show admin-specific pagination).
 * @param {string} keyword - The search keyword used for filtering search results.
 */
const PaginationControls = ({ pages, page, isAdmin = false, keyword = '' }) => {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((pageNumber) => (
          <Pagination.Item
            as={Link}
            key={pageNumber + 1}
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/currentPage/${pageNumber + 1}`
                  : `/currentPage/${pageNumber + 1}`
                : `/admin/productlist/${pageNumber + 1}`
            }
            active={pageNumber + 1 === page}
          >
            {pageNumber + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    )
  );
};

export default PaginationControls;
