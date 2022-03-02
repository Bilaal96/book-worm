import PropTypes from "prop-types";

// Custom Hooks
import useSearchContext from "hooks/useSearchContext.js";

// Components
import { Typography } from "@material-ui/core";
import WidthContainer from "components/WidthContainer/WidthContainer";
import CustomBackdrop from "components/CustomBackdrop/CustomBackdrop";
import BookCardsGrid from "components/BookCardsGrid/BookCardsGrid";
import UserAppeal from "components/UserAppeal/UserAppeal";

const SearchResults = ({ resultsPagination: ResultsPagination }) => {
    const [search] = useSearchContext();

    // Fetching data, show loading screen
    if (search.loading) {
        return (
            <WidthContainer component="section">
                <CustomBackdrop
                    text="Finding books"
                    position="absolute" // relative to WidthContainer
                    spinner={60}
                />
            </WidthContainer>
        );
    }

    // No results found that match the search term entered
    if (search.value === undefined) {
        return (
            <WidthContainer component="section" padding={{ top: 6 }}>
                <CustomBackdrop
                    text="No results found"
                    position="absolute" // relative to WidthContainer
                />
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
                    <BookCardsGrid books={search.value.items} />
                    {ResultsPagination}
                </WidthContainer>
            </>
        );
    } else {
        // Default home page content, shown when no searches have been made
        // Explains use-cases of the application to the user
        return <UserAppeal />;
    }
};

SearchResults.propTypes = {
    resultsPagination: PropTypes.element.isRequired,
};

export default SearchResults;
