import PropTypes from 'prop-types';

// Data fetching and sanitisation is extracted into this hook
import useRelatedBooksByCategory from './useRelatedBooksByCategory';

// Component renders appropriate UI based on value of relatedBooks
import RelatedBooks from 'components/RelatedBooks/RelatedBooks';

/**
 * Fetches books and displays books (from Google Books API) related to mutualBook by category.
 * @param { Object } mutualBook - all related books are fetched in relation to mutualBook
 */
const RelatedBooksByCategory = ({ mutualBook }) => {
  const relatedBooks = useRelatedBooksByCategory(mutualBook);

  return <RelatedBooks books={relatedBooks} />;
};

RelatedBooksByCategory.propTypes = {
  mutualBook: PropTypes.object,
};

export default RelatedBooksByCategory;
