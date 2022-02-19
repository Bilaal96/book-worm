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
 * contained - styles ContentSpinner relative to parent container
 * rounded - adds CSS border-radius
 */
const ContentSpinner = ({ text, open, size, contained, rounded }) => {
    const styleProps = { contained, rounded };
    const classes = useStyles(styleProps);

    // if "contained", position absolute - i.e. relative to next (relative/absolute positioned) parent container
    const backdropClasses = clsx({
        [classes.root]: true, // default styles
        [classes.backdropFixed]: !contained, // position: fixed
        [classes.backdropAbsolute]: contained, // position: absolute
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
    contained: PropTypes.bool,
    rounded: PropTypes.bool,
};

export default ContentSpinner;
