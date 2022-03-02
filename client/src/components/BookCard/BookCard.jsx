import PropTypes from "prop-types";
import { useState } from "react";
import { useHistory } from "react-router-dom";

// Components
import AddToBooklistModal from "components/AddToBooklistModal/AddToBooklistModal";
import {
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    CardActions,
    Tooltip,
    Typography,
    Button,
    IconButton,
} from "@material-ui/core";

// Icons
import {
    // FavoriteBorder,
    // Favorite,
    AddCircleOutline,
    Visibility,
    Subject,
    VisibilityOff,
} from "@material-ui/icons";

// Utils
import {
    getBookThumbnail,
    getBookBrief,
    formatAuthors,
} from "utils/book-data-display";

import useStyles from "./styles";

/**
 * Customised headers for BookCard
 * Overflowing long text is truncated and ellipsis is displayed - via noWrap prop
 * Truncating overflowing text (show ellipsis): https://stackoverflow.com/questions/61675880/react-material-ui-cardheader-title-overflow-with-dots
 * NOTE: Full header text is revealed (on hover) via MUI Tooltip
 */
const CustomHeader = (title) => (
    <Tooltip title={title} placement="bottom-start">
        <Typography
            noWrap
            gutterBottom
            variant="h6"
            component="h2"
            aria-label={title}
        >
            {title}
        </Typography>
    </Tooltip>
);

const CustomSubheader = (subheader) => (
    <Tooltip title={subheader} placement="bottom-start">
        <Typography
            noWrap
            variant="body1"
            component="h3"
            color="textSecondary"
            aria-label={subheader}
        >
            {subheader}
        </Typography>
    </Tooltip>
);

const BookCard = ({ book }) => {
    const classes = useStyles();
    const history = useHistory();
    const { accessInfo, volumeInfo, searchInfo } = book;

    // Controls whether AddToBooklistModal is showing or not
    const [openModal, setOpenModal] = useState(false);

    // Get and format the following data if available
    // -- If available get book cover, if not use fallback image
    const bookThumbnail = getBookThumbnail(volumeInfo.imageLinks);
    // -- Format string of Authors for this book
    const formattedAuthors = formatAuthors(volumeInfo.authors);
    // -- Get book brief (a short preview/snippet about the book)
    const bookBrief = getBookBrief(searchInfo);

    // Navigates to BookDetails page
    // NOTE: func is curried because it accepts an argument
    const goToBookDetailsRoute = (bookId) => (e) =>
        history.push(`/books/${bookId}`);

    return (
        <>
            {/* Modal rendered on "Add to Booklist" button click (see below) */}
            <AddToBooklistModal
                book={book}
                openModal={openModal}
                setOpenModal={setOpenModal}
            />

            {/* Display overview of a book */}
            <Card className={classes.card} elevation={2}>
                {/* Container for CardHeader & CardMedia - Links to BookDetails page */}
                <div
                    className={classes.linkToDetails}
                    onClick={goToBookDetailsRoute(book.id)}
                    tabIndex="0"
                    aria-label="View book details"
                >
                    <CardHeader
                        className={classes.header}
                        title={CustomHeader(volumeInfo.title)}
                        subheader={CustomSubheader(formattedAuthors)}
                    />
                    <CardMedia
                        className={classes.media}
                        image={bookThumbnail}
                        title={`Book cover for: ${volumeInfo.title}`}
                    />
                </div>

                {/* Action bar - renders a set of actions available for BookCard */}
                <CardActions className={classes.actionsOne}>
                    {/* Add to a user's Booklist */}
                    <Tooltip
                        title="Add to a Booklist"
                        aria-label="Add to a Booklist"
                        placement="top-start"
                    >
                        <IconButton onClick={() => setOpenModal(true)}>
                            <AddCircleOutline />
                        </IconButton>
                    </Tooltip>

                    {/* View book preview on Google Books website */}
                    {/* Availability of preview link is determined using API response and then reflected in UI */}
                    {accessInfo && accessInfo.viewability !== "NO_PAGES" ? (
                        <Tooltip
                            title="Google Books Preview"
                            aria-label="Preview book on Google Books website"
                            placement="top-start"
                        >
                            <IconButton
                                component="a"
                                href={volumeInfo.previewLink}
                                target="_blank"
                            >
                                <Visibility />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip
                            title="Preview not available"
                            aria-label="Preview not available via Google Books"
                            placement="top-start"
                        >
                            <IconButton>
                                <VisibilityOff color="disabled" />
                            </IconButton>
                        </Tooltip>
                    )}

                    {/* Potential feature (TBD) - Add to Favourites */}
                    {/* <IconButton title="Add to Favourites">
                        {false ? (
                            <Favorite color="secondary" />
                        ) : (
                            <FavoriteBorder />
                        )}
                    </IconButton> */}
                </CardActions>

                {/* Brief overview of book */}
                <CardContent className={classes.content}>
                    <Typography
                        className={classes.description}
                        variant="body2"
                        color="textSecondary"
                        component="p"
                        // https://stackoverflow.com/questions/19266197/reactjs-convert-html-string-to-jsx
                        dangerouslySetInnerHTML={{ __html: bookBrief }}
                    />
                </CardContent>

                {/* Link to BookDetails page */}
                <CardActions className={classes.actionsTwo}>
                    <Button
                        onClick={goToBookDetailsRoute(book.id)}
                        variant="outlined"
                        color="secondary"
                        startIcon={<Subject />}
                        fullWidth
                    >
                        Details
                    </Button>
                </CardActions>
            </Card>
        </>
    );
};

BookCard.propTypes = {
    book: PropTypes.object.isRequired,
};

export default BookCard;
