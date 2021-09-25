import { createContext, useContext } from "react";

// Define Contexts with default values
export const SearchStateContext = createContext({
    results: null,
    isFetching: false,
    error: null,
});

export const SearchDispatchContext = createContext(() => {});

// Assign Display Name for React DevTools
SearchStateContext.displayName = "SearchStateContext";
SearchDispatchContext.displayName = "SearchDispatchContext";

// Export custom hook that returns search context
export const useSearchContext = () => {
    const search = useContext(SearchStateContext);
    const dispatchSearch = useContext(SearchDispatchContext);

    return [search, dispatchSearch];
};
