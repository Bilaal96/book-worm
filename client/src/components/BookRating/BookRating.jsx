import PropTypes from "prop-types";

// Components
import { Rating } from "@material-ui/lab";
import { makeStyles, Typography } from "@material-ui/core";

// Styles
const useStyles = makeStyles((theme) => ({
    bookRating: {
        display: "flex",
        gap: theme.spacing(2),
    },
}));

// Custom implementation of MUIs Rating component
// https://v4.mui.com/components/rating/#half-ratings
const BookRating = ({ avgRating = 0, count = 0 }) => {
    const classes = useStyles();

    return (
        <div className={classes.bookRating}>
            {/* Star Rating Visual */}
            <Rating value={avgRating} precision={0.1} readOnly />

            {/* Numeric Rating Visual (out of 5) */}
            {avgRating > 0 && (
                <Typography variant="body1">{`${avgRating} / 5`}</Typography>
            )}

            {/* Number of ratings given */}
            {/* No ratings */}
            {count === 0 && (
                <Typography variant="body1">{`(0 reviews)`}</Typography>
            )}

            {/* Has a single rating */}
            {count === 1 && (
                <Typography variant="body1">{`(1 review)`}</Typography>
            )}

            {/* Has more than one rating */}
            {count > 1 && (
                <Typography variant="body1">{`(${count} reviews)`}</Typography>
            )}
        </div>
    );
};

BookRating.propTypes = {
    avgRating: PropTypes.number,
    count: PropTypes.number,
};

export default BookRating;
