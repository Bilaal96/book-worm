import PropTypes from "prop-types";

// Components
import { Grid } from "@material-ui/core";
import BookCard from "components/BookCard/BookCard";

const BooksGrid = ({ booksFound }) => {
    return (
        <Grid container spacing={2}>
            {booksFound.items &&
                booksFound.items.map((book) => (
                    <Grid key={book.id} item xs={12} sm={6} md={4} lg={3}>
                        <BookCard book={book} />
                    </Grid>
                ))}
        </Grid>
    );
};

BooksGrid.propTypes = {
    booksFound: PropTypes.object.isRequired,
};

export default BooksGrid;
