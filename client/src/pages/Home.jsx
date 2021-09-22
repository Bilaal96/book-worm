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
import SearchResultsPagination from "components/SearchResultsPagination/SearchResultsPagination";
import SearchResults from "components/SearchResults/SearchResults";

// Helpers
import { getBooksRequestURI } from "helpers/api-query-builder";

// booksReducer - handles app state during and after requests for books
function booksReducer(state, action) {
    switch (action.type) {
        case "FETCH_BOOKS_START":
            return {
                ...state,
                isFetching: true,
                error: null,
            };
        case "FETCH_BOOKS_SUCCESS":
            return {
                ...state,
                data: action.payload,
                isFetching: false,
                error: null,
            };
        case "FETCH_BOOKS_FAILED":
            return {
                ...state,
                data: {},
                isFetching: false,
                error: action.payload,
            };
        default:
            return state;
    }
}

const Home = () => {
    const [books, dispatchBooks] = useReducer(booksReducer, {
        data: null,
        isFetching: false,
        error: null,
    });

    // The search term used to fetch books data
    const [searchSubmission, setSearchSubmission] = useState("");
    // Currently selected page
    const [selectedPage, setSelectedPage] = useState(1);

    // ! TBD - CURRENTLY NO LONGER IN USE
    // The total number of books from the initial request
    // const [booksCount, setBooksCount] = useState(0);
    // Total number of pages user can select from
    // const [pageCount, setPageCount] = useState(0);

    console.log("Home", {
        searchSubmission,
        books,
        selectedPage,
    });

    /**
     * ----- fetchBooks() -----
     * calls getBooksRequestURI() - see below
     * makes an async requests to the URI for books data
     * updates the books state during and after the async request

     * --- getBooksRequestURI() ---
     * Builds and returns a URI that targets the Google Books API 

     * @param { object } configurableParams - query parameters as key-value pairs

     * configurableParams REQUIRES a "search" property
     * Additional properties (set internally by getBooksRequestURI) have default values 
     * Default properties can be overridden if specified in configurableParams
     */
    async function fetchBooks(configurableParams) {
        console.log({ configurableParams });
        console.log({ "configParams.search": configurableParams.search });

        const booksRequestURI = getBooksRequestURI(configurableParams);

        try {
            console.log("------------FETCH BOOKS START--------------");

            // start loading state
            dispatchBooks({ type: "FETCH_BOOKS_START" });

            // Fetch books from Google Books API
            const response = await fetch(booksRequestURI);
            const booksData = await response.json();

            // update books state with fetched data
            // end loading state
            dispatchBooks({
                type: "FETCH_BOOKS_SUCCESS",
                payload: booksData,
            });

            console.log("------------FETCH SUCCESS--------------");
        } catch (err) {
            console.log("------------FETCH FAILED--------------");
            console.error(err);

            // update books state with error
            // end loading state
            dispatchBooks({ type: "FETCH_BOOKS_FAILED", payload: err });
        }
    }

    /**
     * Compose Pagination Component
        - React Docs - Composition Pattern Example:
        - https://reactjs.org/docs/context.html#before-you-use-context
     */
    const resultsPagination = (
        <SearchResultsPagination
            selectedPage={selectedPage}
            setSelectedPage={setSelectedPage}
            pageCount={10}
            isFetchingBooks={books.isFetching}
        />
    );

    return (
        <>
            <Typography variant="h2" component="h1" align="center">
                Discover
            </Typography>

            {/* Search Box */}
            <SearchBar
                fetchBooks={fetchBooks}
                previousSearch={searchSubmission}
                setSearchSubmission={setSearchSubmission}
                setSelectedPage={setSelectedPage}
                isFetchingBooks={books.isFetching}
            />

            {/* Renders appropriate UI based on "books" state */}
            {books.isFetching ? (
                <Typography variant="h4" component="p" align="center">
                    Loading...
                </Typography>
            ) : (
                <SearchResults
                    fetchBooks={fetchBooks}
                    books={books}
                    selectedPage={selectedPage}
                    searchSubmission={searchSubmission}
                    resultsPagination={resultsPagination}
                />
            )}
        </>
    );
};

export default Home;
