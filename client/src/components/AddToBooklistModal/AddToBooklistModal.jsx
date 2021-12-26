import { useContext } from "react";

// Context
import { MasterListContext } from "contexts/master-list/master-list.context";

// Components
import PopupModal from "components/PopupModal/PopupModal";

const AddToBooklistModal = ({ openModal, setOpenModal }) => {
    const masterList = useContext(MasterListContext);
    console.log("MODAL", masterList);

    return (
        <PopupModal
            title="Add Book To A List"
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
                .map((booklist) => (
                    <div>
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
