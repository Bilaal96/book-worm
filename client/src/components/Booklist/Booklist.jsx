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
import BookApiListItem from "components/BookApiListItem/BookApiListItem";

const Booklist = () => {
    const { listId } = useParams();
    const history = useHistory();

    const { accessToken } = useContext(AuthContext);

    // Get the booklist user wants to view from context
    const { masterList, setMasterList, getBooklistById } =
        useContext(MasterListContext);

    const booklist = getBooklistById(listId);

    // On list item click, navigate to book details page for: `/books/${book.id}`
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
            <Typography
                variant="h2"
                component="h1"
                align="center"
                color="textSecondary"
            >
                There are currently no books in this list
            </Typography>
        );

    return (
        <>
            <div>Booklist Title: {booklist && booklist.title}</div>
            {booklist && booklist.description && (
                <div>Booklist Description: {booklist.description}</div>
            )}

            <Grid container spacing={2}>
                {booklist.books?.map((book) => (
                    <BookApiListItem
                        key={book.id}
                        book={book}
                        onClick={viewBookDetails(book.id)}
                        deletable
                        handleDelete={removeBookFromBooklist(book.id)}
                    />
                ))}
            </Grid>
        </>
    );
};

export default Booklist;
