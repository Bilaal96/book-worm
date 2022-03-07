import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    card: {},
    linkToDetails: {
        transition: "all 0.2s ease",
        cursor: "pointer",

        "&:hover": { backgroundColor: "rgba(0,0,0,0.2)" },
        "&:focus": {
            outline: "none",
            backgroundColor: "rgba(0,0,0,0.6)",
        },
        "&:active": { backgroundColor: "rgba(0,0,0,0.6)" },
    },
    header: {
        // Used in conjunction with "noWrap" prop to truncate text with ellipsis
        display: "block",
        backgroundColor: theme.palette.accent.light,
        borderBottom: `2px solid ${theme.palette.secondary.light}`,
    },
    media: {
        backgroundSize: "contain",
        paddingTop: "56.25%", // 16:9

        [theme.breakpoints.up("sm")]: {
            paddingTop: "75%",
        },
    },
    actionsOne: {
        backgroundColor: theme.palette.accent.main,
        borderBottom: `2px solid ${theme.palette.primary.light}`,
    },
    content: {
        height: "150px", // main style that determines card's overall size
        width: "100%",
        overflow: "hidden",
        padding: theme.spacing(1, 2),
        // Clamp paragraph lines and show ellipsis at overflow
        // https://css-tricks.com/line-clampin/
        display: "-webkit-box",
        "-webkit-line-clamp": 7,
        "-webkit-box-orient": "vertical",
    },
    description: {},
    actionsTwo: {
        display: "flex",
        padding: theme.spacing(2),
    },
}));
