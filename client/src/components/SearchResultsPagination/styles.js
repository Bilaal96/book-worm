import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    pagination: {
        maxWidth: "max-content",
        margin: theme.spacing(3, "auto"),
        padding: theme.spacing(2),
        backgroundColor: "rgba(255,255,255, 0.5)",
        borderRadius: "40px",

        [theme.breakpoints.up("sm")]: {
            margin: theme.spacing(4, "auto"),
        },
    },
}));
