import { useContext, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";

// Context
import { AuthContext } from "contexts/auth/auth.context";
import { MasterListContext } from "contexts/master-list/master-list.context";

// Components
import { Hidden } from "@material-ui/core";
import BooklistMetadata from "components/BooklistMetadata/BooklistMetadata";
import BookCardsList from "components/BookCardsList/BookCardsList.jsx";
import CustomBackdrop from "components/CustomBackdrop/CustomBackdrop.jsx";

import { BOOK_WORM_API_URI } from "constants/index.js";

import useStyles from "./styles.js";

const Booklist = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { listId } = useParams();
    const history = useHistory();
    const classes = useStyles();

    const { accessToken } = useContext(AuthContext);
    const { masterList, setMasterList, getBooklistById } =
        useContext(MasterListContext);

    // Is set to true until request to delete book completes (succeeds or fails)
    const [isDeletingBook, setIsDeletingBook] = useState(false);

    // Get the booklist user wants to view from Master List context
    const booklist = getBooklistById(listId);
    console.log("BOOKLIST", booklist);

    // On list item click, navigate to BookDetails page for: `/books/${book.id}`
    const navigateToBookDetailsRoute = (bookId) => (e) =>
        history.push(`/books/${bookId}`);

    const removeBookFromBooklist = (bookId) => async (e) => {
        try {
            // Request deletion of book (with id of 'bookId') from booklist (with id of 'listId')
            setIsDeletingBook(true); // init loading state
            const response = await fetch(
                `${BOOK_WORM_API_URI}/booklists/${listId}/books/${bookId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            // Handle fetch error
            if (!response.ok) {
                const error = await response.json();
                throw error;
            }

            // Deletion successful, parse response
            // returns the affected booklist
            const updatedBooklist = await response.json();

            console.log("BOOK DELETED:", {
                oldBooklist: booklist.books,
                newBooklist: updatedBooklist.books,
            });

            // Filter out the booklist containing outdated books array
            let updatedMasterList = masterList.filter(
                (booklist) => booklist._id !== listId
            );

            // Add updatedBooklist to the beginning of masterList
            updatedMasterList.unshift(updatedBooklist);

            // Update masterList state
            setMasterList(updatedMasterList);
            setIsDeletingBook(false); // end loading state

            // Display success notification
            const successNotification =
                "Book was successfully removed from list 🔫";
            enqueueSnackbar(successNotification, { variant: "success" });
        } catch (err) {
            console.error(err);
            setIsDeletingBook(false); // end loading state
            // Display error notification
            const errorNotification =
                "Failed to remove book from list 🤔. If this problem persists please try again later.";
            enqueueSnackbar(errorNotification, { variant: "error" });
        }
    };

    // Empty booklist UI - no books in list
    if (booklist.books?.length === 0)
        return (
            <div className={classes.flexContainer}>
                {/* Editable Booklist Title & Description */}
                {booklist && <BooklistMetadata booklist={booklist} />}

                {/* Notify user on booklist status */}
                <CustomBackdrop
                    text="There are currently no books in this list"
                    position="static"
                />
            </div>
        );

    return (
        <div className={classes.flexContainer}>
            {/* Editable Booklist Title & Description */}
            {booklist && <BooklistMetadata booklist={booklist} />}

            {/* Display BookCard's in GRID format; hide at "mdUp" breakpoint */}
            <Hidden mdUp>
                <BookCardsList
                    books={booklist.books}
                    cardLayout="vertical"
                    handleBookDetailsClick={navigateToBookDetailsRoute}
                    handleBookDelete={removeBookFromBooklist}
                    isDeletingBook={isDeletingBook}
                />
            </Hidden>

            {/* Display BookCard's in LIST format; hide at "smDown" breakpoint */}
            <Hidden smDown>
                <BookCardsList
                    books={booklist.books}
                    breakpoints={{ xs: 12 }}
                    cardLayout="horizontal"
                    handleBookDetailsClick={navigateToBookDetailsRoute}
                    handleBookDelete={removeBookFromBooklist}
                    isDeletingBook={isDeletingBook}
                />
            </Hidden>
        </div>
    );
};

export default Booklist;
