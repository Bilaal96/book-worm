import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    paper: {
        display: "flex",
        flexDirection: "column",
        padding: theme.spacing(2),
        gap: theme.spacing(2),
    },
    editForm: {
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
    },
    actions: {
        display: "flex",
        gap: theme.spacing(1),
        justifyContent: ({ editMode }) =>
            editMode ? "flex-end" : "flex-start",
    },
}));
