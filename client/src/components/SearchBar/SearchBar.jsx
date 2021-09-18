import { useState, useEffect } from "react";

// Components
import { InputBase, Button } from "@material-ui/core";

// MUI Icons
import { Search as SearchIcon } from "@material-ui/icons";

import useStyles from "./styles";

const SearchBar = ({ setSearchSubmission, setPage, isLoading }) => {
    const classes = useStyles();

    const [searchInput, setSearchInput] = useState("");
    // console.log("SearchBar", { searchInput });

    // When input value changes, update searchTerm state
    const handleChange = (e) => {
        setSearchInput(e.target.value);
    };

    // Handle Async request on search button click / enter key press (keydown)
    const handleSearchSubmit = async (e) => {
        // Validate input
        if ((e.type === "keydown" && e.key === "Enter") || e.type === "click") {
            if (!searchInput.length)
                return console.error("Cannot submit empty search");

            setSearchSubmission(searchInput);
            // Reset page to 1 on new search
            setPage(1);
        }
    };

    useEffect(() => {
        console.log("SearchBar rendered");
    }, []);

    return (
        <div className={classes.searchBar}>
            <div className={classes.searchBox}>
                <SearchIcon className={classes.searchIcon} />

                <InputBase
                    className={classes.searchInput}
                    onChange={handleChange}
                    onKeyDown={handleSearchSubmit}
                    placeholder="e.g. The Great Gatsby"
                    disabled={isLoading}
                />
            </div>

            <Button
                className={classes.searchSubmit}
                variant="contained"
                color="secondary"
                onClick={handleSearchSubmit}
                disableElevation
                disabled={isLoading}
            >
                Search
            </Button>
        </div>
    );
};

export default SearchBar;
