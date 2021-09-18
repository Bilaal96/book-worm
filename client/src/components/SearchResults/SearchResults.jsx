import { useRef, useEffect } from "react";
import PropTypes from "prop-types";

// Components
import { Typography } from "@material-ui/core";
import BooksGrid from "components/BooksGrid/BooksGrid";

// Constants
import { MAX_SEARCH_RESULTS } from "constants/index";

// Helpers
import { getBooksRequestURI } from "helpers/api-requests";

const SearchResults = ({
    books,
    dispatchBooks,
    booksCount,
    setBooksCount,
    pagination: ResultsPagination, // MUI Pagination component
    page,
    setPageCount,
    searchSubmission,
}) => {
    // Track whether or not SearchResults is mounting DOM for first time
    const isMounted = useRef(null);

    // Calculate the number of pages available to select
    useEffect(() => {
        setPageCount(Math.ceil(booksCount / MAX_SEARCH_RESULTS));
    }, [booksCount, setPageCount]);

    /**
     * --- Request Books for a Specific Page ---
     * Google's Books API limits each request to maximum of 40 books
     * In order to access all the books we must paginate them
     * Pagination requires use of the query params: startIndex and maxResults 
     
     * getBooksRequestURI() handles building the request endpoint, which involves:
        - calculating the startIndex (using the currently selected page and maxResults)
        - url encoding the values passed as query params
        - For more details see: /src/helpers/api-requests.js 
     
     * The URI (returned by getBooksRequestURI) is used to fetch the Books for a specific user-selected page

     * Submitting a search via SearchBar manually sets the page to: 1
     */
    useEffect(() => {
        async function fetchBooksToDisplay() {
            console.log("------------FETCH BOOKS START--------------");
            const booksRequestURI = getBooksRequestURI(page, {
                search: searchSubmission,
            });

            try {
                dispatchBooks({ type: "FETCH_BOOKS_START" });

                const response = await fetch(booksRequestURI);
                const booksData = await response.json();

                dispatchBooks({
                    type: "FETCH_BOOKS_SUCCESS",
                    payload: booksData,
                });

                // Set the num
                // The total number of books from the initial request
                // -- when fetching results from startIndex > 0, the total number of matching books found will change, so it is important to use the totalItems property returned by the INITIAL request
                if (page === 1) {
                    setBooksCount(booksData.totalItems);
                    console.log("|||||||||| books count updated ||||||||||");
                }
                console.log("------------FETCH SUCCESS--------------");
            } catch (err) {
                console.log(err);
                dispatchBooks({ type: "FETCH_BOOKS_FAILED", payload: err });
                console.log("------------FETCH FAILED--------------");
            }
        }

        // Request books on every re-render (i.e. every render AFTER the first render)
        if (isMounted.current) {
            fetchBooksToDisplay();
        } else {
            isMounted.current = true;
        }
    }, [page, searchSubmission, dispatchBooks, setBooksCount]);

    // No searches made, prompt user
    if (!books.data) {
        return (
            <Typography variant="h4" component="p" align="center">
                Find books using the search bar above
            </Typography>
        );
    }

    // Books found, display in BooksGrid
    if (booksCount > 0) {
        return (
            <>
                {/* //! TODO REMOVE BooksPagination */}
                {/* <BooksPagination>
                    <BooksGrid books={books} />
                </BooksPagination> */}

                {/* //! only render ResultsPagination if any number of pages actually exist */}
                {ResultsPagination}
                <BooksGrid books={books.data} />
                {ResultsPagination}
            </>
        );
    } else {
        // No results found that match the search term entered
        return (
            <Typography variant="h4" component="p" align="center">
                No results found, try searching for something else
            </Typography>
        );
    }
};

SearchResults.propTypes = {
    searchSubmission: PropTypes.string.isRequired,
    books: PropTypes.object,
};

export default SearchResults;
