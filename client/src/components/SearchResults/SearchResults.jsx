import PropTypes from "prop-types";

// Custom Hooks
import useSearchContext from "hooks/useSearchContext.js";

// Components
import { Typography } from "@material-ui/core";
import BooksGrid from "components/BooksGrid/BooksGrid";

const SearchResults = ({ resultsPagination: ResultsPagination }) => {
    const [search] = useSearchContext();

    // No results found that match the search term entered
    if (search.value === undefined) {
        return (
            <Typography variant="h4" component="p" align="center">
                No results found, try searching for something else
            </Typography>
        );
    }

    // Books found, display in paginated BooksGrid
    if (search.value?.items.length > 0) {
        return (
            <>
                <Typography variant="h5" component="p" align="center">
                    {`Showing results for: "${search.submission}"`}
                </Typography>

                {ResultsPagination}
                <BooksGrid booksFound={search.value} />
                {ResultsPagination}
            </>
        );
    } else {
        // No searches made, prompt user
        return (
            <Typography variant="h4" component="p" align="center">
                Find books using the search bar above
            </Typography>
        );
    }
};

// Allowing null values: https://github.com/facebook/react/issues/3163
SearchResults.propTypes = {
    resultsPagination: PropTypes.element.isRequired,
};

export default SearchResults;
