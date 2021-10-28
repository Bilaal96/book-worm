import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    formWrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: theme.spacing(2),

        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(16, "auto"),
        },
    },
    paper: {
        padding: theme.spacing(2),
    },
    title: { margin: theme.spacing(2, 2, 4, 2) },
}));
