import { createAsyncReducer } from "utils/create-reducer";
import useAsyncReducer from "hooks/useAsyncReducer";

import { SearchStateContext, SearchDispatchContext } from "./search.context";

// To consume context values of this provider see: utils/useSearchContext.js
export const SearchProvider = ({ children }) => {
    // Define arguments to createAsyncReducer
    const actionTypePrefix = "FETCH_BOOKS";
    // Set additional state & its respective state handler
    // Stores the current search term
    // -- for making paginated requests and preventing resubmissions
    const additionalState = { submission: "" };
    const additionalStateHandlers = {
        UPDATE_SEARCH_SUBMISSION: (state, action) => ({
            ...state,
            submission: action.payload,
        }),
    };

    /**
     * Creates searchReducer (responsible for updating initialState)
     * NOTE: both searchReducer & initialState are passed as args to useAsyncReducer
     */
    const [searchReducer, initialState] = createAsyncReducer(
        actionTypePrefix,
        // Custom state - an addition to async state (loading, value, error)
        additionalState,
        additionalStateHandlers
    );

    /**
     * search object properties: loading, value, error, submission
     * dispatch object contains methods to update the states outlined above
     */
    const [search, dispatch] = useAsyncReducer(
        actionTypePrefix,
        searchReducer,
        initialState
    );

    return (
        <SearchStateContext.Provider value={search}>
            <SearchDispatchContext.Provider value={dispatch}>
                {children}
            </SearchDispatchContext.Provider>
        </SearchStateContext.Provider>
    );
};
