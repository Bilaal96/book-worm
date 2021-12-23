import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    bookListItem: {
        overflow: "hidden", // Prevent text and image overflow
        cursor: "pointer",
        transition: "all 0.2s ease",

        "&:hover": {
            color: theme.palette.secondary.main,
            transform: "scale(1.02)",
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
}));
