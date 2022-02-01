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

// Components
import { Typography, Grid } from "@material-ui/core";
import BookApiListItem from "components/BookApiListItem/BookApiListItem";

const Booklist = () => {
    const { listId } = useParams();
    const history = useHistory();

    // Get the booklist user wants to view from context
    const { getBooklistById } = useContext(MasterListContext);
    const booklist = getBooklistById(listId);

    // On list item click, navigate to book details page for: `/books/${book.id}`
    const viewBookDetails = (bookId) => (e) => history.push(`/books/${bookId}`);

    const removeBookFromList = () => console.log("Remove book from booklist");

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
                        handleDelete={removeBookFromList}
                    />
                ))}
            </Grid>
        </>
    );
};

export default Booklist;
