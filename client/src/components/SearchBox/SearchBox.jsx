// MUI
// -- Components
import { InputBase } from "@material-ui/core";
// -- Icons
import { Search as SearchIcon } from "@material-ui/icons";

import useStyles from "./styles";

const SearchBox = ({ handleSearch }) => {
    const classes = useStyles();

    return (
        <div className={classes.searchBar}>
            <div className={classes.searchBox}>
                <SearchIcon className={classes.searchIcon} />

                <InputBase
                    className={classes.searchInput}
                    onKeyDown={handleSearch}
                    placeholder="Search Books..."
                />
                {/* TODO Add Submit button here */}
            </div>
        </div>
    );
};

export default SearchBox;
