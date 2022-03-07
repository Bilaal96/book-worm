import { getBooksRequestURI } from "./api-query-builder";
import { MAX_RESULTS_PER_PAGE, MAX_PAGE_LIMIT } from "constants/index";

/**
 * --- What is startIndex? ---
 * A query parameter that we can pass to our request to Books API
 * In an array of books, startIndex represents the index/item to initiate a request
 * startIndex is used with maxResults to paginate results
 *? BOOKS API DOCS: https://developers.google.com/books/docs/v1/using?authuser=1#query-params
 
 * --- getStartIndex() ---
 * Uses selected page (of MUI Pagination component) and maxResults to calculate value for startIndex query param
 */
export const getStartIndex = (
    selectedPage = 1,
    maxResults = MAX_RESULTS_PER_PAGE
) => {
    console.log("getStartIndex() args", { selectedPage, maxResults });
    // Check if zero or less
    if (selectedPage < 1)
        return console.error("Page number cannot be zero or less");

    // if selectedPage is 1, start from first result (index 0)
    if (selectedPage === 1) return 0;

    // Calculate startIndex when selectedPage > 1
    return selectedPage * maxResults - maxResults;
};

/**
 * TODO Calculate last valid page number, precedes initial request for books data
 * Currently the max page count is hard coded as 10
 * For the cases where max page count (whatever its value may be) does not successfully retrieve books, this method should calculate the last valid page number that is able to fetch results
 * Then it shall set a new max page count with this calculated value
 */
export const getLastPageOfSubmittedSearch = (
    pageLimit = MAX_PAGE_LIMIT,
    searchSubmission
) => {
    for (let pl = pageLimit; pl > 0; pl--) {
        const booksRequestURI = getBooksRequestURI(pl, {
            search: searchSubmission,
        });

        console.log(booksRequestURI);
    }
};
