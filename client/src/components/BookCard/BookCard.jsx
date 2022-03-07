import PropTypes from "prop-types";
import { useState, useMemo } from "react";

// Components
import { Typography } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import AddToBooklistModal from "components/AddToBooklistModal/AddToBooklistModal";
import ConfirmActionModal from "components/ConfirmActionModal/ConfirmActionModal";
import BookCardVertical from "components/BookCardVertical/BookCardVertical";
import BookCardHorizontal from "components/BookCardHorizontal/BookCardHorizontal";

// Utils
import {
    getBookThumbnail,
    getBookBrief,
    formatAuthors,
} from "utils/book-data-display";

/**
 * BookCard visually represents a single book from the Google Books API. 
 * It is an abstraction that uses the value of the "cardLayout" prop to determine when to render a BookCardVertical / BookCardHorizontal component

 * @param { String } [layout] 
 * Determines whether BookCard returns BookCardVertical / BookCardHorizontal. 
 * Value can be either: "vertical" | "horizontal". 
 * Defaults to "vertical" if not specified.
 
 * @param { Boolean } [isDeletingBook] - Passed to Delete button (an AsyncButton component) within ConfirmActionModal component. Determines when AsyncButton should render a Spinner icon.

 * --- 
 * Props drilled to BookCardVertical/Horizontal:

 * @param { Object } book - An object representing a single book from the Google Books API. 

 * @param { Function } handleBookDetailsClick - handles onClick event of "Details" button in BookCardVertical/Horizontal; navigates to BookDetails page.

 * @param { Function } [handleBookDelete] 
 * Handles onClick event of "Delete" button in BookCardVertical/Horizontal; removes a book from a user-owned booklist.
 * NOTE: Delete button is only rendered if handleBookDelete prop is received as a function. 
 */
const BookCard = ({
    book,
    layout = "vertical",
    handleBookDetailsClick,
    // Only pass these props if BookCard is deletable
    handleBookDelete,
    isDeletingBook,
}) => {
    // Controls whether AddToBooklistModal is showing or not
    const [showAddToBooklistModal, setShowAddToBooklistModal] = useState(false);
    // Controls whether ConfirmActionModal is showing or not
    const [showConfirmDeletionModal, setShowConfirmDeletionModal] =
        useState(false);

    // Google Books API data
    const { searchInfo, volumeInfo } = book;

    // Format book's API data
    // NOTE: useMemo prevents re-execution of functions on re-render if dependencies have not changed
    const bookCardContents = useMemo(
        () => ({
            // -- If available get book cover, if not use fallback image
            thumbnail: getBookThumbnail(volumeInfo.imageLinks),
            // -- Format string of Authors for this book
            authors: formatAuthors(volumeInfo.authors),
            // -- Get book brief (a short preview/snippet about the book)
            brief: getBookBrief(searchInfo),
        }),
        [volumeInfo, searchInfo]
    );

    // Rendered on "Add book to list" button click
    const addToBookListModal = (
        <AddToBooklistModal
            book={book}
            openModal={showAddToBooklistModal}
            setOpenModal={setShowAddToBooklistModal}
        />
    );

    // Rendered on "Delete book from list" button click
    const confirmDeletionModal =
        typeof handleBookDelete === "function" ? (
            <ConfirmActionModal
                title="Delete Book From List"
                openModal={showConfirmDeletionModal}
                setOpenModal={setShowConfirmDeletionModal}
                buttons={{
                    positive: {
                        action: handleBookDelete(book.id),
                        async: {
                            loading: isDeletingBook,
                            altText: "Deleting",
                        },
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
                    {book.volumeInfo.title
                        ? `"${book.volumeInfo.title}"`
                        : "this book"}{" "}
                    from this list?
                </Typography>
            </ConfirmActionModal>
        ) : null;

    // BookCardVertical/Horizontal props
    const bookCardProps = {
        book,
        bookCardContents,
        onBookDelete: handleBookDelete,
        onBookDetailsClick: handleBookDetailsClick,
        openAddToBooklistModal: () => setShowAddToBooklistModal(true),
        openConfirmDeletionModal: () => setShowConfirmDeletionModal(true),
    };

    const renderBookCard = (layout) => {
        switch (layout) {
            case "vertical":
                return <BookCardVertical {...bookCardProps} />;
            case "horizontal":
                return <BookCardHorizontal {...bookCardProps} />;
            default:
                throw Error(
                    "BookCard's 'layout' prop received an invalid value"
                );
        }
    };

    return (
        <>
            {addToBookListModal}
            {confirmDeletionModal}
            {renderBookCard(layout)}
        </>
    );
};

BookCard.propTypes = {
    book: PropTypes.object.isRequired,
    layout: PropTypes.oneOf(["vertical", "horizontal"]),
    handleBookDetailsClick: PropTypes.func.isRequired,
    handleBookDelete: PropTypes.func,
    isDeletingBook: PropTypes.bool,
};

export default BookCard;
