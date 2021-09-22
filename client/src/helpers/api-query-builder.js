import { MAX_RESULTS_PER_PAGE } from "constants/index";

/**
 * --- getUrlEncodedQueryString() ---
 * Iterates over queryParams object and calls encodeURIComponent() for each property/query parameter
 
 * @returns { string } URL Encoded Query String -> used to request Books data

 * Object.entries() accepts an object and returns an array
 * Each element in the array is a nested array containing:
    - the key at index 0
    - the value at index 1
    - [ [key1, val1], [key2,val2] ] etc.

 * Below, map() is used to:
    - iterate over the aforementioned array and access the queryParams (in the nested array) as key-value pairs    
    - the key-value pairs are returned in a formatted string, where the value is also uri encoded

 * Finally, join builds the queryString by converting the array returned by map() into a string
 * Each element from the array is separated by an ampersand
 */
export const getURIEncodedQueryString = (queryParams) => {
    return Object.entries(queryParams)
        .map(
            ([queryParam, value]) =>
                `${queryParam}=${encodeURIComponent(value)}`
        )
        .join("&");
};

/**
 * --- getBooksRequestURI() ---
 * Builds the URI required to request books data from Books API 
 
 * @param { object } configurableParams - used to manually set / override default params
 * @param { string } serverDomain - flexibly set the domain for custom API

 * This function builds the queryParams object, then invokes getURIEncodedQueryString() with queryParams as an arg.
 * queryParams has some default properties set which can be overridden with  the parameter: configurableParams 
 
 * At the very least, the following properties are expected in configurableParams:
    - search
 */
export const getBooksRequestURI = (
    configurableParams,
    serverDomain = "http://localhost:5000/"
) => {
    // Accumulate query params in an object
    const queryParams = {
        // default params for every request
        maxResults: MAX_RESULTS_PER_PAGE,
        startIndex: 0,

        // manually set params / override default params
        ...configurableParams,
    };

    // Get url encoded string, consisting of all query parameters
    const uriEncodedQuerystring = getURIEncodedQueryString(queryParams);
    console.log({ uriEncodedQuerystring });

    // return URI with which API request can be made
    // e.g. http://localhost:5000/?search=test&startIndex=0&maxResults=20
    return `${serverDomain}?${uriEncodedQuerystring}`;
};
