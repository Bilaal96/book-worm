import PropTypes from "prop-types";

// Contexts
import { useSearchContext } from "contexts/search/search.context";

// Components
import { Typography } from "@material-ui/core";
import BooksGrid from "components/BooksGrid/BooksGrid";

const SearchResults = ({ resultsPagination: ResultsPagination }) => {
    const [search] = useSearchContext();

    // No searches made, prompt user
    if (search.results === null) {
        return (
            <Typography variant="h4" component="p" align="center">
                Find books using the search bar above
            </Typography>
        );
    }

    // Books found, display in paginated BooksGrid
    if (search.results.items?.length > 0) {
        return (
            <>
                <Typography variant="h5" component="p" align="center">
                    {`Showing results for: "${search.submission}"`}
                </Typography>

                {ResultsPagination}
                <BooksGrid booksFound={search.results} />
                {ResultsPagination}
            </>
        );
    } else {
        // No results found that match the search term entered
        return (
            <Typography variant="h4" component="p" align="center">
                No results found, try searching for something else
            </Typography>
        );
    }
};

// Allowing null values: https://github.com/facebook/react/issues/3163
SearchResults.propTypes = {
    resultsPagination: PropTypes.object.isRequired,
};

export default SearchResults;
