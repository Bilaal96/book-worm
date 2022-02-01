import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    bookListItem: {
        overflow: "hidden", // Prevent text and image overflow
        transition: "all 0.2s ease",

        "&:hover": {
            color: theme.palette.secondary.main,
            transform: ({ isDeletable }) =>
                isDeletable ? "scale(1)" : "scale(1.01)",
        },
    },
    bookDetails: {
        cursor: "pointer",

        "&:hover": {
            // Style background of child element with className: bookInfo
            "& $bookInfo": { backgroundColor: "#ECE3F0" },
        },
    },
    bookCover: {
        width: "100%",
        // If image is showing, it determines the height of the booklist
        // Otherwise bookInfo's implicit "max-content" value determines the height
        height: "200px",
        backgroundImage: ({ bookThumbnail }) => `url(${bookThumbnail})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
    },
    // Container for title, authors, description etc.
    bookInfo: {
        padding: theme.spacing(2),
        transition: "all 0.2s ease",
    },
    title: {
        fontSize: "1.2rem",
        [theme.breakpoints.up("md")]: {
            fontSize: "1.4rem",
        },
    },
    authors: {
        fontSize: "1rem",
        [theme.breakpoints.up("md")]: {
            fontSize: "1.2rem",
        },
    },
    description: {
        overflow: "hidden",
    },
    deleteButton: {
        transition: "all 0.2s ease",

        "&:hover": {
            color: "#AA1945",
            backgroundColor: "#F1CED4",
        },
    },
}));
