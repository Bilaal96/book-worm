/** Google Books 4 Main Concepts
 * https://developers.google.com/books/docs/v1/getting_started?authuser=1#background
 
 * Volumes -> data on a book or magazine
 * Bookshelf -> collection of Volumes
    -> comes with built-in bookshelves - some filled by user, some with AI suggestions
    -> on Google Books site (only) users can:
        - manually CRUD their own bookshelves
        - make a bookshelf private or public
 * Review - star rating & text - user can submit one per volume
 * Reading Position - last read position in a Volume for a user
    -> one per Volume
    -> does not exist until a user opens a Volume
    -> can store detailed position info (private to user) - down to the resolution of a word
 */
import { useState } from "react";

// Components
import { Typography } from "@material-ui/core";
import SearchBar from "components/SearchBar/SearchBar";
import BooksGrid from "components/BooksGrid/BooksGrid";

import useStyles from "./styles";

const Home = () => {
    const classes = useStyles();

    /** 
     * If "books" state is used elsewhere in the app, move it to Context API later
     * So it is accessible throughout the app & we don't have to lift the state & drill searchResults as props
        - https://reactjs.org/docs/context.html
        - https://www.youtube.com/watch?v=5LrDIWkK_Bc
     */

    const [books, setBooks] = useState(null);
    console.log({ books });

    // Renders appropriate UI based on books state
    const renderBooksGrid = () => {
        // No searches made, prompt user
        if (!books) {
            return (
                <Typography variant="h4" component="p" align="center">
                    Find books using the search bar above
                </Typography>
            );
        }

        // Books found, display with BooksGrid
        if (books.totalItems > 0) {
            return <BooksGrid books={books} />;
        } else {
            // No results found that match the search term entered
            return (
                <Typography variant="h4" component="p" align="center">
                    No results found, try searching for something else
                </Typography>
            );
        }
    };

    return (
        <>
            <Typography
                variant="h2"
                component="h1"
                className={classes.pageHeading}
                align="center"
            >
                Discover
            </Typography>

            {/* Search Box */}
            <SearchBar setBooks={setBooks} />

            {renderBooksGrid()}
        </>
    );
};

export default Home;
