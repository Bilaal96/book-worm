import PropTypes from "prop-types";
import clsx from "clsx";

// Components
import { Backdrop, CircularProgress, Typography } from "@material-ui/core";

import useStyles from "./styles";

/**
 * A custom implementation of MUIs Backdrop component
 * Allows you to:
    - dynamically render a Backdrop
    - create a loading screen (via "spinner" prop) to display when fetching data

 * NOTE: To create a "loading page", pass CustomBackdrop as immediate child of WidthContainer and set position="absolute" 
 
 * @param { Boolean } [open] - dictates when Backdrop component is shown. Computed using dynamic value if passed, otherwise defaults to true.
 * @param { String } [text] - provides context of why backdrop is being shown (e.g. loading content or content was not found).
 * @param { String } [position] - sets css "position" property of Backdrop. Options include: fixed (default) | static | absolute.
 * @param { Boolean | Number } [spinner] - renders a spinner component inside Backdrop. Has default size of 40 when passed as boolean. Custom size can be assigned by passing as number. 
 * @param { Boolean } [squared] - set css "border-radius" to zero.
 */
const CustomBackdrop = ({ open, text, position, spinner, squared }) => {
    const classes = useStyles();

    // Apply css classes based on props received
    const backdropClasses = clsx({
        [classes.root]: true, // always applied
        [classes.backdropFixed]: position === "fixed" || !position, // DEFAULT
        [classes.backdropStatic]: position === "static",
        [classes.backdropAbsolute]: position === "absolute",
        [classes.backdropSquared]: squared,
    });

    return (
        <Backdrop
            className={backdropClasses}
            open={open === undefined ? true : open} // use dynamic value if passed
        >
            {/* Conditionally rendered backdrop spinner */}
            {spinner && (
                <CircularProgress
                    color="secondary"
                    className={classes.spinner}
                    // Fallback to default if size is not specified
                    size={typeof spinner === "boolean" ? 40 : spinner}
                />
            )}

            {/* Conditionally rendered backdrop text */}
            {text && (
                <Typography
                    className={classes.spinnerText}
                    variant={spinner ? "h5" : "h4"}
                    align="center"
                >
                    {text}
                </Typography>
            )}
        </Backdrop>
    );
};

CustomBackdrop.propTypes = {
    open: PropTypes.bool,
    text: PropTypes.string,
    position: PropTypes.string,
    spinner: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    squared: PropTypes.bool,
};

export default CustomBackdrop;
