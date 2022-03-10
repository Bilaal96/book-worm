import { makeStyles } from "@material-ui/core";

// Custom breakpoint & media query - between MUI's "sm" & "md" breakpoints
// NOTE: customBreakpoint is exported for the placement of MUI Tooltips
export const customBreakpoint = "(min-width:780px)";
const mediaQueryBetweenSmAndMd = `@media ${customBreakpoint}`;

export default makeStyles((theme) => ({
    paper: {
        display: "flex",
        flexDirection: "column",
        overflow: "hidden", // Prevent children from leaking out

        // Custom media query
        [mediaQueryBetweenSmAndMd]: {
            display: "grid",
            gridTemplateColumns: "max-content repeat(11, 1fr)", // 12 cols
            gridTemplateRows: "0.4fr repeat(2, 1fr)", // 3 rows
        },
    },
    bookHeading: {
        height: "max-content",
        padding: theme.spacing(2),
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        borderBottom: `2px solid ${theme.palette.secondary.light}`,

        // Custom media query
        [mediaQueryBetweenSmAndMd]: {
            // Grid-item #1 (container: paper)
            gridColumn: "4 / -1",
        },
    },
    thumbnailContainer: {
        display: "flex",
        justifyContent: "center",
        backgroundColor: "rgba(195, 212, 216, 0.6)",

        // Custom media query
        [mediaQueryBetweenSmAndMd]: {
            // Grid-item #2 (container: paper)
            gridColumn: "span 2",
            gridRow: "1 / 4",
            borderRight: `2px solid ${theme.palette.secondary.light}`,
        },
    },
    thumbnail: {
        // Flex-item #1 (container: thumbnailContainer)
        maxWidth: "100%", // can only be as wide as container
        height: "300px",
        objectFit: "contain",
    },
    actionsBar: {
        padding: theme.spacing(1, 2),
        backgroundColor: theme.palette.accent.main,
        borderBottom: `2px solid ${theme.palette.primary.light}`,

        // Custom media query
        [mediaQueryBetweenSmAndMd]: {
            // Grid-item #3 (container: paper)
            width: "100%",
            gridColumn: "1 / 2",
            gridRow: "1 / span 3",

            padding: theme.spacing(2, 1),
            border: "unset",
            borderRight: `2px solid ${theme.palette.primary.light}`,
        },
    },
    actions: {
        // Flex-container
        display: "flex",
        gap: theme.spacing(1),

        // Custom media query
        [mediaQueryBetweenSmAndMd]: {
            // Display actions vertically
            flexDirection: "column",
        },
    },
    bookInfo: {
        // Grid-item #4 (container: paper)
        padding: theme.spacing(2),

        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(1),

        // Custom media query
        [mediaQueryBetweenSmAndMd]: {
            gridColumn: "4 / -1",
            gridRow: "span 2",
        },
    },
    eBookChip: {
        width: "max-content",
        marginTop: "0.6rem",
    },
}));
