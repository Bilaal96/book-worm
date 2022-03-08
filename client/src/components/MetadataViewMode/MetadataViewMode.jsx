import PropTypes from "prop-types";

// Components
import { makeStyles, Typography, Button } from "@material-ui/core";
import { Edit } from "@material-ui/icons";

// Styles
const useStyles = makeStyles((theme) => ({
    viewModeActions: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: theme.spacing(1),
    },
}));

// Displays metadata for a booklist
// Edit button renders MetadataEditMode (in place of MetadataViewMode)
const MetadataViewMode = ({
    title,
    description,
    booksCount,
    lastUpdated,
    setEditMode,
}) => {
    const classes = useStyles();

    return (
        <>
            {/* Title */}
            <Typography variant="h4" component="h2" color="secondary">
                {title}
            </Typography>

            {/* Description */}
            <Typography component="p" variant="h6">
                {description ? (
                    `Summary: ${description}`
                ) : (
                    <em>Summary not available</em>
                )}
            </Typography>
            {/* Total Books Count */}
            <Typography component="p" variant="body1">
                Total books in list: {booksCount}
            </Typography>

            {/* Edit Button - enters edit mode */}
            <div className={classes.viewModeActions}>
                {/* Last Updated - date format: DD/MM/YY */}
                <Typography component="p" variant="body2" color="textSecondary">
                    <em>Last updated: {lastUpdated}</em>
                </Typography>
                <Button
                    color="primary"
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => setEditMode(true)}
                >
                    Edit
                </Button>
            </div>
        </>
    );
};

MetadataViewMode.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    booksCount: PropTypes.number.isRequired,
    lastUpdated: PropTypes.string.isRequired,
    setEditMode: PropTypes.func.isRequired,
};

export default MetadataViewMode;
