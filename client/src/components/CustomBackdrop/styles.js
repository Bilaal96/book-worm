import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: theme.spacing(3), // Space between spinner & text
        padding: theme.spacing(3),
    },
    // Default MUI Backdrop position is "fixed" & takes up entire viewport
    // Also used explicitly with prop: position="fixed"
    backdropFixed: {
        marginTop: theme.header.height, // header offset
        zIndex: theme.zIndex.fixedSpinner,
    },
    // Used with prop: position="static"
    backdropStatic: {
        position: "static",
        padding: theme.spacing(10, 2),
    },
    // Relative to closest positioned parent container (with relative/absolute positioning)
    // Used with prop: position="absolute"
    backdropAbsolute: {
        position: "absolute",
        inset: theme.spacing(2), // shorthand for t / r / b / l
    },
    backdropRounded: {
        borderRadius: "4px",
    },
    spinner: {},
    spinnerText: {
        color: theme.palette.common.subtleWhite,
    },
}));
