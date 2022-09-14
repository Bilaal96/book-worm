import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

// Components
import CustomBackdrop from 'components/CustomBackdrop/CustomBackdrop';
import BookCardsList from 'components/BookCardsList/BookCardsList';
import { Hidden } from '@material-ui/core';

/**
 * Renders appropriate UI based on property values of books prop.
 * @param { Object } books - result of fetching related books from Google Books API, and then sanitising the data.
 
 * NOTE: criteria for what counts as a related book is determined by the Parent component of RelatedBooksList.
 */
const RelatedBooks = ({ books }) => {
  const history = useHistory();
  const { error, loading, value: relatedBooks } = books;

  // Navigate to the BookDetails page of the "related book"
  // This handler is attached to each book in relatedBooks.value
  const handleBookDetailsClick = (bookId) => (e) => {
    history.push(`/books/${bookId}`);
  };

  // Render error UI
  //* ALT APPROACH: Specific UI for each error
  // Author(s) unknown
  /* if (error === "no authors") {
    return <CustomBackdrop text={`Author(s) unknown`} position="static" />;
  } */

  //* CURRENT APPROACH: One for all errors
  if (error) {
    return (
      <CustomBackdrop
        text={error.message || 'Something went wrong, please try again later'}
        position="static"
      />
    );
  }

  // Render loading UI
  if (loading) {
    return (
      <CustomBackdrop text="Finding related books" position="static" spinner />
    );
  }

  // Render results found UI
  if (relatedBooks?.length) {
    return (
      <>
        {/* Display BookCard's in GRID format; hide at "lgUp" breakpoint */}
        <Hidden lgUp>
          <BookCardsList
            books={relatedBooks}
            cardLayout="vertical"
            breakpoints={{ xs: 12, sm: 6 }}
            handleBookDetailsClick={handleBookDetailsClick}
          />
        </Hidden>

        {/* Display BookCard's in LIST format; hide at "mdDown" breakpoint */}
        <Hidden mdDown>
          <BookCardsList
            books={relatedBooks}
            cardLayout="horizontal"
            breakpoints={{ xs: 12 }}
            handleBookDetailsClick={handleBookDetailsClick}
          />
        </Hidden>
      </>
    );
  }

  // Render "no results" UI - accounts for null & empty array (as a result of the related books validation process)
  return <CustomBackdrop text="No results found" position="static" />;
};

RelatedBooks.propTypes = {
  books: PropTypes.shape({
    loading: PropTypes.bool,
    value: PropTypes.array,
    error: PropTypes.shape({
      message: PropTypes.string,
    }),
  }),
};

export default RelatedBooks;
