import { useState } from "react";
import PropTypes from "prop-types";

// Contexts
import { useSearchContext } from "contexts/search/search.context";

// Components
import { InputBase, Button } from "@material-ui/core";

// MUI Icons
import { Search as SearchIcon } from "@material-ui/icons";

// Utils
import { isValidSearchString } from "utils/search-string-validation";

import useStyles from "./styles";

const SearchBar = ({ fetchBooks, setSelectedPage }) => {
    const classes = useStyles();
    const [searchInput, setSearchInput] = useState("");
    const [search, dispatchSearch] = useSearchContext();

    // When input value changes, update searchTerm state
    const handleChange = (e) => {
        setSearchInput(e.target.value);
    };

    // Handle Async request on search button click / enter key press (keydown)
    const handleSearchSubmit = async (e) => {
        // Validate user inputs
        if ((e.type === "keydown" && e.key === "Enter") || e.type === "click") {
            if (!isValidSearchString(searchInput))
                return console.info(
                    "%c Search box requires a valid search term ",
                    "background: rgba(0, 0, 0, 0.4); color: crimson"
                );

            // Prevent resubmission of previous search
            if (searchInput === search.submission)
                return console.info(
                    `%c Already showing results for "${searchInput}" `,
                    "background: rgba(0, 0, 0, 0.4); color: #bada55"
                );

            // Store submitted search term in SearchContext
            // -- for making paginated requests and preventing resubmissions
            dispatchSearch({
                type: "UPDATE_SEARCH_SUBMISSION",
                payload: searchInput,
            });

            // Request books data (for page 1) from Books API and updates SearchContext when appropriate
            fetchBooks({ search: searchInput });

            // Reset page (in state and sessionStorage) to 1
            setSelectedPage(1);
            sessionStorage.setItem("results-page", JSON.stringify(Number(1)));
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
                    disabled={search.isFetching}
                />
            </div>

            <Button
                className={classes.searchSubmit}
                variant="contained"
                color="secondary"
                onClick={handleSearchSubmit}
                disableElevation
                disabled={search.isFetching}
            >
                Search
            </Button>
        </div>
    );
};

SearchBar.propTypes = {
    fetchBooks: PropTypes.func.isRequired,
    setSelectedPage: PropTypes.func.isRequired,
};

export default SearchBar;
