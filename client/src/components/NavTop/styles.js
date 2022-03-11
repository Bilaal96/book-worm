import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    nav: {
        height: "100%",
        display: "flex",
        gap: theme.spacing(1.5),
    },
    navLink: {
        position: "relative",
        color: theme.palette.common.white,
        padding: theme.spacing(1, 2),

        // Animated pseudo border-bottom (shown on selected navLink)
        "&:after": {
            content: "''",
            position: "absolute",
            bottom: "1px",
            width: "100%",
            height: "3px",
            backgroundColor: theme.palette.common.white,
            transform: "scaleX(0)",
            transition: "all 0.4s ease",
        },

        "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.05)" },
    },
    navLinkSelected: {
        borderRadius: 0,
        borderTopLeftRadius: "4px",
        borderTopRightRadius: "4px",

        // Show pseudo border-bottom
        "&:after": { transform: "scaleX(1)" },
    },
}));
