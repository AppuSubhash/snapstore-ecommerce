import { Spinner } from 'react-bootstrap';

/**
 * Loader component displays a loading spinner while content is being loaded.
 * It is typically used to indicate that a process is in progress.
 */
const LoadingSpinner = () => {
  return (
    <Spinner
      animation='border'
      role='status'
      style={{
        width: '100px',
        height: '100px',
        margin: 'auto',
        display: 'block',
      }}
    >
      {/* Optional text for screen readers */}
      <span className='sr-only'>Loading...</span>
    </Spinner>
  );
};

export default LoadingSpinner;
