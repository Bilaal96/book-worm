import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

// Custom Hooks
import useSearchContext from "hooks/useSearchContext.js";

// Components
import { Typography } from "@material-ui/core";
import WidthContainer from "components/WidthContainer/WidthContainer";
import CustomBackdrop from "components/CustomBackdrop/CustomBackdrop";
import BookCardsList from "components/BookCardsList/BookCardsList";
import UserAppeal from "components/UserAppeal/UserAppeal";

const SearchResults = ({ resultsPagination: ResultsPagination }) => {
    const history = useHistory();
    const [search] = useSearchContext();

    const navigateToBookDetailsRoute = (bookId) => (e) =>
        history.push(`/books/${bookId}`);

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

    // Books found, display in paginated BookCardsList
    if (search.value?.items.length > 0) {
        return (
            <>
                <WidthContainer component="section" padding={{ top: 6 }}>
                    <Typography variant="h5" component="p" align="center">
                        {`Showing results for "${search.submission}"`}
                    </Typography>

                    {ResultsPagination}
                    {/* Render BookCardsList with default styles */}
                    <BookCardsList
                        books={search.value.items}
                        handleBookDetailsClick={navigateToBookDetailsRoute}
                    />
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
