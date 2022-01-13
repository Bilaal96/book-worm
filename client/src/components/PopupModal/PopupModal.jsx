import { Dialog, DialogTitle, DialogContent } from "@material-ui/core";
import { DialogActions, Button } from "@material-ui/core";

// --- PopupModal Resources
// https://v4.mui.com/components/dialogs/#responsive-full-screen
// https://v4.mui.com/components/dialogs/#customized-dialogs
// https://v4.mui.com/components/dialogs/#scrolling-long-content

// https://www.youtube.com/results?search_query=material+ui+modal
// https://www.youtube.com/watch?v=5akdtwtmjZM
// https://github.com/CodAffection/React-Material-UI-Dialog-Modal-Popup/tree/master/src
// https://github.com/CodAffection/React-Material-UI-Dialog-Modal-Popup/blob/master/src/components/Popup.js
// https://www.youtube.com/watch?v=-fnLEO4e-3Y

/** 
 * A reusable and custom MUI Dialog component
 * Configured as a Popup Modal, with optional title and action buttons

 * @param { String } [title] - modal title - summarises functional use

 * @param { Boolean } openModal - render state of MUI Dialog component
 * @param { Function } setOpenModal - used to set render state of MUI Dialog component
 * Create openModal state in parent (i.e. where PopupModal is rendered)
 * Pass the state and state-modifier function to the PopupModal as props
 
 * Used to dynamically render modal buttons (i.e. DialogActions) 
 * @param { Object } [buttons] - contains state for Button's rendered as DialogActions

 * If "buttons" prop is passed, the following properties are required (unless denoted as optional):
 * @namespace { Object } positive - container for following properties
 * @property { String } positive.text - positive button text
 * @property { Function } positive.action - positive button onClick handler
 * @property { JSX } [positive.startIcon] - positive button icon
 
 * Defaults to "Close" button if "negative" namespace is omitted; which closes the modal on click
 * NOTE: Only specify if you wish to override default behaviour
 * @namespace { Object } [negative] - container for following properties 
 * @property { String } [negative.text] - negative button text
 * @property { Function } [negative.action] - negative button onClick handler
 
 * @param { JSX } children - rendered as DialogContent
 */
const PopupModal = ({ title, openModal, setOpenModal, buttons, children }) => {
    const closeModal = () => setOpenModal(false);

    // Positive/NegativeButton - only rendered if "buttons" prop is passed
    const PositiveButton = () => (
        <Button
            onClick={buttons.positive.action}
            variant="contained"
            color="primary"
            startIcon={buttons.positive.startIcon}
        >
            {buttons.positive.text}
        </Button>
    );

    const NegativeButton = () => (
        <Button
            onClick={buttons.negative ? buttons.negative.action : closeModal}
            variant="outlined"
            color="secondary"
        >
            {buttons.negative ? buttons.negative.text : "Close"}
        </Button>
    );

    return (
        <Dialog open={openModal} onClose={closeModal} maxWidth="sm">
            {/* Title [ OPTIONAL ] */}
            {title && <DialogTitle>{title}</DialogTitle>}

            {/* Content */}
            <DialogContent style={{ maxHeight: 600 }} dividers>
                {children}
            </DialogContent>

            {/* Actions [ OPTIONAL ] */}
            {buttons ? (
                <DialogActions>
                    <NegativeButton />
                    <PositiveButton />
                </DialogActions>
            ) : null}
        </Dialog>
    );
};

export default PopupModal;
