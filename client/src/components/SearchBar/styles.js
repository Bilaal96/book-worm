import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    // Parent Container
    searchBar: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: theme.spacing(2, 0),

        [theme.breakpoints.up("sm")]: {
            flexDirection: "row",
            margin: theme.spacing(4, 0),
        },
    },
    // Contains icon and input field
    searchBox: {
        width: "100%",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing(1),

        color: "#777",
        backgroundColor: theme.palette.common.subtleWhite,
        opacity: 0.7,
        transition: "opacity 0.3s ease",

        borderRadius: "4px",
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,

        "&:focus-within": {
            // i.e. on searchInput focus, style searchBox
            border: `1px solid ${theme.palette.secondary.main}`,
            borderBottom: "none",
            opacity: 0.9,
        },

        [theme.breakpoints.up("sm")]: {
            width: "500px", // fixed width
            borderRadius: "4px",
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,

            "&:focus-within": {
                // i.e. on searchInput focus, style searchBox
                border: `1px solid ${theme.palette.secondary.main}`,
                borderRight: "none",
            },
        },
    },
    searchIcon: {
        height: "100%",
        pointerEvents: "none",
    },
    searchInput: {
        width: "100%",
        padding: theme.spacing(0, 0, 0, 1), // left
    },
    // Button
    searchSubmit: {
        width: "100%",
        height: "40px",
        color: theme.palette.common.subtleWhite,
        fontWeight: "bold",

        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,

        // Override disabled button styles
        "&.Mui-disabled": {
            backgroundColor: theme.palette.secondary.dark,
            color: theme.palette.common.subtleWhite,
        },

        [theme.breakpoints.up("sm")]: {
            width: "unset", // return to default MUI Button width
            height: "50px",
            padding: theme.spacing(1.5, 2),

            borderRadius: "4px",
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
        },
    },
}));
