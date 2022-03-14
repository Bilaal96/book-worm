import PropTypes from "prop-types";

// Components
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
    AddCircleOutline,
    Visibility,
    Subject,
    VisibilityOff,
    Delete,
} from "@material-ui/icons";

import useStyles from "./styles";

/**
 * Customised headers for BookCard
 * Overflowing long text is truncated and ellipsis is displayed - via noWrap prop
 * Truncating overflowing text (show ellipsis): https://stackoverflow.com/questions/61675880/react-material-ui-cardheader-title-overflow-with-dots
 * NOTE: Full header text is revealed (on hover) via MUI Tooltip
 */
const CardTitle = ({ text }) => (
    <Tooltip title={text} placement="bottom-start">
        <Typography
            noWrap
            gutterBottom
            variant="h6"
            component="h2"
            aria-label={text}
        >
            {text}
        </Typography>
    </Tooltip>
);

const CardSubheader = ({ text }) => (
    <Tooltip title={text} placement="bottom-start">
        <Typography
            noWrap
            variant="body1"
            component="h3"
            color="textSecondary"
            aria-label={text}
        >
            {text}
        </Typography>
    </Tooltip>
);

/**
 * BookCardVertical is a visual representation of a Book from the Google Books API.
 * It is a vertical rectangle shape (hence the name) and makes use of MUI Card components to display information about a single book.
 
 * @param { Object } book - An object representing a single book from the Google Books API.  

 * @param { Object } bookCardContents - Formatted data derived from the aforementioned book object.

 * @param { Function } onBookDetailsClick - handles onClick event of "Details" button in BookCardVertical/Horizontal; navigates to BookDetails page.

 * @param { Function } [onBookDelete]
 * Handles onClick event of "Delete" button in BookCardVertical/Horizontal; removes a book from a user-owned booklist.
 * NOTE: Delete button is only rendered if onBookDelete prop is received as a function. 

 * @param { Function } openAddToBooklistModal - sets "showAddToBooklistModal" state in BookCard to true
 * @param { Function } openConfirmDeletionModal - sets "showConfirmDeletionModal" state in BookCard to true
 */
const BookCardVertical = ({
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

    // Display overview of a book
    return (
        <Card className={classes.card} elevation={2}>
            <CardHeader
                className={classes.header}
                title={<CardTitle text={volumeInfo.title} />}
                subheader={<CardSubheader text={authors} />}
            />

            <CardMedia
                className={classes.media}
                image={thumbnail}
                title={`Book cover for: ${volumeInfo.title}`}
            />

            {/* Action bar - renders a set of actions available for BookCard */}
            <CardActions className={classes.actionsOne}>
                {/* Add to a user's Booklist */}
                <Tooltip
                    title="Add to a Booklist"
                    aria-label="Add to a Booklist"
                    placement="top-start"
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
                        placement="top-start"
                    >
                        <IconButton
                            component="a"
                            href={`${volumeInfo.previewLink}&printsec=frontcover`}
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

                {/* Only rendered if a handleBookDelete method is received as prop */}
                {typeof handleBookDelete === "function" && (
                    <Tooltip
                        title="Delete from list"
                        aria-label="Delete book from booklist"
                        placement="top-start"
                    >
                        <IconButton onClick={openConfirmDeletionModal}>
                            <Delete />
                        </IconButton>
                    </Tooltip>
                )}
            </CardActions>

            {/* Brief overview of book */}
            <CardContent className={classes.content}>
                <Typography
                    className={classes.description}
                    variant="body2"
                    color="textSecondary"
                    component="p"
                    // https://stackoverflow.com/questions/19266197/reactjs-convert-html-string-to-jsx
                    dangerouslySetInnerHTML={{ __html: brief }}
                />
            </CardContent>

            {/* Link to BookDetails page */}
            <CardActions className={classes.actionsTwo}>
                <Button
                    onClick={handleBookDetailsClick(book.id)}
                    variant="outlined"
                    color="secondary"
                    startIcon={<Subject />}
                    fullWidth
                >
                    Details
                </Button>
            </CardActions>
        </Card>
    );
};

BookCardVertical.propTypes = {
    book: PropTypes.object.isRequired,
    bookCardContents: PropTypes.object.isRequired,
    onBookDetailsClick: PropTypes.func.isRequired,
    onBookDelete: PropTypes.func,
    openAddToBooklistModal: PropTypes.func.isRequired,
    openConfirmDeletionModal: PropTypes.func.isRequired,
};

export default BookCardVertical;
