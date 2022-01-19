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
            backgroundColor: "#ECE3F0",
        },
    },
    deleteButton: {
        transition: "all 0.2s ease",
        "&:hover": {
            color: "#AA1945",
            backgroundColor: "#F1CED4",
        },
    },
}));
