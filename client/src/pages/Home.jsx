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
import { useEffect, useState } from "react";

// MUI
// -- Components
import { Typography } from "@material-ui/core";

// Components
import SearchBox from "components/SearchBox/SearchBox";

import useStyles from "./styles";

const Home = () => {
    const classes = useStyles();

    /** 
     * If "books" state is used elsewhere in the app, move it to Context API later
     * So it is accessible throughout the app & we don't have to lift the state & drill searchResults as props
        - https://reactjs.org/docs/context.html
        - https://www.youtube.com/watch?v=5LrDIWkK_Bc
     */
    const [searchTerm, setSearchTerm] = useState("");
    const [books, setBooks] = useState([]);

    /**
     * Query the Google Books API & set fetched books to local state
     * Books API Ref: https://developers.google.com/books/docs/v1/reference?authuser=1
     
     *! NOTE: AT THE MOMENT, REQUEST ONLY HAPPENS WHEN STATE CHANGES
     *! This will be changed when Search Button is created
     */
    useEffect(() => {
        // Observe/track state changes
        console.log({ searchTerm });
        console.log({ books });

        // Ensure that user has typed something in search box
        if (searchTerm.length) {
            /**
             * --- encodeURIComponent() ---
             * Purpose: Used to encode URI query strings
             * Why?: Values such as whitespace and "!" need to be encoded when passed as query strings
             
             * DETAILS: https://thisthat.dev/encode-uri-vs-encode-uri-component/
             * DESCRIPTION AND RELATED METHODS: https://love2dev.com/blog/whats-the-difference-between-encodeuri-and-encodeuricomponent/
             */
            const apiSearchEndpoint = `http://localhost:5000/?search=${encodeURIComponent(
                searchTerm
            )}`;

            async function fetchBooks() {
                try {
                    const response = await fetch(apiSearchEndpoint);
                    const data = await response.json();
                    console.log({ data });

                    setBooks(data);
                } catch (err) {
                    console.error("fetchBooks ERROR: ", err);
                }
            }

            fetchBooks();
        }
    }, [searchTerm]);

    const handleSearchSubmit = (e) => {
        if (e.key === "Enter") {
            setSearchTerm(e.target.value);
        }
    };

    return (
        <main>
            <Typography
                variant="h4"
                component="h1"
                className={classes.pageHeading}
            >
                Home
            </Typography>
            {/* Search Box */}
            <SearchBox handleSearch={handleSearchSubmit} />
            Press Enter to submit
            {/* TODO Grid of Books
             * Mobile: 1 per row
             * desktop: 3-4 per row
             */}
        </main>
    );
};

export default Home;
