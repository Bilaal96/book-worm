import PropTypes from "prop-types";

// Components
import { Typography } from "@material-ui/core";

import useStyles from "./styles";

/**
 * Displays hero image with overlay; path to image is a required prop
 * Optional props: heading, ctaText and additional content as children
 
 * NOTE: ctaText -> call-to-action text
 */
const HeroBanner = ({ image: heroImage, heading, ctaText, children }) => {
    const styleProps = { heroImage };
    const classes = useStyles(styleProps);

    return (
        <section className={classes.heroBanner}>
            {heading && (
                <Typography
                    className={classes.ctaHeading}
                    variant="h2"
                    component="h1"
                    align="center"
                >
                    {heading}
                </Typography>
            )}

            {ctaText && (
                <Typography
                    className={classes.ctaText}
                    variant="h4"
                    component="p"
                    align="center"
                >
                    {ctaText}
                </Typography>
            )}

            {children}
        </section>
    );
};

HeroBanner.propTypes = {
    image: PropTypes.string.isRequired,
    heading: PropTypes.string,
    ctaText: PropTypes.string,
    children: PropTypes.node,
};

export default HeroBanner;
