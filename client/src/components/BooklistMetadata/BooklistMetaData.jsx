import PropTypes from "prop-types";
import { useState } from "react";

// Components
import { Paper } from "@material-ui/core";
import MetadataViewMode from "components/MetadataViewMode/MetadataViewMode.jsx";
import MetadataEditMode from "components/MetadataEditMode/MetadataEditMode.jsx";

import useStyles from "./styles.js";

// Displays title and description of a booklist
const BooklistMetadata = ({ booklist }) => {
    const { _id, title, description } = booklist; // metadata

    // State used to toggle between edit/display mode components
    const [editMode, setEditMode] = useState(false);

    const styleProps = { editMode };
    const classes = useStyles(styleProps);

    const metaDataProps = {
        listId: _id,
        title,
        description,
        setEditMode,
        parentStyles: classes,
    };

    return (
        <Paper className={classes.paper} elevation={2}>
            {editMode ? (
                <MetadataEditMode {...metaDataProps} />
            ) : (
                <MetadataViewMode {...metaDataProps} />
            )}
        </Paper>
    );
};

BooklistMetadata.propTypes = {
    booklist: PropTypes.object.isRequired,
};

export default BooklistMetadata;
