import { Dialog, DialogTitle, DialogContent } from "@material-ui/core";

// --- PopupModal
// Search Modal vs Dialog

// Mix
// https://v4.mui.com/components/dialogs/#responsive-full-screen
// https://v4.mui.com/components/dialogs/#customized-dialogs
// https://v4.mui.com/components/dialogs/#scrolling-long-content

// https://www.youtube.com/results?search_query=material+ui+modal
// https://www.youtube.com/watch?v=5akdtwtmjZM
// https://github.com/CodAffection/React-Material-UI-Dialog-Modal-Popup/tree/master/src
// https://github.com/CodAffection/React-Material-UI-Dialog-Modal-Popup/blob/master/src/components/Popup.js
// https://www.youtube.com/watch?v=-fnLEO4e-3Y

/**
 * Create openModal state in parent (i.e. where modal is rendered)
 * Pass the state and state-modifier function to the PopupModal as props
 */
const PopupModal = ({ title, openModal, setOpenModal, children }) => {
    const closeModal = () => setOpenModal(false);

    return (
        <Dialog open={openModal} onClose={closeModal} maxWidth="sm">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent style={{ maxHeight: 600 }} dividers>
                {children}
            </DialogContent>
        </Dialog>
    );
};

export default PopupModal;
