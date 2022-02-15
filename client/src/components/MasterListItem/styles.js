import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    masterListItem: {
        // padding: theme.spacing(2),
        transition: "all 0.2s ease",

        "&:hover": {
            color: theme.palette.secondary.main,
            transform: ({ modal }) => (modal ? "scale(1.01)" : "scale(1)"),
        },
    },
    details: {
        padding: theme.spacing(2),
        transition: "all 0.2s ease",
        cursor: "pointer",

        "&:hover": {
            borderRadius: "4px",
            backgroundColor: theme.palette.accent.light,
        },
    },
    deleteButton: {
        transition: "all 0.2s ease",
        "&:hover": {
            color: theme.palette.error.main,
            backgroundColor: theme.palette.error.light,
        },
    },
}));
