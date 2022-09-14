import PropTypes from 'prop-types';

// Data fetching and sanitisation is extracted into this hook
import useRelatedBooksByAuthor from './useRelatedBooksByAuthor';

// Alternative approach, go to hook module for details
// import useRelatedBooksByAuthorAlt from './useRelatedBooksByAuthorAlt';

// Component renders appropriate UI based on value of relatedBooks
import RelatedBooks from 'components/RelatedBooks/RelatedBooks';

/**
 * Fetches books and displays books (from Google Books API) related to mutualBook by author.
 * @param { Object } mutualBook - all related books are fetched in relation to mutualBook
 */
const RelatedBooksByAuthor = ({ mutualBook }) => {
  const relatedBooks = useRelatedBooksByAuthor(mutualBook);

  return <RelatedBooks books={relatedBooks} />;
};

RelatedBooksByAuthor.propTypes = {
  mutualBook: PropTypes.object,
};

export default RelatedBooksByAuthor;
