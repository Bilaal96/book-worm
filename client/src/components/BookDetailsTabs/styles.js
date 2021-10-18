import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: "100%",
        backgroundColor: theme.primary,
    },
    cssLayoutContainer: {
        padding: theme.spacing(2),
    },
}));
