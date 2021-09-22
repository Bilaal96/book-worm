import { useRef, useEffect } from "react";
import PropTypes from "prop-types";

// Components
import { Typography } from "@material-ui/core";
import BooksGrid from "components/BooksGrid/BooksGrid";

// Helpers
import { getStartIndex } from "helpers/pagination";
import { isValidSearchString } from "helpers/search-string-validation";

const SearchResults = ({
    fetchBooks,
    books,
    selectedPage,
    searchSubmission,
    resultsPagination,
}) => {
    // Tracks whether or not SearchResults is mounting DOM for first time
    const isMounted = useRef(null);

    /**
     * ----- Request Books for a Specific Page -----
     * Google's Books API limits each request to maximum of 40 books
     * In order to access more / all of the books we must paginate them
     * Pagination requires use of the query params: startIndex and maxResults 
     
     * --- getStartIndex() ---
     * calculates the startIndex queryParam, using the currently selected page
     
     * --- fetchBooks() ---
     * Handles fetching books data and updating the app state during different stages of the data fetch
     * Object accepted as arg is used by other functions (called internally) to set query params for the request URI
     
     * --- useEffect() ---
     * NOTE: selectedPage state is listed in the dependencies array
     * So when selectedPage updated, the books are requested with newly calculated startIndex as a side-effect 
     */
    useEffect(() => {
        // Request books on every re-render (i.e. every render AFTER the first render)
        if (isMounted.current) {
            // Prevent empty search request on refreshes after initial render
            if (!isValidSearchString(searchSubmission))
                return console.log("|| Empty search prevented on refresh ||");

            const startIndex = getStartIndex(selectedPage);
            fetchBooks({
                search: searchSubmission,
                startIndex,
            });
        } else {
            // First render, do not request; update isMounted Ref
            isMounted.current = true;
        }
    }, [selectedPage, fetchBooks, searchSubmission]);

    const { data: booksData } = books; // reduces verbosity / increase readability

    // No searches made, prompt user
    if (!booksData) {
        return (
            <Typography variant="h4" component="p" align="center">
                Find books using the search bar above
            </Typography>
        );
    }

    // Books found, display in paginated BooksGrid
    if (booksData.items?.length > 0) {
        return (
            <>
                {resultsPagination}
                <BooksGrid books={books.data} />
                {resultsPagination}
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

// Allowing null values: https://github.com/facebook/react/issues/3163#issuecomment-463656929
SearchResults.propTypes = {
    fetchBooks: PropTypes.func.isRequired,
    books: PropTypes.shape({
        data: PropTypes.object, // allows null
        isFetching: PropTypes.bool.isRequired,
        error: PropTypes.instanceOf(Error), // allows null
    }),
    selectedPage: PropTypes.number.isRequired,
    searchSubmission: PropTypes.string.isRequired,
    resultsPagination: PropTypes.object.isRequired,
};

export default SearchResults;
