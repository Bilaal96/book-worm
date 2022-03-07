import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    paper: {
        display: "flex",
        minHeight: "200px",
        overflow: "hidden", // Prevent text and image overflow
        transition: "all 0.2s ease",
    },
    thumbnailContainer: {
        // Flex-item #1 (container: paper)
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "200px",
        borderRight: `2px solid ${theme.palette.secondary.light}`,
    },
    thumbnail: {
        // Flex-item #1 (container: thumbnailContainer)
        maxWidth: "100%", // can only be as wide as container (200px)
        height: "100%",
        objectFit: "contain",
    },
    bookOverview: {
        // Flex-item #2 (container: paper)
        flex: "0 1 100%",

        // Flex container
        display: "flex",
        flexDirection: "column",
    },
    // Container for title & authors
    headingsContainer: {
        // Flex-item #1 (container: bookOverview)
        padding: theme.spacing(2, 2, 1),
        transition: "all 0.2s ease",
        background: theme.palette.accent.light,
        borderBottom: `2px solid ${theme.palette.secondary.light}`,
    },
    title: {},
    authors: {},
    // Container for book brief/description and link to
    detailsContainer: {
        // Flex-item #1 (container: bookOverview)
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(1.6),
        padding: theme.spacing(2),
    },
    bookBrief: {},
    detailsButton: {
        // Flex-item #2 (container: detailsContainer)
        width: "max-content",
        padding: theme.spacing(0.8, 5),
    },
    actionsContainer: {
        // Flex-item #3 (container: paper)
        padding: theme.spacing(1, 2),
        borderLeft: `2px solid ${theme.palette.primary.light}`,

        // Center children
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.palette.accent.main,
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
