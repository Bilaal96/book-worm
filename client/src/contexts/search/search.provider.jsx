import { useReducer } from "react";

import { SearchStateContext, SearchDispatchContext } from "./search.context";

// booksReducer - handles app state during and after requests for books
function searchReducer(state, action) {
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
                results: action.payload,
                isFetching: false,
                error: null,
            };
        case "FETCH_BOOKS_FAILED":
            return {
                ...state,
                results: {},
                isFetching: false,
                error: action.payload,
            };
        default:
            return state;
    }
}

// For use when both Search State & Dispatch are required
export const SearchProvider = ({ stateOnly, dispatchOnly, children }) => {
    const [searchState, dispatchSearch] = useReducer(searchReducer, {
        results: null,
        isFetching: false,
        error: null,
    });

    console.log("SearchProvider state:", searchState);

    /**
     * Use props: stateOnly & dispatchOnly
     * Along with if-statements to determine what to render for SearchProvider
     
     *! TBD - is this optimisation necessary?
     * The distinction between the providers below allow us to be selective of which context values we want
     * This increases flexibility and ensures that we aren't needlessly rendering a Provider that is not in use
     */
    // For use when only Search State is required
    if (stateOnly)
        return (
            <SearchStateContext.Provider value={searchState}>
                {children}
            </SearchStateContext.Provider>
        );

    // For use when only Search Dispatch is required
    if (dispatchOnly)
        return (
            <SearchDispatchContext.Provider value={dispatchSearch}>
                {children}
            </SearchDispatchContext.Provider>
        );

    return (
        <SearchStateContext.Provider value={searchState}>
            <SearchDispatchContext.Provider value={dispatchSearch}>
                {children}
            </SearchDispatchContext.Provider>
        </SearchStateContext.Provider>
    );
};
