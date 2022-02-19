import PropTypes from "prop-types";
import { Container } from "@material-ui/core";
import clsx from "clsx";

import useStyles from "./styles";

/**
 * WidthContainer is a custom wrapper around MUI Container 
 * It squeezes/shrinks its children's width at large screen widths using MUI theme breakpoints
 
 * Padding & margin props are objects mapping to the t/r/b/l properties 
 * These props can used to overwrite the default padding/margin of MUIs Container component
 */
const WidthContainer = ({ center, padding, margin, children, ...rest }) => {
    const styleProps = { padding, margin };
    const classes = useStyles(styleProps);

    return (
        <Container
            maxWidth="lg"
            className={clsx(classes.widthContainer, {
                // Classes are conditionally rendered based on props passed
                [classes.centerChildren]: center,
                [classes.padding]: padding,
                [classes.margin]: margin,
            })}
            {...rest}
        >
            {children}
        </Container>
    );
};

WidthContainer.propTypes = {
    center: PropTypes.bool,
    margin: PropTypes.object,
    padding: PropTypes.object,
    children: PropTypes.node,
};

export default WidthContainer;
