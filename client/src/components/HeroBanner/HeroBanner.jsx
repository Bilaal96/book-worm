import PropTypes from "prop-types";

// Components
import { Typography } from "@material-ui/core";

import useStyles from "./styles";

// Displays hero image with overlay
const HeroBanner = ({
    // Required props
    image: heroImage, // the path to the image file

    // Optional props
    uniformMinHeight, // use single minHeight for all breakpoints
    heading,
    ctaText, // "cta" is an abbreviation for: "call-to-action"
    children, // additional content
}) => {
    const styleProps = { heroImage, uniformMinHeight };
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
    uniformMinHeight: PropTypes.string,
    heading: PropTypes.string,
    ctaText: PropTypes.string,
    children: PropTypes.node,
};

export default HeroBanner;
