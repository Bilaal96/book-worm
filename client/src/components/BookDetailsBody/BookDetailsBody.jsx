import PropTypes from "prop-types";

// Components
import { Grid } from "@material-ui/core";
import BookDetailsData from "components/BookDetailsData/BookDetailsData";
import BookDetailsTabs from "components/BookDetailsTabs/BookDetailsTabs";

const BookDetailsBody = ({ book }) => {
    return (
        // NOTE: row-reverse is only active from breakpoint "md" and up
        <Grid spacing={2} container direction="row-reverse">
            <Grid xs={12} md={4} item>
                <BookDetailsData book={book} />
            </Grid>

            <Grid xs={12} md={8} item>
                <BookDetailsTabs book={book} />
            </Grid>
        </Grid>
    );
};

BookDetailsBody.propTypes = {
    book: PropTypes.object.isRequired,
};

export default BookDetailsBody;
