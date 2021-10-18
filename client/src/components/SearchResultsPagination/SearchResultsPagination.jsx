import PropTypes from "prop-types";

// Contexts
import { useSearchContext } from "contexts/search/search.context";

// Components
import Pagination from "@material-ui/lab/Pagination";

// Utils
import { getStartIndex } from "utils/pagination";

import useStyles from "./styles";

const SearchResultsPagination = ({
    fetchBooks,
    selectedPage,
    setSelectedPage,
    pageCount,
    isFetchingBooks,
}) => {
    const classes = useStyles();
    const [search] = useSearchContext();

    /**
     * ----- handlePageChange() -----
     * Request books for the user-selected page and updates Pagination component to reflect which page is currently in view
     
     * @param { number } pageNum - The numeric value of the page clicked
     
     * Google's Books API limits each request to maximum of 40 books
     * In order to access more / all of the books we must paginate them
     * Pagination requires use of the query params:  
        - startIndex - see "src/helpers/pagination.js" for details
        - maxResults - limits number of results returned per request
    
     * Pagination logic is abstracted into functions for reusability and readability
     * For details see function definitions:
        - getStartIndex() -> "src/helpers/pagination.js"
        - fetchBooks() -> "src/components/BooksSearch/BooksSearch.js"
     */
    const handlePageChange = (event, pageNum) => {
        // If page has not changed, do not re-fetch books
        const cachedPage = JSON.parse(sessionStorage.getItem("results-page"));
        if (cachedPage === pageNum)
            return console.log("Currently showing this page");

        // Calculate the startIndex queryParam, using the currently selected page
        const startIndex = getStartIndex(pageNum);

        // Fetch books for current page by manually setting the startIndex
        fetchBooks({
            search: search.submission,
            startIndex,
        });

        // Set "selectedPage" state (in BooksSearch) with number of page clicked
        setSelectedPage(pageNum);
        // Cache the selected page in sessionStorage (as "results-page")
        sessionStorage.setItem("results-page", JSON.stringify(Number(pageNum)));
    };

    return (
        <Pagination
            className={classes.pagination}
            onChange={handlePageChange}
            page={selectedPage}
            count={pageCount}
            variant="outlined"
            color="secondary"
            showFirstButton
            showLastButton
            disabled={isFetchingBooks}
        />
    );
};

SearchResultsPagination.propTypes = {
    fetchBooks: PropTypes.func.isRequired,
    selectedPage: PropTypes.number.isRequired,
    setSelectedPage: PropTypes.func.isRequired,
    pageCount: PropTypes.number.isRequired,
    isFetchingBooks: PropTypes.bool.isRequired,
};

export default SearchResultsPagination;
