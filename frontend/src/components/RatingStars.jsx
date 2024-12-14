import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

/**
 * Rating component displays a rating using star icons.
 * It renders filled, half-filled, or empty stars based on the rating value.
 * 
 * @param {number} value - The rating value (e.g., 3.5 for 3 and a half stars).
 * @param {string} text - Optional text to display alongside the rating (e.g., "5 reviews").
 * @param {string} color - The color of the stars (default is yellow).
 */
const RatingStars = ({ value, text, color }) => {
  // Helper function to render individual stars based on the rating value
  const renderStar = (starValue) => {
    if (value >= starValue) {
      return <FaStar style={{ color }} />;
    } else if (value >= starValue - 0.5) {
      return <FaStarHalfAlt style={{ color }} />;
    } else {
      return <FaRegStar style={{ color }} />;
    }
  };

  return (
    <div className='rating'>
      {renderStar(1)}
      {renderStar(2)}
      {renderStar(3)}
      {renderStar(4)}
      {renderStar(5)}
      {/* Display the text (if provided) alongside the rating */}
      <span className='rating-text'>{text && text}</span>
    </div>
  );
};

// Set default color to yellow
RatingStars.defaultProps = {
  color: '#f8e825',
};

export default RatingStars;
