import PropTypes from "prop-types";

// Components
import {
    Button,
    Grid,
    IconButton,
    Paper,
    Typography,
    Tooltip,
} from "@material-ui/core";

// Icons
import {
    AddCircleOutline,
    Delete,
    Subject,
    Visibility,
    VisibilityOff,
} from "@material-ui/icons";

import useStyles from "./styles.js";

/**
 * BookCardHorizontal is a visual representation of a Book from the Google Books API.
 * It is a horizontal rectangle shape (hence the name) and is best thought of as a variant of BookCardVertical.
 * The custom styles applied to BookCardHorizontal resemble  BookCardVertical; such that it appears as if the orientation of BookCardVertical has been changed.
 * This is purely for responsive design purposes, thus BookCardHorizontal/BookCardVertical share the same props
 
 * @param { Object } book - An object representing a single book from the Google Books API.  

 * @param { Object } bookCardContents - Formatted data derived from the aforementioned book object.

 * @param { Function } onBookDetailsClick - handles onClick event of "Details" button in BookCardVertical/Horizontal; navigates to BookDetails page.

 * @param { Function } [onBookDelete]
 * Handles onClick event of "Delete" button in BookCardVertical/Horizontal; removes a book from a user-owned booklist.
 * NOTE: Delete button is only rendered if onBookDelete prop is received as a function. 

 * @param { Function } openAddToBooklistModal - sets "showAddToBooklistModal" state in BookCard to true
 * @param { Function } openConfirmDeletionModal - sets "showConfirmDeletionModal" state in BookCard to true
 */
const BookCardHorizontal = ({
    book,
    bookCardContents,
    onBookDetailsClick: handleBookDetailsClick,
    onBookDelete: handleBookDelete,
    openAddToBooklistModal,
    openConfirmDeletionModal,
}) => {
    const classes = useStyles();

    // Google Books API data
    const { accessInfo, volumeInfo } = book;
    const { thumbnail, authors, brief } = bookCardContents;

    // List item representing a single book
    return (
        <Grid item xs={12}>
            <Paper className={classes.paper} elevation={2}>
                {/* Book Cover (Thumbnail) */}
                <div className={classes.thumbnailContainer}>
                    <img
                        src={thumbnail}
                        className={classes.thumbnail}
                        title={`Book cover for: ${volumeInfo.title}`}
                        alt={`Book cover for: ${volumeInfo.title}`}
                    />
                </div>

                {/* Book Overview */}
                <div className={classes.bookOverview}>
                    {/* Headings - Title and Authors */}
                    <div className={classes.headingsContainer}>
                        <Typography
                            className={classes.title}
                            component="h2"
                            variant="h5"
                            gutterBottom
                        >
                            {volumeInfo?.title
                                ? `${volumeInfo.title}`
                                : "Unknown Title"}
                        </Typography>

                        <Typography
                            className={classes.authors}
                            component="h3"
                            variant="h6"
                            color="textSecondary"
                        >
                            {authors}
                        </Typography>
                    </div>

                    {/* Book summary and link to details page */}
                    <div className={classes.detailsContainer}>
                        {/* Short snippet about/preview of a book */}
                        <Typography
                            className={classes.bookBrief}
                            variant="body1"
                            color="textSecondary"
                            component="p"
                            dangerouslySetInnerHTML={{ __html: brief }}
                        />

                        {/* Navigates to BookDetails page */}
                        <Button
                            className={classes.detailsButton}
                            onClick={handleBookDetailsClick(book.id)}
                            variant="outlined"
                            color="secondary"
                            startIcon={<Subject />}
                        >
                            Details
                        </Button>
                    </div>
                </div>

                {/* Actions performable on a book */}
                <div className={classes.actionsContainer}>
                    {/* Add to a user's Booklist */}
                    <Tooltip
                        title="Add to another Booklist"
                        aria-label="Add to another Booklist"
                        placement="left"
                    >
                        <IconButton onClick={openAddToBooklistModal}>
                            <AddCircleOutline />
                        </IconButton>
                    </Tooltip>

                    {/* View book preview on Google Books website */}
                    {/* Availability of preview link is determined using API response and then reflected in UI */}
                    {accessInfo && accessInfo.viewability !== "NO_PAGES" ? (
                        <Tooltip
                            title="Google Books Preview"
                            aria-label="Preview book on Google Books website"
                            placement="left"
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
                            placement="left"
                        >
                            <IconButton>
                                <VisibilityOff color="disabled" />
                            </IconButton>
                        </Tooltip>
                    )}

                    {/* Delete from a user's booklist */}
                    {/* Only rendered if a handleBookDelete method is received as prop */}
                    {typeof handleBookDelete === "function" && (
                        <Tooltip
                            title="Delete from list"
                            aria-label="Delete book from booklist"
                            placement="left"
                        >
                            <IconButton
                                className={classes.deleteButton}
                                onClick={openConfirmDeletionModal}
                            >
                                <Delete />
                            </IconButton>
                        </Tooltip>
                    )}
                </div>
            </Paper>
        </Grid>
    );
};

BookCardHorizontal.propTypes = {
    book: PropTypes.object.isRequired,
    bookCardContents: PropTypes.object.isRequired,
    onBookDetailsClick: PropTypes.func.isRequired,
    onBookDelete: PropTypes.func,
    openAddToBooklistModal: PropTypes.func.isRequired,
    openConfirmDeletionModal: PropTypes.func.isRequired,
};

export default BookCardHorizontal;
