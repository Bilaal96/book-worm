import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    masterListItem: {
        padding: theme.spacing(2),
        cursor: "pointer",
        transition: "all 0.2s ease",

        "&:hover": {
            color: theme.palette.secondary.main,
            transform: "scale(1.02)",
        },
    },
}));
