import { Container, Row, Col } from 'react-bootstrap';

/**
 * Footer component displays the footer with the current year.
 * It shows the copyright notice for the SnapStore website.
 */
const FooterSection = () => {
  // Get the current year
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <Container>
        <Row>
          <Col className='text-center py-3'>
            {/* Display the copyright notice with the current year */}
            <p>SnapStore &copy; {currentYear}</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default FooterSection;

