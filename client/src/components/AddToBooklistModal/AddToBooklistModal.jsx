import PropTypes from "prop-types";
import { useContext } from "react";
import { useSnackbar } from "notistack";
import { makeStyles } from "@material-ui/core";

// Context
import { AuthContext } from "contexts/auth/auth.context";
import { MasterListContext } from "contexts/master-list/master-list.context";

// Components
import PopupModal from "components/PopupModal/PopupModal";
import MasterList from "components/MasterList/MasterList";
import ActionRequiresLoginModal from "components/ActionRequiresLoginModal/ActionRequiresLoginModal";

const useStyles = makeStyles((theme) => ({
    popupModalContent: {
        background: theme.palette.background.default,
    },
}));

/** TODO
 * Search box - used to filter list
 * Notifications
 */
const AddToBooklistModal = ({ book: bookToAdd, openModal, setOpenModal }) => {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    const auth = useContext(AuthContext);
    const { masterList, setMasterList, getBooklistById } =
        useContext(MasterListContext);

    // For booklist with _id === targetBooklistId, add book to booklist.books array
    const addBookToBooklist = (targetBooklistId) => async (e) => {
        try {
            // Find the booklist that the user wants to add a book to
            const booklistToUpdate = getBooklistById(targetBooklistId);

            // booklistToUpdate was not found
            if (booklistToUpdate === undefined)
                throw Error(
                    "Something went wrong, that booklist does not exist"
                );

            // Prevent current user from adding a book to a list they do not own
            if (auth.user.id !== booklistToUpdate.userId)
                throw Error("Unauthorized request");

            // If list already contains a book, prevent duplication
            if (
                booklistToUpdate.books.some((book) => book.id === bookToAdd.id)
            ) {
                const error = new Error(
                    "That book already exists in the selected booklist"
                );

                error.name = "DuplicateError";
                throw error;
            }
            // Make request to add book to list
            // -- i.e. insert bookToAdd into targetBooklist.books array
            const response = await fetch(
                `http://localhost:5000/booklists/${targetBooklistId}/books`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ bookToAdd }),
                }
            );

            // Request to add book to list failed, throw error
            if (!response.ok) {
                const error = await response.json();
                throw error;
            }

            // Request succeeded; returns the booklist updated with new book
            const updatedBooklist = await response.json();
            console.log("UPDATED BOOKLIST:", updatedBooklist);

            // Filter out old booklist (i.e. booklistToUpdate) from masterList
            let updatedMasterList = masterList.filter(
                (booklist) => booklist._id !== booklistToUpdate._id
            );
            // Add updatedBooklist to the BEGINNING of updatedMasterList
            updatedMasterList.unshift(updatedBooklist);
            setMasterList(updatedMasterList);

            // Close modal
            setOpenModal(false);

            // Display success notification
            const successNotification = `Added ${
                `"${bookToAdd.volumeInfo?.title}"` || "book"
            } to list: "${updatedBooklist.title}" 🤓`;
            enqueueSnackbar(successNotification, { variant: "success" });
        } catch (err) {
            console.error(err.message);

            // Display error notification
            // Duplicate error
            if (err.name === "DuplicateError")
                return enqueueSnackbar(err.message, { variant: "error" });

            // Other errors: e.g. network error
            const errorNotification =
                "Failed to add book to list 🤔. If this problem persists please try again later.";
            enqueueSnackbar(errorNotification, { variant: "error" });
        }
    };

    // Guest User
    // Notify user that login is required for this functionality
    if (!auth.user) {
        return (
            <ActionRequiresLoginModal
                openModal={openModal}
                setOpenModal={setOpenModal}
            />
        );
    }

    // User is logged in, render AddToBookListModal
    return (
        <PopupModal
            title="Select A List To Add A Book To"
            openModal={openModal}
            setOpenModal={setOpenModal}
            className={classes.popupModalContent}
        >
            {/* MasterList - displays all user booklists */}
            <MasterList handleListItemClick={addBookToBooklist} modal />
        </PopupModal>
    );
};

AddToBooklistModal.propTypes = {
    book: PropTypes.object.isRequired,
    openModal: PropTypes.bool.isRequired,
    setOpenModal: PropTypes.func.isRequired,
};

export default AddToBooklistModal;
