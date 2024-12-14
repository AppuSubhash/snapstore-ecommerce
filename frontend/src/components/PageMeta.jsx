import { Helmet } from 'react-helmet-async';

/**
 * Meta component handles the meta tags for SEO optimization.
 * It sets the title, description, and keywords for the page.
 * 
 * @param {string} title - The title to be displayed in the browser tab.
 * @param {string} description - A brief description of the page for SEO purposes.
 * @param {string} keywords - Keywords related to the page content for SEO optimization.
 */
const PageMeta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      {/* Set the page title */}
      <title>{title}</title>
      {/* Set the page description for SEO */}
      <meta name='description' content={description} />
      {/* Set the page keywords for SEO */}
      <meta name='keywords' content={keywords} />
    </Helmet>
  );
};

// Set default props for title, description, and keywords
PageMeta.defaultProps = {
  title: 'Welcome To SnapStore',
  description: 'We sell the best products for cheap',
  keywords: 'electronics, buy electronics, cheap electronics',
};

export default PageMeta;
