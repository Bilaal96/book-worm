import PropTypes from "prop-types";
import { useState } from "react";

// Components
import { makeStyles, Paper } from "@material-ui/core";
import MetadataViewMode from "components/MetadataViewMode/MetadataViewMode.jsx";
import MetadataEditMode from "components/MetadataEditMode/MetadataEditMode.jsx";

// Styles
const useStyles = makeStyles((theme) => ({
    paper: {
        display: "flex",
        flexDirection: "column",
        padding: theme.spacing(2),
        gap: theme.spacing(1),
    },
}));

/** 
 * Displays metadata for a booklist, including: 
    - editable title & description 
    - number of books in the list 
    - when list was last updated 
 */
const BooklistMetadata = ({ booklist }) => {
    const classes = useStyles();

    // State used to toggle between edit/display mode components
    const [editMode, setEditMode] = useState(false);

    const { _id, title, description, books, updatedAt } = booklist;

    const metadataProps = {
        // Metadata
        listId: _id,
        title,
        description,
        booksCount: books.length,
        lastUpdated: new Date(updatedAt).toLocaleDateString(),
        // Used to toggle between MetadataEditMode & MetadataViewMode
        setEditMode,
    };

    return (
        <Paper className={classes.paper} elevation={2}>
            {editMode ? (
                <MetadataEditMode {...metadataProps} />
            ) : (
                <MetadataViewMode {...metadataProps} />
            )}
        </Paper>
    );
};

BooklistMetadata.propTypes = {
    booklist: PropTypes.object.isRequired,
};

export default BooklistMetadata;
