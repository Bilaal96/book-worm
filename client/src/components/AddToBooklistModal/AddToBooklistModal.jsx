// Components
import PopupModal from "components/PopupModal/PopupModal";
import MasterList from "components/MasterList/MasterList";

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
const AddToBooklistModal = ({ openModal, setOpenModal }) => {
    // Add books ID to bookIds array
    const handleListItemClick = () => (e) => {
        console.log("Added books ID to bookIds array");
    };

    return (
        <PopupModal
            title="Select A List To Add A Book To"
            openModal={openModal}
            setOpenModal={setOpenModal}
        >
            <MasterList handleListItemClick={handleListItemClick} modal />
        </PopupModal>
    );
};

export default AddToBooklistModal;
