import PropTypes from "prop-types";

import { Typography, Button } from "@material-ui/core";
import { Edit } from "@material-ui/icons";

const MetadataViewMode = ({
    title,
    description,
    setEditMode,
    parentStyles,
}) => {
    return (
        <>
            {/* Title */}
            <Typography variant="h4" component="h2">
                {title}
            </Typography>

            {/* Description */}
            {description.length ? (
                <Typography
                    variant="body1"
                    component="p"
                    style={{ maxWidth: "800px" }}
                >
                    Description: {description}
                </Typography>
            ) : (
                <Typography
                    variant="body1"
                    component="p"
                    style={{ maxWidth: "800px" }}
                >
                    Description: <em>unavailable</em>
                </Typography>
            )}

            {/* Edit Button - enters edit mode */}
            <div className={parentStyles.actions}>
                <Button
                    className={parentStyles.editButton}
                    color="primary"
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => setEditMode(true)}
                >
                    Edit Details
                </Button>
            </div>
        </>
    );
};

MetadataViewMode.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    setEditMode: PropTypes.func.isRequired,
    parentStyles: PropTypes.object.isRequired,
};

export default MetadataViewMode;
