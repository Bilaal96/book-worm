import PropTypes from "prop-types";

// Components
import { Paper, Typography } from "@material-ui/core";

/**
 * NOTE potential improvement:
 * Display in Grid / Flex container
 * or in table: https://v4.mui.com/components/tables/#basic-table
 
 * Create LabelledData component with consistent styling for label and data
 * pass in data, component should only render if the data passed is not undefined
 */

/** 
 * on mobile, show above Tabs
 * on laptop/desktop -> show to right of Tabs 
 
 * Properties
    - categories -> array
    - industryIdentifiers -> obj with ISBN
        - type -> ISBN_10 / ISBN_13
        - identifier -> number
    - language -> use package to convert to full lang. name
    - pageCount
    - publisher
    - publishedDate  
 * [MAYBE] 
    - infoLink -> more info button
    - maturityRating - most of the time it is  "NOT_MATURE" 
 */
const BookDetailsData = ({ book }) => {
    const { volumeInfo } = book;
    const {
        categories,
        industryIdentifiers,
        language,
        pageCount,
        publisher,
        publishedDate,
    } = volumeInfo;

    return (
        <Paper style={{ padding: "16px" }}>
            {industryIdentifiers?.map((isbn, index) => (
                <Typography key={index} variant="body2">
                    {`${isbn.type}: ${isbn.identifier}`}
                </Typography>
            ))}

            <Typography variant="body2">Category: {categories}</Typography>
            <Typography variant="body2">Language: {language}</Typography>
            <Typography variant="body2">Page Count: {pageCount}</Typography>
            <Typography variant="body2">Publisher: {publisher}</Typography>
            <Typography variant="body2">
                Publish Date: {publishedDate}
            </Typography>
        </Paper>
    );
};

BookDetailsData.propTypes = {
    book: PropTypes.object.isRequired,
};

export default BookDetailsData;
