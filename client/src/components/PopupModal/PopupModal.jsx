import { Dialog, DialogTitle, DialogContent } from "@material-ui/core";

/**
 * Create openModal state in parent (i.e. where modal is rendered)
 * Pass the state and state-modifier function to the PopupModal as props
 */
const PopupModal = ({ title, openModal, setOpenModal, children }) => {
    const closeModal = () => setOpenModal(false);

    return (
        <Dialog open={openModal} onClose={closeModal} maxWidth="lg">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent dividers>{children}</DialogContent>
        </Dialog>
    );
};

export default PopupModal;
