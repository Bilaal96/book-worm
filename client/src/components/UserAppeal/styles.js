import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        height: "100%",
    },
    heading: {
        marginBottom: theme.spacing(2),
    },
    pitchTitle: {
        margin: theme.spacing(1, 0),

        "&__one": {
            color: theme.palette.secondary.main,
        },
        "&__two": {
            color: theme.palette.primary.main,
        },
        // Swap colors of 3rd & 4th pitchTitle's depending on breakpoint
        "&__three": {
            color: theme.palette.secondary.main,
            [theme.breakpoints.up("md")]: {
                color: theme.palette.primary.main,
            },
        },
        "&__four": {
            color: theme.palette.primary.main,
            [theme.breakpoints.up("md")]: {
                color: theme.palette.secondary.main,
            },
        },
    },
    pitchContent: {
        padding: theme.spacing(1, 3),

        [theme.breakpoints.up("sm")]: {
            padding: theme.spacing(1, 8),
        },

        [theme.breakpoints.up("md")]: {
            padding: theme.spacing(1, 10),
        },
    },
}));
