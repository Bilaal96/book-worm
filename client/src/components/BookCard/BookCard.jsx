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

// Icons
import {
    FavoriteBorder,
    Favorite,
    AddCircleOutline,
    RemoveCircle,
    Visibility,
    Subject,
} from "@material-ui/icons";

// Utils
import {
    getBookThumbnail,
    getBookBrief,
    formatAuthors,
} from "utils/book-data-display";

import useStyles from "./styles";

const BookCard = ({ book }) => {
    const classes = useStyles();
    const match = useRouteMatch();
    const { id, volumeInfo, searchInfo } = book;

    // if available get book cover, if not use fallback image
    const bookThumbnail = getBookThumbnail(volumeInfo.imageLinks);

    // Get book brief (a short preview/snippet about the book)
    const bookBrief = getBookBrief(searchInfo);

    // Format string of Authors for this book
    const formattedAuthors = formatAuthors(volumeInfo.authors);

    const CardSubheader = (content) => (
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
                subheader={CardSubheader(formattedAuthors)}
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
