import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    searchBar: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: theme.spacing(4, 0),

        [theme.breakpoints.up("sm")]: {
            flexDirection: "row",
        },
    },
    searchBox: {
        width: "100%",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing(1),
        border: "1px solid #aaa",
        borderRadius: "4px",
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        color: "#aaa",

        [theme.breakpoints.up("sm")]: {
            width: "500px",
            borderRadius: "4px",
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
        },
    },
    searchIcon: {
        height: "100%",
        marginRight: theme.spacing(1),
        pointerEvents: "none",
    },
    searchInput: {
        width: "100%",
        padding: 0,
    },
    searchSubmit: {
        width: "100%",
        height: "40px",
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        fontWeight: "bold",

        [theme.breakpoints.up("sm")]: {
            width: "unset",
            height: "50px",
            borderRadius: "4px",
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            padding: theme.spacing(1.5, 2),
        },
    },
}));
