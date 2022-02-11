import { useContext } from "react";

// Search Contexts
import {
    SearchStateContext,
    SearchDispatchContext,
} from "contexts/search/search.context";

// Custom hook that consumes and returns Search Contexts
const useSearchContext = () => {
    const search = useContext(SearchStateContext);
    const dispatchSearch = useContext(SearchDispatchContext);

    return [search, dispatchSearch];
};

export default useSearchContext;
