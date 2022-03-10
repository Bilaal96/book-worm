import PropTypes from "prop-types";
import { useMediaQuery } from "@material-ui/core";

// Components
import {
    Paper,
    Typography,
    IconButton,
    Tooltip,
    Chip,
    Avatar,
} from "@material-ui/core";
import BookRating from "components/BookRating/BookRating";

// Icons
import {
    AddCircleOutline,
    Visibility,
    VisibilityOff,
} from "@material-ui/icons";

// Utils
import { getBookThumbnail } from "utils/book-data-display";

import useStyles, { customBreakpoint } from "./styles";

const BookDetailsHead = ({ book, setOpenModal }) => {
    const classes = useStyles();
    const matchesCustomBreakpoint = useMediaQuery(customBreakpoint);
    const tooltipPlacement = matchesCustomBreakpoint ? "right" : "top-start";

    const { accessInfo, saleInfo, volumeInfo } = book;

    // if available get book cover, if not use fallback image
    const bookThumbnail = getBookThumbnail(volumeInfo.imageLinks);

    return (
        <Paper className={classes.paper} elevation={6}>
            <div className={classes.bookHeading}>
                {/* Title */}
                <Typography variant="h5" component="h1">
                    {volumeInfo.title}
                </Typography>

                {/* Subtitle (if available) */}
                {volumeInfo.subtitle && (
                    <Typography variant="subtitle1" component="h2">
                        {volumeInfo.subtitle}
                    </Typography>
                )}
            </div>

            {/* Book Cover (Thumbnail) */}
            <div className={classes.thumbnailContainer}>
                <img
                    src={bookThumbnail}
                    className={classes.thumbnail}
                    title={`Book cover for: ${volumeInfo.title}`}
                    alt={`Book cover for: ${volumeInfo.title}`}
                />
            </div>

            {/* Actions performable on a book */}
            <div className={classes.actionsBar}>
                <div className={classes.actions}>
                    {/* Add to a user's Booklist */}
                    <Tooltip
                        title="Add to a Booklist"
                        aria-label="Add to a Booklist"
                        placement={tooltipPlacement}
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
                            placement={tooltipPlacement}
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
                            placement={tooltipPlacement}
                        >
                            <IconButton>
                                <VisibilityOff color="disabled" />
                            </IconButton>
                        </Tooltip>
                    )}
                </div>
            </div>

            <div className={classes.bookInfo}>
                {/* Author(s) */}
                <Typography component="p" variant="subtitle1">
                    <strong>Author(s): </strong>
                    {volumeInfo.authors ? (
                        `${volumeInfo.authors.join(", ")}`
                    ) : (
                        <em>unknown</em>
                    )}
                </Typography>

                {/* Publisher & Date Published */}
                <Typography component="p" variant="body1">
                    <strong>Published by: </strong>

                    {/* Publisher (rendered if available) */}
                    {volumeInfo.publisher ? (
                        volumeInfo.publisher
                    ) : (
                        <em>unknown</em>
                    )}

                    {/* Date published (rendered if available) */}
                    {volumeInfo.publisher &&
                        volumeInfo.publishedDate !== undefined &&
                        ` (${volumeInfo.publishedDate})`}
                </Typography>

                {/** Star Rating - out of 5 */}
                <BookRating
                    avgRating={volumeInfo.averageRating}
                    count={volumeInfo.ratingsCount}
                />

                {/* Displays if book is E-book or not */}
                <Chip
                    className={classes.eBookChip}
                    avatar={<Avatar>{saleInfo.isEbook ? "✔" : "❌"}</Avatar>}
                    label={
                        saleInfo.isEbook ? "E-Book" : "Not available as E-book"
                    }
                    color={saleInfo.isEbook ? "primary" : "default"}
                    variant="outlined"
                />
            </div>
        </Paper>
    );
};

BookDetailsHead.propTypes = {
    book: PropTypes.object.isRequired,
};

export default BookDetailsHead;
