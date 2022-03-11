import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    // logoutButton
    button: {
        backgroundColor: ({ openModal }) => openModal && "#d47c7a",
        color: theme.palette.common.white,
        padding: theme.spacing(1, 2),
        transition: "0.3s ease",

        "&:hover": { backgroundColor: "#d47c7a" },
    },
    // logoutListItem
    listItem: {
        // rgba version of theme.palette.secondary.main
        backgroundColor: ({ openModal }) =>
            openModal && "rgba(200, 82, 80, 0.1)",
        color: ({ openModal }) =>
            openModal ? theme.palette.secondary.main : "rgba(0, 0, 0, 0.6)",

        borderTop: "2px solid rgba(0, 0, 0, 0.4)",
        transition: "all 0.3s ease",

        // Hover
        "&:hover": {
            // rgba version of theme.palette.secondary.main
            backgroundColor: "rgba(200, 82, 80, 0.1)",
            color: theme.palette.secondary.main,
        },

        // Focus
        "&:focus": {
            color: theme.palette.secondary.main,
        },
    },
    listItemIcon: {
        color: ({ openModal }) => openModal && theme.palette.secondary.main,
        transition: "all 0.3s ease",

        // listItemIcon on listItem hover / focus
        "$listItem:hover &, $listItem:focus &": {
            color: theme.palette.secondary.main,
        },
    },
}));
