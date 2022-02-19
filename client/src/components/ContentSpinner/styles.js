import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: theme.spacing(3), // Space between spinner & text
    },
    // By default MUIs Backdrop is position: fixed - and takes up entire viewport
    backdropFixed: {
        marginTop: theme.header.height, // header offset
        zIndex: theme.zIndex.fixedSpinner,
    },
    // Customised to position relative to parent container
    // To use backdropAbsolute, pass prop: contained
    backdropAbsolute: {
        position: "absolute",
        inset: theme.spacing(2), // shorthand for t / r / b / l
        borderRadius: ({ rounded }) => (rounded ? "4px" : "0px"),
    },
    spinner: {},
    spinnerText: {
        color: theme.palette.common.subtleWhite,
    },
}));
