import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    accordion: {
        margin: theme.spacing(0, 0, 2),
        borderRadius: "3px",
    },
    accordionSummary: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        borderTopLeftRadius: "4px",
        borderTopRightRadius: "4px",
        borderBottomLeftRadius: ({ expanded }) => (expanded ? "0" : "4px"),
        borderBottomRightRadius: ({ expanded }) => (expanded ? "0" : "4px"),
    },
    expandIcon: {
        color: theme.palette.primary.contrastText,
    },
    accordionDetails: {
        display: "block",
        padding: theme.spacing(1, 2, 2),
    },
    textField: {
        margin: theme.spacing(1, 0),
    },
    formControls: {
        margin: theme.spacing(1, 0, 0),
        display: "flex",
        justifyContent: "flex-end",
        gap: theme.spacing(1),
    },
}));
