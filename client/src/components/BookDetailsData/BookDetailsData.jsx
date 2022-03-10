import PropTypes from "prop-types";
import { Fragment } from "react";

// Components
import { makeStyles, Paper, Typography } from "@material-ui/core";

// Styles
const useStyles = makeStyles((theme) => ({
    paper: {
        display: "grid",
        gridTemplateColumns: "1.2fr repeat(3, 1fr)",
        padding: theme.spacing(2),
        rowGap: theme.spacing(0.3),
    },
    dataType: {
        color: theme.palette.common.white,
        backgroundColor: theme.palette.primary.main,
        padding: theme.spacing(1),
        gridColumn: "1 / 2",
        textAlign: "center",
    },
    dataValue: {
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(1),
        gridColumn: "2 / 5",
    },
}));

/**
 * Lists data about a particular book from the Google Books API
 * On mobile/tablet -> renders above BookDetailsTabs
 * On laptop/desktop -> renders to right of BookDetailsTabs (as an "aside" component)
 */
const BookDetailsData = ({ book }) => {
    const classes = useStyles();

    // Properties to display from Google book data
    const {
        categories,
        industryIdentifiers,
        language,
        pageCount,
        publisher,
        publishedDate,
    } = book.volumeInfo;

    // Extracts and returns ISBN Identifiers if they exist
    // NOTE: Return value must be iterable so that we can apply the spread operator on it
    const getIsbnIdentifiers = () => {
        // ISBN unknown, return empty array
        if (industryIdentifiers === undefined) return [];

        // Extracts and return an array of ISBN Identifiers
        return industryIdentifiers.map((isbn) => ({
            type: isbn.type, // ISBN_10 / ISBN_13
            value: isbn.identifier, // number
        }));
    };

    // Extract data points (to be displayed) into array
    const dataPoints = [
        // Array of categories
        { type: "Category", value: categories?.join(", ") },
        // spread array of ISBN Identifiers
        ...getIsbnIdentifiers(),
        { type: "Language", value: language },
        { type: "Page Count", value: pageCount },
        { type: "Publisher", value: publisher },
        { type: "Publish Date", value: publishedDate },
    ];
    console.log("BOOK DETAILS DATA", dataPoints);

    return (
        <Paper className={classes.paper}>
            {dataPoints?.map((data, index) => (
                <Fragment key={index}>
                    <Typography className={classes.dataType} variant="body2">
                        {data?.type}:
                    </Typography>
                    <Typography className={classes.dataValue} variant="body2">
                        {data?.value ? `${data.value}` : <em>unknown</em>}
                    </Typography>
                </Fragment>
            ))}
        </Paper>
    );
};

BookDetailsData.propTypes = {
    book: PropTypes.object.isRequired,
};

export default BookDetailsData;
