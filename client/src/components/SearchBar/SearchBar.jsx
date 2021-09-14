import { useState } from "react";

// Components
import { InputBase, Button } from "@material-ui/core";

// MUI Icons
import { Search as SearchIcon } from "@material-ui/icons";

import useStyles from "./styles";

const SearchBar = ({ setBooks }) => {
    const classes = useStyles();

    const [previousSearch, setPreviousSearch] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    console.log({ searchTerm }); // Track changes to searchTerm

    // When input value changes, update searchTerm state
    const handleChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handle Async request on search button click
    const handleSearchSubmit = async (e) => {
        // Do not proceed if search box is empty OR searchTerm has not changed
        if (searchTerm.length === 0 || previousSearch === searchTerm) return;

        /**
         * Only request books if:
            - "Enter" key pressed (keydown)
            - search button clicked
         */
        if ((e.type === "keydown" && e.key === "Enter") || e.type === "click") {
            // Build request endpoint
            const apiSearchEndpoint = `http://localhost:5000/?search=${encodeURIComponent(
                searchTerm
            )}`;

            // Send request to API to search for Books
            try {
                const response = await fetch(apiSearchEndpoint);
                const data = await response.json();

                setBooks(data);
            } catch (err) {
                console.error("fetchBooks ERROR: ", err);
            }

            setPreviousSearch(searchTerm);
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
                />
            </div>

            <Button
                className={classes.searchSubmit}
                variant="contained"
                color="secondary"
                onClick={handleSearchSubmit}
                disableElevation
            >
                Search
            </Button>
        </div>
    );
};

export default SearchBar;
