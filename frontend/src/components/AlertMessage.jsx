import { Alert } from 'react-bootstrap';

/**
 * Message component displays an alert message with a customizable variant.
 * It can be used to display success, error, or informational messages.
 * 
 * @param {string} variant - The style variant of the alert (e.g., 'success', 'danger', 'info').
 * @param {React.ReactNode} children - The content to be displayed inside the alert.
 */
const AlertMessage = ({ variant, children }) => {
  return <Alert variant={variant}>{children}</Alert>;
};

// Set default variant to 'info' if none is provided
AlertMessage.defaultProps = {
  variant: 'info',
};

export default AlertMessage;
