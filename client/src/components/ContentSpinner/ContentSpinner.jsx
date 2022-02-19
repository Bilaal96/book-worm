import PropTypes from "prop-types";
import clsx from "clsx";

// Components
import { Backdrop, CircularProgress, Typography } from "@material-ui/core";

import useStyles from "./styles";

/**
 * A spinner (loading) screen to be displayed when waiting for data to load/fetch

 * open - required - dictates when Backdrop component is shown 

 * [OPTIONAL PROPS]
 * text - provides context on what is happening (e.g. what is loading)
 * size - size of spinner - defaults to 40
 * position 
    - sets css position property of Backdrop (options listed below)
    - [fixed] | static | absolute
 * rounded - adds CSS border-radius
 */
const ContentSpinner = ({ text, open, size, position, rounded }) => {
    const classes = useStyles();

    const backdropClasses = clsx({
        [classes.root]: true, // default styles
        [classes.backdropFixed]: position === "fixed" || !position, // [ DEFAULT ]
        [classes.backdropStatic]: position === "static",
        [classes.backdropAbsolute]: position === "absolute",
        [classes.backdropRounded]: rounded,
    });

    return (
        <Backdrop className={backdropClasses} open={open}>
            <CircularProgress
                color="secondary"
                className={classes.spinner}
                size={size || 40}
            />
            {text && (
                <Typography
                    className={classes.spinnerText}
                    variant="h5"
                    align="center"
                >
                    {text}
                </Typography>
            )}
        </Backdrop>
    );
};

ContentSpinner.propTypes = {
    text: PropTypes.string,
    open: PropTypes.bool.isRequired,
    size: PropTypes.number,
    position: PropTypes.string,
    rounded: PropTypes.bool,
};

export default ContentSpinner;
