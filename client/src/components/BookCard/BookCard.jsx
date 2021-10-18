import PropTypes from "prop-types";
import { Link, useRouteMatch } from "react-router-dom";

// Components
import {
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    IconButton,
} from "@material-ui/core";

// Images
import fallbackThumbnail from "assets/no-book-cover.jpg";

// Icons
import {
    FavoriteBorder,
    Favorite,
    AddCircleOutline,
    RemoveCircle,
    Visibility,
    Subject,
} from "@material-ui/icons";

import useStyles from "./styles";

const BookCard = ({ book }) => {
    const classes = useStyles();
    const match = useRouteMatch();

    const { id, volumeInfo, searchInfo } = book;

    // if available get book cover, if not use fallback image
    const bookThumbnail = volumeInfo.imageLinks
        ? volumeInfo.imageLinks?.thumbnail
        : fallbackThumbnail;

    const bookBrief = `<strong>Brief: </strong>${
        searchInfo
            ? searchInfo.textSnippet
            : "<em>No description available</em>"
    }`;

    /** Consideration:
     *! Alternate solution for object's with properties that don't exist (e.g. no
     *! author or description) is to filter them out, removing them from the output
     */
    const getSubheader = (content) => (
        <Typography
            noWrap
            variant="body1"
            component="h3"
            color="textSecondary"
            title={content}
        >
            {content}
        </Typography>
    );

    const getAuthors = () => {
        // An array of Authors
        const { authors } = volumeInfo;

        // No authors array present
        if (!authors) return getSubheader("Author(s) Unknown");

        // If more than 1 author, abbreviate author list
        if (authors.length > 1) {
            return getSubheader(`${authors[0]} (+${authors.length - 1} more)`);
        }

        // Return single author
        return getSubheader(authors[0]);
    };

    /**
     * --- Truncate Long CardHeader (show ellipsis) ---
     * https://stackoverflow.com/questions/61675880/react-material-ui-cardheader-title-overflow-with-dots
     */
    return (
        <Card className={classes.card} elevation={2}>
            <CardHeader
                className={classes.header}
                title={
                    <Typography
                        noWrap
                        gutterBottom
                        variant="h6"
                        component="h2"
                        title={volumeInfo.title}
                    >
                        {volumeInfo.title}
                    </Typography>
                }
                subheader={getAuthors()}
            />
            <CardMedia
                className={classes.media}
                image={bookThumbnail}
                title={`Book cover for: ${volumeInfo.title}`}
            />
            <CardActions className={classes.actionsOne}>
                {/* Add to Reading List */}
                <IconButton title="Add to Reading List">
                    {false ? <RemoveCircle /> : <AddCircleOutline />}
                </IconButton>

                {/* Add to Favourites */}
                <IconButton title="Add to Favourites">
                    {false ? (
                        <Favorite color="secondary" />
                    ) : (
                        <FavoriteBorder />
                    )}
                </IconButton>
            </CardActions>
            <CardContent className={classes.content}>
                <Typography
                    className={classes.description}
                    variant="body2"
                    color="textSecondary"
                    component="p"
                    // https://stackoverflow.com/questions/19266197/reactjs-convert-html-string-to-jsx
                    dangerouslySetInnerHTML={{
                        __html: bookBrief,
                    }}
                />
            </CardContent>

            <CardActions className={classes.actionsTwo}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Visibility />}
                    component="a"
                    href={volumeInfo.previewLink}
                    target="_blank"
                    disabled={!volumeInfo.previewLink}
                >
                    Preview
                </Button>
                <Button
                    component={Link}
                    variant="outlined"
                    color="secondary"
                    startIcon={<Subject />}
                    to={`${match.url}/${id}`}
                >
                    Details
                </Button>
            </CardActions>
        </Card>
    );
};

BookCard.propTypes = {
    book: PropTypes.object.isRequired,
};

export default BookCard;
