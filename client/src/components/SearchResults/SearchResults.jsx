import PropTypes from "prop-types";

// Custom Hooks
import useSearchContext from "hooks/useSearchContext.js";

// Components
import { Typography } from "@material-ui/core";
import WidthContainer from "components/WidthContainer/WidthContainer";
import ContentSpinner from "components/ContentSpinner/ContentSpinner";
import BooksGrid from "components/BooksGrid/BooksGrid";

const SearchResults = ({ resultsPagination: ResultsPagination }) => {
    const [search] = useSearchContext();

    // Fetching data, show loading screen
    if (search.loading) {
        return (
            <WidthContainer component="section">
                <ContentSpinner
                    text="Finding books"
                    open={true}
                    size={60}
                    // position relative to WidthContainer
                    position="absolute"
                    rounded
                />
            </WidthContainer>
        );
    }

    // No results found that match the search term entered
    if (search.value === undefined) {
        return (
            <WidthContainer component="section" padding={{ top: 6 }}>
                <Typography variant="h4" component="p" align="center">
                    No results found, try searching for something else
                </Typography>
            </WidthContainer>
        );
    }

    // Books found, display in paginated BooksGrid
    if (search.value?.items.length > 0) {
        return (
            <>
                <WidthContainer component="section" padding={{ top: 6 }}>
                    <Typography variant="h5" component="p" align="center">
                        {`Showing results for "${search.submission}"`}
                    </Typography>

                    {ResultsPagination}
                    <BooksGrid booksFound={search.value} />
                    {ResultsPagination}
                </WidthContainer>
            </>
        );
    } else {
        // No searches made, prompt user
        return (
            <WidthContainer component="section" padding={{ top: 6 }}>
                <Typography variant="h4" component="p" align="center">
                    Find books using the search bar above
                </Typography>
            </WidthContainer>
        );
    }
};

SearchResults.propTypes = {
    resultsPagination: PropTypes.element.isRequired,
};

export default SearchResults;
