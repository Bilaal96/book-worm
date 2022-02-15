import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    card: {},
    header: {
        // Used in conjunction with "noWrap" prop to truncate text with ellipsis
        display: "block",
        backgroundColor: theme.palette.accent.light,
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
        [theme.breakpoints.up("md")]: {
            justifyContent: "space-around",
        },
    },
}));
