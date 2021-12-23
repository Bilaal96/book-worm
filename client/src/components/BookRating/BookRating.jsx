import PropTypes from "prop-types";

// Components
import { Rating } from "@material-ui/lab";
import { Typography } from "@material-ui/core";

import useStyles from "./styles";

const BookRating = ({ avgRating, count }) => {
    const classes = useStyles();
    console.log("BookRating", { avgRating, count });

    return (
        <div className={classes.bookRating}>
            {/* NOTE: avgRating || 0 - prevents setting the value-prop to undefined (which causes MUI error) */}
            <Rating value={avgRating || 0} precision={0.1} readOnly />
            <Typography variant="body1">
                ({count ? count : "No Reviews"})
            </Typography>
        </div>
    );
};

BookRating.propTypes = {
    avgRating: PropTypes.number,
    count: PropTypes.number,
};

export default BookRating;
