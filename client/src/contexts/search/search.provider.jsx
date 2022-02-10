import { useReducer } from "react";

import { SearchStateContext, SearchDispatchContext } from "./search.context";

// booksReducer - handles app state during and after requests for books
function searchReducer(state, action) {
    switch (action.type) {
        case "UPDATE_SEARCH_SUBMISSION":
            return {
                ...state,
                submission: action.payload,
            };
        case "FETCH_BOOKS_START":
            console.log("------------FETCH BOOKS START--------------");
            return {
                ...state,
                isFetching: true,
                error: null,
            };
        case "FETCH_BOOKS_SUCCESS":
            console.log("------------FETCH BOOKS SUCCESS--------------");
            return {
                ...state,
                results: action.payload,
                isFetching: false,
                error: null,
            };
        case "FETCH_BOOKS_FAILED":
            console.log("------------FETCH BOOKS FAILED--------------");
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

const INITIAL_STATE = {
    submission: "",
    results: null,
    isFetching: false,
    error: null,
};

// Provides SearchContext to consuming child components
export const SearchProvider = ({ stateOnly, dispatchOnly, children }) => {
    const [search, dispatchSearch] = useReducer(searchReducer, INITIAL_STATE);

    /**
     *! TBD - is this optimisation necessary?
     * Passing either stateOnly / dispatchOnly as props will provide a specific context
     * The distinction between the providers below allow us to be selective of which context values we want
     * This increases flexibility and ensures that we aren't needlessly rendering a Provider that is not in use
     */
    // For use when only Search State is required
    if (stateOnly)
        return (
            <SearchStateContext.Provider value={search}>
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
        <SearchStateContext.Provider value={search}>
            <SearchDispatchContext.Provider value={dispatchSearch}>
                {children}
            </SearchDispatchContext.Provider>
        </SearchStateContext.Provider>
    );
};
