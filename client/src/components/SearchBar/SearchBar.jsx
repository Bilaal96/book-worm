import { useState } from "react";
import PropTypes from "prop-types";

// Components
import { InputBase, Button } from "@material-ui/core";

// MUI Icons
import { Search as SearchIcon } from "@material-ui/icons";

// Helpers
import { isValidSearchString } from "helpers/search-string-validation";

import useStyles from "./styles";

const SearchBar = ({
    fetchBooks,
    previousSearch,
    setSearchSubmission,
    setSelectedPage,
    isFetchingBooks,
}) => {
    const classes = useStyles();

    const [searchInput, setSearchInput] = useState("");

    // When input value changes, update searchTerm state
    const handleChange = (e) => {
        setSearchInput(e.target.value);
    };

    // Handle Async request on search button click / enter key press (keydown)
    const handleSearchSubmit = async (e) => {
        // Validate input
        if ((e.type === "keydown" && e.key === "Enter") || e.type === "click") {
            if (!isValidSearchString(searchInput))
                return console.error("|| Cannot submit empty search ||");

            // prevent resubmission of previous search
            if (searchInput === previousSearch)
                return console.log("Search term has not changed");

            // Store submitted search term for making paginated requests
            setSearchSubmission(searchInput);

            // Requests books data from Books API and updates app state appropriately
            fetchBooks({ search: searchInput });

            // Reset page to 1 on new search submission
            setSelectedPage(1);
        }
    };

    return (
        <div className={classes.searchBar}>
            <div className={classes.searchBox}>
                <SearchIcon className={classes.searchIcon} />

                <InputBase
                    className={classes.searchInput}
                    onChange={handleChange}
                    onKeyDown={handleSearchSubmit}
                    placeholder="e.g. The Great Gatsby"
                    disabled={isFetchingBooks}
                />
            </div>

            <Button
                className={classes.searchSubmit}
                variant="contained"
                color="secondary"
                onClick={handleSearchSubmit}
                disableElevation
                disabled={isFetchingBooks}
            >
                Search
            </Button>
        </div>
    );
};

SearchBar.propTypes = {
    fetchBooks: PropTypes.func.isRequired,
    previousSearch: PropTypes.string.isRequired,
    setSearchSubmission: PropTypes.func.isRequired,
    setSelectedPage: PropTypes.func.isRequired,
    isFetchingBooks: PropTypes.bool.isRequired,
};

export default SearchBar;
