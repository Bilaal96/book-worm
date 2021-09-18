import { MAX_SEARCH_RESULTS } from "constants/index";

/**
 * --- What is startIndex? ---
 * A query parameter that we can pass to our request to Books API
 * In an array of books, startIndex represents the index/item to initiate a request
 * startIndex is used with maxResults to paginate results
 *? BOOKS API DOCS: https://developers.google.com/books/docs/v1/using?authuser=1#query-params
 
 * --- getStartIndex() ---
 * Uses selected page (of Pagination component) and maxResults to calculate value for startIndex query param
 
 * ! Currently assumes that selectedPage is always positive
 * ! SHOULD throw error if selectedPage is zero or less (i.e. negative)
 */
const getStartIndex = (selectedPage, maxResults) => {
    console.log("getStartIndex() args", { selectedPage, maxResults });
    // Check if zero or less
    if (selectedPage < 1) console.error("Page number cannot be zero or less");

    // start from first result (index 0) if selectedPage is 1
    if (selectedPage === 1) return 0;

    // Calculate startIndex when selectedPage > 1
    return selectedPage * maxResults - maxResults;
};

/**
 * --- getUrlEncodedQueryString() ---
 * Iterates over queryParams object and calls encodeURIComponent() for each property/query parameter
 * @returns URL Encoded Query String -> used to request Books data
 */
const getUrlEncodedQueryString = (queryParams) => {
    let urlEncodedQueryString = "?";

    // Create array, where each key is the name of a query param
    const keysArr = Object.keys(queryParams);
    // Access the last key
    const lastKey = keysArr[keysArr.length - 1];

    console.log({ queryParams });

    // URL Encode every value corresponding to a particular key, and separate them with ampersands
    keysArr.forEach((key) => {
        // console.log({ [key]: queryParams[key] });

        urlEncodedQueryString += `${key}=${encodeURIComponent(
            queryParams[key]
        )}`;

        if (key !== lastKey) urlEncodedQueryString += "&";
    });

    console.log({ urlEncodedQueryString });

    return urlEncodedQueryString;
};

/**
 * --- getBooksRequestURI() ---
 * Builds the URI required to request books data from Books API 
 
 * @param { number } page - used to calculate startIndex
 * @param { object } customParams - used to manually set / override default params
 * @param { string } serverDomain - flexibly set the domain for custom API

 * If new search (i.e. request made by SearchBar) set page manually to 1
 * If request is made by page click (SearchResults) -> set page dynamically -> by calculating 
 

  * Expected queryParams:
    - search
    - startIndex
    - maxResults
 */
export const getBooksRequestURI = (
    page,
    customParams,
    serverDomain = "http://localhost:5000/"
) => {
    // Define expected query params: maxResults & startIndex
    // Use custom value if passed, otherwise use MAX_SEARCH_RESULTS as default
    const maxResults = customParams.maxResults || MAX_SEARCH_RESULTS;
    const startIndex = getStartIndex(page, maxResults); // Calculate startIndex

    console.log("Request results with new startIndex:", startIndex);

    // Accumulate query params in an object
    const queryParams = {
        // default params for every request
        maxResults: MAX_SEARCH_RESULTS,
        startIndex,

        // manually set params / override default params
        ...customParams,
    };

    // Get url encoded string, consisting of all query parameters
    const urlEncodedQuerystring = getUrlEncodedQueryString(queryParams);

    // return URI with which API request can be made
    // e.g. http://localhost:5000/?search=test&startIndex=0&maxResults=20
    return `${serverDomain}${urlEncodedQuerystring}`;
};
