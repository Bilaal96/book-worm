import PropTypes from "prop-types";

// Components
import { Paper, Grid, Typography, Hidden } from "@material-ui/core";

// Utils
import {
    getBookThumbnail,
    getBookBrief,
    formatAuthors,
} from "utils/book-data-display";

import useStyles from "./styles.js";

const BookApiListItem = ({ book, onClick: clickHandler }) => {
    const { volumeInfo, searchInfo } = book;

    // if available get book cover, if not use fallback image
    const bookThumbnail = getBookThumbnail(volumeInfo.imageLinks);
    // Make bookThumbnail accessible in makeStyles via props
    const styleProps = { bookThumbnail };
    const classes = useStyles(styleProps);

    // Format string of Authors for this book
    const formattedAuthors = formatAuthors(volumeInfo.authors);

    // Get book brief (a short preview/snippet about the book)
    const bookBrief = getBookBrief(searchInfo);

    return (
        <Grid item xs={12} onClick={clickHandler}>
            <Paper className={classes.bookListItem} elevation={2}>
                <Grid container>
                    {/* Thumbnail - Book Cover */}
                    <Hidden xsDown>
                        <Grid item sm={3}>
                            <div
                                className={classes.bookCover}
                                title={`Book cover for: ${volumeInfo.title}`}
                            />
                        </Grid>
                    </Hidden>

                    {/* Book Info */}
                    <Grid className={classes.bookInfo} item sm={9}>
                        {/* Title */}
                        <Typography
                            className={classes.title}
                            component="h2"
                            variant="h2"
                        >
                            {volumeInfo?.title
                                ? `${volumeInfo.title}`
                                : "Unknown Title"}
                        </Typography>

                        {/* Authors */}
                        <Typography
                            className={classes.authors}
                            component="h3"
                            color="textSecondary"
                        >
                            {formattedAuthors}
                        </Typography>

                        {/* Description */}
                        <Typography
                            className={classes.description}
                            component="p"
                            variant="body1"
                            dangerouslySetInnerHTML={{ __html: bookBrief }}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    );
};

BookApiListItem.propTypes = {
    book: PropTypes.object.isRequired,
};

export default BookApiListItem;
