import { useContext } from "react";

// Context
import { MasterListContext } from "contexts/master-list/master-list.context";

// Components
import PopupModal from "components/PopupModal/PopupModal";

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
    const masterList = useContext(MasterListContext);
    console.log("MODAL", masterList);

    return (
        <PopupModal
            title="Add Book To A List"
            // title="Add Book to Booklist"
            // title="Save To List"
            openModal={openModal}
            setOpenModal={setOpenModal}
        >
            testing testing, things just got more inter-resting
            {masterList.items
                .filter((booklist) => {
                    /* TODO */
                    /* If search input has a value, filter list */
                    /* if (input.length) {} */
                    return true;
                })
                .map((booklist, index) => (
                    <div key={index}>
                        <p>Title: {booklist.title}</p>
                        <ul>
                            <li>
                                <p>Description: {booklist.description}</p>
                            </li>
                            <li>
                                <p>bookIds: {booklist.bookIds.join(", ")}</p>
                            </li>
                        </ul>
                    </div>
                ))}
        </PopupModal>
    );
};

export default AddToBooklistModal;
