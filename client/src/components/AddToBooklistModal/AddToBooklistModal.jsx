import { useContext } from "react";

// Context
import MasterListProvider from "contexts/master-list/master-list.provider";
import { AuthContext } from "contexts/auth/auth.context";

// Components
import PopupModal from "components/PopupModal/PopupModal";
import MasterList from "components/MasterList/MasterList";
import ActionRequiresLoginModal from "components/ActionRequiresLoginModal/ActionRequiresLoginModal";

// --- AddToBooklistModal
/**       
 * Will be reused in:
    - BookCard (to add book to an existing list) -> Create openModal state in PARENT: BookGrid 
    - BookListPage (to add book from current list-in-view to another list)
 
 * Create:
 * Search box - used to filter list
 * List of BookListItems -> with onClick -> triggering add to list
    - add to list 
        -> request to server, add bookId to a bookList array in DB
        -> also adds book to state
 
 * Context is required to track state of BookLists in app
 * Thus allowing use of synced state across multiple components
     - PopupModal, MasterListPage / BookListPage

 * SIDE-NOTE: could even create a new AddToList component, containing the add button and PopupModal
 */
const AddToBooklistModal = ({ book, openModal, setOpenModal }) => {
    const auth = useContext(AuthContext);

    // For booklist with id === listId, add book.id to booklist.bookIds array
    const handleListItemClick = (listId) => (e) => {
        console.log(`Added ${book.id} to bookIds array in ${listId}`);
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
        >
            <MasterListProvider>
                <MasterList handleListItemClick={handleListItemClick} modal />
            </MasterListProvider>
        </PopupModal>
    );
};

export default AddToBooklistModal;
