import PropTypes from "prop-types";

// Components
import { Grid } from "@material-ui/core";
import BookCard from "components/BookCard/BookCard";

/**
 * Renders a list of BookCard components for each element in the "books" array (received as prop).
  
 * @param { Array } books - An array of objects, each representing a single book from the Google Books API. 

 * @param { Object } [breakpoints] - A map of MUI breakpoints to be passed as props to <Grid item /> component. Default value provided.

 * --- 
 * Props drilled to BookCard.

 * @param { String } [cardLayout] 
 * Determines the layout of the BookCard component. 
 * Can be one of the following values: "vertical" | "horizontal". 
 * Defaults to "vertical" if not specified.

 * @param { Function } handleBookDetailsClick - handles onClick event of "Details" button in BookCardVertical/Horizontal; navigates to BookDetails page.

 * @param { Function } [handleBookDelete] 
 * Handles onClick event of "Delete" button in BookCardVertical/Horizontal; removes a book from a user-owned booklist.
 * NOTE: Delete button is only rendered if handleBookDelete prop is received as a function. 
 
 * @param { Boolean } [isDeletingBook] - Passed to Delete button (an AsyncButton component) within ConfirmActionModal component. Determines when AsyncButton should render a Spinner icon.
 */
const BookCardsList = ({
    books,
    breakpoints = { xs: 12, sm: 6, md: 4, lg: 3 },
    cardLayout = "vertical",
    handleBookDetailsClick,
    // Only pass these props if BookCard is deletable
    handleBookDelete,
    isDeletingBook,
}) => {
    return (
        <Grid container spacing={2}>
            {books &&
                books.map((book) => (
                    <Grid key={book.id} item {...breakpoints}>
                        <BookCard
                            book={book}
                            layout={cardLayout}
                            handleBookDetailsClick={handleBookDetailsClick}
                            handleBookDelete={handleBookDelete}
                            isDeletingBook={isDeletingBook}
                        />
                    </Grid>
                ))}
        </Grid>
    );
};

BookCardsList.propTypes = {
    books: PropTypes.array.isRequired,
    breakpoints: PropTypes.shape({
        xs: PropTypes.number,
        sm: PropTypes.number,
        md: PropTypes.number,
        lg: PropTypes.number,
    }),
    cardLayout: PropTypes.oneOf(["vertical", "horizontal"]),
    handleBookDetailsClick: PropTypes.func.isRequired,
    handleBookDelete: PropTypes.func,
    isDeletingBook: PropTypes.bool,
};

export default BookCardsList;
