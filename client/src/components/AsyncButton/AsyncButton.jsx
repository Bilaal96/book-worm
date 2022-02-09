import PropTypes from "prop-types";

// Components
import { Button } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";

import useStyles from "./styles";

/** AsyncButton
 * Renders a spinner icon for the duration of an async process
 * i.e. on initiation of async process, until its completion
 *
 * Spinner icon position in button:
 * Default (no icons received as props) -> show spinner on left
 * startIcon received as prop -> show spinner on left
 * endIcon received as prop -> show spinner on right
 */
const AsyncButton = ({ startIcon, endIcon, loading, children, ...rest }) => {
    const classes = useStyles();

    // Spinner - shown when loading prop === true
    const spinnerIcon = (
        <CircularProgress className={classes.spinner} size={20} />
    );

    // If NO icons are received as props, determine when to render spinnerIcon
    const renderDefaultSpinner = () => {
        if (!startIcon && !endIcon) return loading && spinnerIcon;
    };

    // If icon(s) ARE received as props, determine when to render defaultIcon / spinnerIcon
    const renderButtonIcon = (defaultIcon) => {
        return defaultIcon && loading ? spinnerIcon : defaultIcon;
    };

    return (
        <Button
            // If no icons are passed, startIcon is default position of spinnerIcon
            startIcon={renderButtonIcon(startIcon) || renderDefaultSpinner()}
            endIcon={renderButtonIcon(endIcon)}
            disabled={loading ? true : false}
            {...rest}
        >
            {children}
        </Button>
    );
};

AsyncButton.propTypes = {
    loading: PropTypes.bool.isRequired,
    startIcon: PropTypes.element,
    endIcon: PropTypes.element,
};

export default AsyncButton;
