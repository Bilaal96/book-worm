import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    appBar: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: theme.header.height,
    },
    toolBar: {
        padding: theme.spacing(1, 2),
        [theme.breakpoints.up("md")]: {
            padding: theme.spacing(1, 3),
        },
    },
}));
