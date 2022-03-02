import PropTypes from "prop-types";

// Components
import { Grid } from "@material-ui/core";
import BookCard from "components/BookCard/BookCard";

// Render BookCard in grid format
const BookCardsGrid = ({ books }) => {
    return (
        <Grid container spacing={2}>
            {books &&
                books.map((book) => (
                    <Grid key={book.id} item xs={12} sm={6} md={4} lg={3}>
                        <BookCard book={book} />
                    </Grid>
                ))}
        </Grid>
    );
};

BookCardsGrid.propTypes = {
    books: PropTypes.array.isRequired,
};

export default BookCardsGrid;
