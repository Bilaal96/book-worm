import PropTypes from "prop-types";
import { useState } from "react";

// Components
import { Paper, Grid, Typography, Hidden, IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import ConfirmActionModal from "components/ConfirmActionModal/ConfirmActionModal.jsx";

// Utils
import {
    getBookThumbnail,
    getBookBrief,
    formatAuthors,
} from "utils/book-data-display";

import useStyles from "./styles.js";

const BookApiListItem = ({
    book,
    onClick: handleClick,
    handleDelete, // optional
    isDeleting,
}) => {
    const { volumeInfo, searchInfo } = book;

    // if available get book cover, if not use fallback image
    const bookThumbnail = getBookThumbnail(volumeInfo.imageLinks);

    // Determine if handleDelete was passed as prop
    // If passed, the delete button is styled & rendered
    const isDeletable = typeof handleDelete === "function" ? true : false;

    // Make props accessible within makeStyles
    const styleProps = { bookThumbnail, isDeletable };
    const classes = useStyles(styleProps);

    // Format string of Authors for this book
    const formattedAuthors = formatAuthors(volumeInfo.authors);

    // Get book brief (a short preview/snippet about the book)
    const bookBrief = getBookBrief(searchInfo);

    // Modal state - toggles ConfirmActionModal
    const [openModal, setOpenModal] = useState(false);

    return (
        <>
            {/* Rendered on click of delete button */}
            {isDeletable && (
                <ConfirmActionModal
                    title="Delete Book From List"
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    buttons={{
                        positive: {
                            action: handleDelete,
                            async: { loading: isDeleting, altText: "Deleting" },
                            startIcon: <Delete />,
                            text: "Delete",
                        },
                    }}
                >
                    <Typography
                        style={{ fontSize: "18px", padding: "14px 28px" }}
                        variant="body1"
                    >
                        Are you sure you want to permanently remove{" "}
                        {volumeInfo.title
                            ? `"${volumeInfo.title}"`
                            : "this book"}{" "}
                        from this list?
                    </Typography>
                </ConfirmActionModal>
            )}

            {/* List item representing a single book */}
            <Grid item xs={12}>
                <Paper className={classes.bookListItem} elevation={2}>
                    <Grid container alignItems="center">
                        {/* Book Details */}
                        <Grid
                            onClick={handleClick}
                            className={classes.bookDetails}
                            item
                            xs={isDeletable ? 11 : 12}
                        >
                            <Grid container>
                                {/* Book Cover (Thumbnail) */}
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
                                        dangerouslySetInnerHTML={{
                                            __html: bookBrief,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Booklist Actions (ManageLists page only) */}
                        {isDeletable && (
                            <Grid item xs={1}>
                                <Grid container justifyContent="center">
                                    <IconButton
                                        className={classes.deleteButton}
                                        // onClick={handleDelete}
                                        onClick={() => setOpenModal(true)}
                                    >
                                        <Delete fontSize="large" />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            </Grid>
        </>
    );
};

BookApiListItem.propTypes = {
    book: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired,
    handleDelete: PropTypes.func,
    loading: PropTypes.bool,
};

export default BookApiListItem;
