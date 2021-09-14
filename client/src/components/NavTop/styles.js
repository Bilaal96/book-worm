import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    nav: {
        height: "100%",
        display: "flex",
        gap: theme.spacing(1),
    },
    navLink: {
        color: "#fff",
        padding: theme.spacing(1, 1.8),
    },
}));
