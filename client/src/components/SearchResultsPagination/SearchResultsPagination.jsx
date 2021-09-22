import PropTypes from "prop-types";

import Pagination from "@material-ui/lab/Pagination";

import useStyles from "./styles";

const SearchResultsPagination = ({
    selectedPage,
    setSelectedPage,
    pageCount,
    isFetchingBooks,
}) => {
    const classes = useStyles();

    /**
     * Set selected page on click of Pagination buttons
     * NOTE: updating selectedPage state triggers a side-effect in SearchResults which requests paginated book data
     */
    const handlePageChange = (event, value) => {
        setSelectedPage(value);
    };

    return (
        <Pagination
            className={classes.pagination}
            onChange={handlePageChange}
            page={selectedPage}
            count={pageCount}
            variant="outlined"
            color="secondary"
            showFirstButton
            showLastButton
            disabled={isFetchingBooks}
        />
    );
};

SearchResultsPagination.propTypes = {
    selectedPage: PropTypes.number.isRequired,
    setSelectedPage: PropTypes.func.isRequired,
    pageCount: PropTypes.number.isRequired,
    isFetchingBooks: PropTypes.bool.isRequired,
};

export default SearchResultsPagination;
