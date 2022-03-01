import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    paper: {
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        overflow: "hidden",
        backgroundColor: theme.palette.common.white,
        transition: "all 0.2s ease",
    },
    details: {
        // Flex-item #1 (container: paper)
        flex: "0 1 100%",
        padding: theme.spacing(2),
        backgroundColor: theme.palette.accent.light,
        transition: "all 0.2s ease",
        cursor: "pointer",

        // List immediate children vertically with spacing
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(1),

        // Clickable overlay with user prompt
        // Shown on hover/focus/active events (event order matters)
        "&::before": {
            content: ({ modal }) => `'${modal ? "Add book" : "View list"}'`,
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            cursor: "pointer",
            opacity: 0,
            transition: "opacity 0.2s ease",

            // Style overlay content (a user prompt)
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "28px",
            color: theme.palette.common.subtleWhite,
        },

        // Show overlay
        // NOTE: event order matters
        "&:hover, &:focus, &:active": {
            outline: "none", // overlay shown in place of outline
            "&::before": { opacity: 1 },
        },

        // Slightly darker background on focus (to distinguish from hover)
        "&:focus::before": { backgroundColor: "rgba(0,0,0,0.9)" },
    },
    title: {
        // Flex-item #1 (container: details)
        color: theme.palette.secondary.main,
    },
    description: {
        // Flex-item #2 (container: details)
        lineHeight: 1.4,
    },
    actions: {
        // Flex-item #2 (container: paper)
        height: "100%",
        padding: theme.spacing(0, 1),
        borderLeft: `1px solid ${theme.palette.primary.light}`,

        // Center children
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

        // Additional padding and thicker border on wider screens
        [theme.breakpoints.up("sm")]: {
            padding: theme.spacing(0, 2),
            borderLeft: `2px solid ${theme.palette.primary.light}`,
        },
    },
    deleteButton: {
        // Flex-item #1 (container: actions)
        transition: "all 0.2s ease",

        "&:hover": {
            color: theme.palette.error.main,
            backgroundColor: theme.palette.error.light,
        },
    },
}));
