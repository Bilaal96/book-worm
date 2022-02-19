import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    // Flex-item of PageContainer
    heroBanner: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: theme.spacing(1),
        padding: theme.spacing(2),

        position: "relative", // for ::before overlay
        minHeight: theme.heroBanner.height.min.smDown,
        maxHeight: "max-content",
        color: theme.palette.common.subtleWhite,

        backgroundColor: theme.palette.background.default,
        backgroundImage: ({ heroImage }) => `url(${heroImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        zIndex: 0,

        // Image overlay
        "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            zIndex: -1,
        },

        [theme.breakpoints.up("sm")]: {
            minHeight: theme.heroBanner.height.min.smUp,
            padding: theme.spacing(4, 2),
        },

        [theme.breakpoints.up("md")]: {
            minHeight: theme.heroBanner.height.min.md,
        },
    },
    ctaHeading: {},
    ctaText: {},
}));
