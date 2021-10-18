import PropTypes from "prop-types";

// Components
import { Paper, Typography, IconButton } from "@material-ui/core";
import BookRating from "components/BookRating/BookRating";

// Icons
import { AddCircleOutline, Visibility } from "@material-ui/icons";
import { ReactComponent as GooglePlay } from "assets/google-play-icon.svg";

// Images
import fallbackThumbnail from "assets/no-book-cover.jpg";

import useStyles from "./styles";

/**
 * NOTE for Potential Improvement:
 * Use grid-template-areas to adjust layout per screen size
 */
const BookDetailsHead = ({ book }) => {
    const { saleInfo, volumeInfo } = book;

    // if available get book cover, if not use fallback image
    const bookThumbnail = volumeInfo.imageLinks
        ? volumeInfo.imageLinks?.thumbnail
        : fallbackThumbnail;

    // Make bookThumbnail accessible in makeStyles via props
    const styleProps = {
        bookThumbnail,
    };

    const classes = useStyles(styleProps);

    return (
        <Paper className={classes.cssLayoutContainer} elevation={2}>
            {/* Actions */}
            <div className={classes.bookActions}>
                <IconButton className={classes.iconButtons}>
                    <AddCircleOutline />
                </IconButton>
                <IconButton
                    className={classes.iconButtons}
                    component="a"
                    href={volumeInfo.previewLink}
                    target="_blank"
                    disabled={!volumeInfo.previewLink}
                >
                    <Visibility />
                </IconButton>

                {/* Google Play Store
                 * Link via -> accessInfo.webReaderLink
                 * NOTE: Link does not always exist -> sometimes not found
                 */}
                <IconButton
                    className={classes.iconButtons}
                    // component="a"
                    // href={volumeInfo.previewLink}
                    // target="_blank"
                >
                    <GooglePlay className={classes.googlePlayIcon} />
                </IconButton>
            </div>

            {/* Book Cover */}
            <div
                className={classes.bookCover}
                title={`Book cover for: ${volumeInfo.title}`}
            />

            {/** Main Information
             * NOTE Improvement: 
                - if saleInfo.isEbook === true -> show MUI Chip component (like a tag) -> "Available as E-book"
             */}
            <div className={classes.bookInfo}>
                <Typography variant="h5" component="h1">
                    {volumeInfo.title}
                </Typography>
                <Typography variant="subtitle1" component="h2">
                    {volumeInfo.subtitle}
                </Typography>
                <Typography variant="subtitle2">
                    {volumeInfo.authors}
                </Typography>
                <Typography variant="body1">
                    {volumeInfo.publishedDate}
                </Typography>
                {/**
                 * BookRating component - Star Rating
                 https://v4.mui.com/components/rating/#half-ratings
                 */}
                <BookRating
                    avgRating={volumeInfo.averageRating}
                    count={volumeInfo.ratingsCount}
                />

                {/** SalesInfo 
                  * NOTE improvement:
                  * Check if "saleability" === "FOR_SALE" OR "NOT_FOR_SALE"
                  * If "FOR_SALE", show data from saleInfo:
                    - buyLink -> as href of button/link -> GET/BUY BOOK
                    - retailPrice
                        - currencyCode -> NOTE: use package to parse as currency symbol
                        - amount
                  */}
                <Typography variant="body2">
                    isEbook:
                    {saleInfo.isEbook
                        ? "Available as E-Book"
                        : "Not available as E-book"}
                </Typography>
                <Typography variant="body2">{saleInfo.saleability}</Typography>
                {saleInfo.retailPrice && (
                    <Typography variant="body2">
                        {saleInfo.retailPrice.amount}
                        {` (${saleInfo.retailPrice.currencyCode})`}
                    </Typography>
                )}
            </div>
        </Paper>
    );
};

BookDetailsHead.propTypes = {
    book: PropTypes.object.isRequired,
};

export default BookDetailsHead;
