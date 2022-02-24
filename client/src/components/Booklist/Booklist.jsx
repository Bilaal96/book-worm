/**
 * ----- TBD -----
 * Delete book from a list (BookApiListItem)
 *? Endpoint: DELETE /booklists/:listId/books/:bookId 
 
 * Update title and description
 *? Endpoint: PUT /booklists/:listId/books
 */

import { useContext, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSnackbar } from "notistack";

// Context
import { MasterListContext } from "contexts/master-list/master-list.context";
import { AuthContext } from "contexts/auth/auth.context";

// Components
import { Grid } from "@material-ui/core";
import BooklistMetadata from "components/BooklistMetadata/BooklistMetadata";
import BookApiListItem from "components/BookApiListItem/BookApiListItem";
import CustomBackdrop from "components/CustomBackdrop/CustomBackdrop.jsx";

import useStyles from "./styles.js";

const Booklist = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { listId } = useParams();
    const history = useHistory();
    const classes = useStyles();

    const { accessToken } = useContext(AuthContext);
    const { masterList, setMasterList, getBooklistById } =
        useContext(MasterListContext);

    const [isDeleting, setIsDeleting] = useState(false);

    // Get the booklist user wants to view from Master List context
    const booklist = getBooklistById(listId);

    // On list item click, navigate to BookDetails page for: `/books/${book.id}`
    const viewBookDetails = (bookId) => (e) => history.push(`/books/${bookId}`);

    const removeBookFromBooklist = (bookId) => async (e) => {
        try {
            // Request deletion of book (with id of 'bookId') from booklist (with id of 'listId')
            setIsDeleting(true); // init loading state
            const response = await fetch(
                `http://localhost:5000/booklists/${listId}/books/${bookId}`,
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
            setIsDeleting(false); // end loading state

            // Display success notification
            const successNotification =
                "Book was successfully removed from list 🔫";
            enqueueSnackbar(successNotification, { variant: "success" });
        } catch (err) {
            console.error(err);
            setIsDeleting(false); // end loading state
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
                    open={true}
                    position="static"
                    rounded
                />
            </div>
        );

    return (
        <>
            <div className={classes.flexContainer}>
                {/* Editable Booklist Title & Description */}
                {booklist && <BooklistMetadata booklist={booklist} />}

                {/* List of books in a list */}
                <Grid container spacing={2}>
                    {booklist.books?.map((book) => (
                        <BookApiListItem
                            key={book.id}
                            book={book}
                            onClick={viewBookDetails(book.id)}
                            handleDelete={removeBookFromBooklist(book.id)}
                            isDeleting={isDeleting}
                        />
                    ))}
                </Grid>
            </div>
        </>
    );
};

export default Booklist;
