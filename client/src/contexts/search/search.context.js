import { createContext } from "react";

// Define Contexts with default values
export const SearchStateContext = createContext({
    loading: false,
    value: null,
    error: null,
    submission: "",
});

// Dispatch object methods
export const SearchDispatchContext = createContext({
    start: () => {},
    success: () => {},
    failed: () => {},
    native: () => {},
});

// Assign Display Name for React DevTools
SearchStateContext.displayName = "SearchStateContext";
SearchDispatchContext.displayName = "SearchDispatchContext";
