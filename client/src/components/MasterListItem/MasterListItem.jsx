import PropTypes from "prop-types";
import { useState, useContext } from "react";
import { useSnackbar } from "notistack";
import { useTheme, useMediaQuery } from "@material-ui/core";

// Contexts
import { AuthContext } from "contexts/auth/auth.context.js";
import { MasterListContext } from "contexts/master-list/master-list.context.js";

// Components
import { Grid, IconButton, Paper, Typography } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import ConfirmActionModal from "components/ConfirmActionModal/ConfirmActionModal";

import useStyles from "./styles.js";

/**
 * MasterListItem (MLI) renders an interactive thumbnail/link for a user created booklist.
 * By default (i.e. without the modal prop - see below), MLI will:
    - navigate to the "/manage-lists/:id" route (on click) 
    - provide the option to delete the MLI (i.e. a single booklist)
 
 * @param { Object } booklist - Data representing a single user booklist. A booklist is an element of a booklists array - which is fetched from the DB.
 * @param { Function } onListItemClick - Handles onClick event for a single MLI.
 * @param { Boolean } [modal]
 * Used to customise styles and interactive options when rendered in AddToBooklistModal.
 * When specified:
    - clicking a MLI adds a book to the relevant booklist in the DB and updates the UI
    - a booklist cannot be deleted; i.e. delete booklist button is not rendered
 */
const MasterListItem = ({
    booklist,
    onListItemClick: handleListItemClick,
    modal,
}) => {
    // Breakpoint used to determine value of delete button's size prop
    const theme = useTheme();
    const breakpointSmallUp = useMediaQuery(theme.breakpoints.up("sm"));

    const styleProps = { modal };
    const classes = useStyles(styleProps);

    const { enqueueSnackbar } = useSnackbar();
    const { accessToken, user } = useContext(AuthContext);
    const { masterList, setMasterList } = useContext(MasterListContext);

    const [openModal, setOpenModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // booklist prop
    const {
        _id,
        title,
        description,
        books,
        userId: booklistOwner,
        updatedAt,
    } = booklist;

    const deleteBooklist = async () => {
        try {
            // Prevent user from requesting deletion of a list they do not own
            if (user.id !== booklistOwner) throw Error("Unauthorized request");

            // User owns booklist, send request to delete it
            setIsDeleting(true); // init loading state
            const response = await fetch(
                `http://localhost:5000/booklists/${_id}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            // Request to delete booklist failed
            if (!response.ok) {
                const error = await response.json();
                throw error;
            }

            // Request to delete booklist succeeded
            // Update masterList by filtering out the deleted booklist
            const updatedMasterList = masterList.filter(
                (list) => list._id !== _id
            );

            setMasterList(updatedMasterList); // causes MasterList to re-render
            console.log(`Delete booklist with id: ${_id}`);
            setIsDeleting(false); // end loading state

            // Display success notification
            const successNotification = "List deleted successfully 🔫";
            enqueueSnackbar(successNotification, { variant: "success" });
        } catch (err) {
            console.error(err);
            setIsDeleting(false); // end loading state

            // Display error notification
            const errorNotification =
                "Failed to delete list 🤔. If this problem persists please try again later.";
            enqueueSnackbar(errorNotification, { variant: "error" });
        }
    };

    return (
        <>
            {/* NOTE: MasterListItem is not deletable from modal */}
            {modal ? null : (
                <ConfirmActionModal
                    title="Delete Booklist"
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    buttons={{
                        positive: {
                            action: deleteBooklist,
                            async: { loading: isDeleting, altText: "Deleting" },
                            startIcon: <Delete />,
                            text: "Delete",
                        },
                    }}
                >
                    <Typography
                        style={{ fontSize: "18px", padding: "14px 28px" }}
                        variant="body1"
                    >
                        Are you sure you want to permanently delete this
                        booklist and all of its content?
                    </Typography>
                </ConfirmActionModal>
            )}

            <Grid item xs={12}>
                <Paper className={classes.paper} elevation={2}>
                    {/* Booklist Details */}
                    <div
                        className={classes.details}
                        onClick={handleListItemClick(_id)}
                        tabIndex="0"
                        aria-label={
                            modal
                                ? `Add book to list`
                                : `View ${title ? `"${title}"` : ""} list`
                        }
                    >
                        {/* Title */}
                        <Typography
                            className={classes.title}
                            component="h2"
                            variant="h4"
                        >
                            {title ? `${title}` : "Unknown Title"}
                        </Typography>

                        {/* Description */}
                        <Typography
                            className={classes.description}
                            component="p"
                            variant="h6"
                        >
                            {description ? (
                                `Summary: ${description}`
                            ) : (
                                <em>Summary not available</em>
                            )}
                        </Typography>

                        {/* Total Books Count */}
                        <Typography component="p" variant="body1">
                            Total books in list: {books.length}
                        </Typography>

                        {/* Last Updated - date format: DD/MM/YY */}
                        <Typography
                            component="p"
                            variant="body2"
                            color="textSecondary"
                        >
                            <em>
                                Last updated:{" "}
                                {new Date(updatedAt).toLocaleDateString()}{" "}
                            </em>
                        </Typography>

                        {/* Book Ids - TESTING ONLY */}
                        {/* <Typography component="p" variant="body1">
                                Id of books stored:{" "}
                                {books.map((book) => book.id).join(", ")}
                            </Typography> */}
                    </div>

                    {/* Booklist Actions (for use in NON-modal only) */}
                    {/* NOTE: MasterListItem is not deletable from modal */}
                    {modal ? null : (
                        <div className={classes.actions}>
                            <IconButton
                                className={classes.deleteButton}
                                onClick={() => setOpenModal(true)}
                                aria-label="Delete list"
                            >
                                <Delete
                                    fontSize={
                                        breakpointSmallUp ? "large" : "medium"
                                    }
                                />
                            </IconButton>
                        </div>
                    )}
                </Paper>
            </Grid>
        </>
    );
};

MasterListItem.propTypes = {
    booklist: PropTypes.object.isRequired,
    onListItemClick: PropTypes.func.isRequired,
    modal: PropTypes.bool,
};

export default MasterListItem;
