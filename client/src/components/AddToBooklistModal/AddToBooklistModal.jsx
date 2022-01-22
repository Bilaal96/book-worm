import { useContext, useState, useEffect } from "react";

// Context
import { AuthContext } from "contexts/auth/auth.context";
import { MasterListContext } from "contexts/master-list/master-list.context";

// Components
import PopupModal from "components/PopupModal/PopupModal";
import MasterList from "components/MasterList/MasterList";
import ActionRequiresLoginModal from "components/ActionRequiresLoginModal/ActionRequiresLoginModal";
import Alert from "@material-ui/lab/Alert";

/** TODO
 * Search box - used to filter list
 * Notifications
 */
const AddToBooklistModal = ({ book: bookToAdd, openModal, setOpenModal }) => {
    const auth = useContext(AuthContext);
    const { masterList, setMasterList } = useContext(MasterListContext);
    const [error, setError] = useState(null);

    // For booklist with _id === targetBooklistId, add book to booklist.books array
    const addBookToBooklist = (targetBooklistId) => async (e) => {
        try {
            // Find the booklist that the user wants to add a book to
            const booklistToUpdate = masterList.find(
                (booklist) => booklist._id === targetBooklistId
            );

            // booklistToUpdate was not found
            if (booklistToUpdate === undefined)
                throw Error(
                    "Something went wrong, that booklist does not exist"
                );

            // Prevent current user from adding a book to a list they do not own
            if (auth.user.id !== booklistToUpdate.userId)
                throw Error("Unauthorized request");

            // If list already contains a book, prevent duplication
            if (booklistToUpdate.books.some((book) => book.id === bookToAdd.id))
                throw Error("That book already exists in this booklist");

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

            // Clear any errors shown for previous action(s)
            setError(null);
            // Close modal
            setOpenModal(false);
        } catch (err) {
            console.error(err.message);
            setError(err);
        }
    };

    // Hide error (if any) after 3 seconds
    useEffect(() => {
        if (error === null) return;
        const errorTimeout = setTimeout(() => setError(null), 3000);
        return () => clearTimeout(errorTimeout);
    }, [error]);

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
        >
            {/* Display Request Error (if any) */}
            {error && (
                <Alert style={{ margin: "0 0 16px" }} severity="error">
                    {error.message}
                </Alert>
            )}
            {/* MasterList - displays all user booklists */}
            <MasterList handleListItemClick={addBookToBooklist} modal />
        </PopupModal>
    );
};

export default AddToBooklistModal;
