/**
 * ----- TBD -----
 * Delete book from a list (BookApiListItem)
 *? Endpoint: DELETE /booklists/:listId/books/:bookId 
 
 * Update title and description
 *? Endpoint: PUT /booklists/:listId/books
 */

import { useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

// Context
import { MasterListContext } from "contexts/master-list/master-list.context";
import { AuthContext } from "contexts/auth/auth.context";

// Components
import { Typography, Grid } from "@material-ui/core";
import BooklistMetadata from "components/BooklistMetadata/BooklistMetadata";
import BookApiListItem from "components/BookApiListItem/BookApiListItem";

import useStyles from "./styles.js";

const Booklist = () => {
    const { listId } = useParams();
    const history = useHistory();
    const classes = useStyles();

    const { accessToken } = useContext(AuthContext);
    const { masterList, setMasterList, getBooklistById } =
        useContext(MasterListContext);

    // Get the booklist user wants to view from Master List context
    const booklist = getBooklistById(listId);

    // On list item click, navigate to BookDetails page for: `/books/${book.id}`
    const viewBookDetails = (bookId) => (e) => history.push(`/books/${bookId}`);

    const removeBookFromBooklist = (bookId) => async (e) => {
        try {
            // Request deletion of book (with id of 'bookId') from booklist (with id of 'listId')
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
        } catch (err) {
            console.error(err);
        }
    };

    // No books in list UI
    if (booklist.books?.length === 0)
        return (
            <div className={classes.flexContainer}>
                {booklist && <BooklistMetadata booklist={booklist} />}
                <Typography
                    variant="h2"
                    component="h1"
                    align="center"
                    color="textSecondary"
                >
                    There are currently no books in this list
                </Typography>
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
                        />
                    ))}
                </Grid>
            </div>
        </>
    );
};

export default Booklist;
