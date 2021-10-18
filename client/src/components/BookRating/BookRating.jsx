import PropTypes from "prop-types";

// Components
import { Rating } from "@material-ui/lab";
import { Typography } from "@material-ui/core";

import useStyles from "./styles";

const BookRating = ({ avgRating, count }) => {
    const classes = useStyles();
    console.log("BookRating", { avgRating, count });

    /**
     * NOTE Potential improvement:
     * if count > 0 -> show rating
     * else -> show "No reviews"
     */
    return (
        <div className={classes.bookRating}>
            <Rating value={avgRating} precision={0.1} readOnly />
            <Typography variant="body1">({count ? count : 0})</Typography>
        </div>
    );
};

BookRating.propTypes = {
    avgRating: PropTypes.number,
    count: PropTypes.number,
};

export default BookRating;
