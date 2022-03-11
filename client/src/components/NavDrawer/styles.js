import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    hamburger: { color: theme.palette.common.white },
    list: {
        padding: 0,
        width: "240px",
        height: "100vh",
    },
    // List items
    logo: {
        height: theme.header.height,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        textAlign: "center",
    },
    navLink: {
        color: "rgba(0, 0, 0, 0.6)",
        transition: "all 0.3s ease",

        // Selected
        "&.Mui-selected": {
            // rgba version of theme.palette.primary.main
            backgroundColor: "rgba(1, 148, 154, 0.15)",
            color: theme.palette.primary.main,
        },

        // Hovered / Selected & Hovered
        "&:hover, &.Mui-selected:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.06)",
        },

        // Focused
        "&:focus": {
            backgroundColor: "rgba(0, 0, 0, 0.06)",
            color: theme.palette.secondary.main,
        },
    },
    navLinkIcon: {
        transition: "all 0.3s ease",

        // Icon on selected navLink
        "$navLink.Mui-selected &": { color: theme.palette.primary.main },

        // Icon on navLink hover
        "$navLink:hover:not(.Mui-selected) &": {
            color: theme.palette.primary.main,
        },

        // Icon on navLink focus
        "$navLink:focus &": { color: theme.palette.secondary.main },
    },
}));
