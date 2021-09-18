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
import { useState, useReducer } from "react";

// Components
import { Typography } from "@material-ui/core";
import SearchBar from "components/SearchBar/SearchBar";
import SearchResults from "components/SearchResults/SearchResults";
import Pagination from "@material-ui/lab/Pagination";

import useStyles from "./styles";

function bookReducer(state, action) {
    switch (action.type) {
        case "FETCH_BOOKS_START":
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case "FETCH_BOOKS_SUCCESS":
            return {
                ...state,
                data: action.payload,
                isLoading: false,
                error: null,
            };
        case "FETCH_BOOKS_FAILED":
            return {
                ...state,
                data: {},
                isLoading: false,
                error: action.payload,
            };
        default:
            return state;
    }
}

const Home = () => {
    const classes = useStyles();

    const [books, dispatchBooks] = useReducer(bookReducer, {
        data: null,
        isLoading: false,
        error: null,
    });

    // The total number of books from the initial request
    const [booksCount, setBooksCount] = useState(0);
    // The search term used to fetch the results (rendered by SearchResults)
    const [searchSubmission, setSearchSubmission] = useState("");

    // Pagination component
    // -- currently selected page
    const [page, setPage] = useState(0);
    // -- total number of pages to select from
    const [pageCount, setPageCount] = useState(0);

    console.log("Home", {
        searchSubmission,
        books,
        booksCount,
        page,
        pageCount,
    });

    // Set selected page on click of Pagination buttons
    // NOTE: triggers side-effect in SearchResults to request paginated book data
    const handlePageChange = (event, value) => {
        setPage(value);
    };

    //? Follows composition pattern -> as demonstrated in React Docs (in ContextAPI Alternatives section)
    const SearchResultsPagination = (
        <Pagination
            className={classes.pagination}
            onChange={handlePageChange}
            page={page}
            count={pageCount}
            variant="outlined"
            color="secondary"
            showFirstButton
            showLastButton
            disabled={books.isLoading}
        />
    );

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
            <SearchBar
                setSearchSubmission={setSearchSubmission}
                setPage={setPage}
                isLoading={books.isLoading}
            />

            {/* Renders appropriate UI based on isLoading & books states */}
            {books.isLoading ? (
                <Typography variant="h4" component="p" align="center">
                    Loading...
                </Typography>
            ) : (
                <SearchResults
                    books={books}
                    dispatchBooks={dispatchBooks}
                    booksCount={booksCount}
                    setBooksCount={setBooksCount}
                    pagination={SearchResultsPagination}
                    page={page}
                    setPageCount={setPageCount}
                    searchSubmission={searchSubmission}
                />
            )}
        </>
    );
};

export default Home;
