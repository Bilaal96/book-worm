import PropTypes from "prop-types";

// Components
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@material-ui/core";

/** 
 * A custom & reusable MUI Dialog component.
 * A modal used to confirm a user action.

 * @param { String } [title] - modal title - summarises functional use.

 * @param { Boolean } openModal - render state of MUI Dialog component.
 * @param { Function } setOpenModal - used to set render state of MUI Dialog.component.
 * Create openModal state in parent (i.e. where ConfirmActionModal is rendered).
 * Pass the state and state-modifier function to the ConfirmActionModal as props.
 
 * @param { Object } buttons - dynamically defines context and behaviour for Button's rendered in DialogActions.
 * Contains 2 namespaces: positive & negative.
 * The "positive.action" property is required.
 * All other properties have default values that can be overwritten (see below).

 * @namespace { Object } positive - container for following properties.
 * @property { Function } positive.action - positive button onClick handler.
 * @property { JSX } [positive.startIcon] - positive button icon; ignored if not specified.
 * @property { String } [positive.text] - positive button text.

 * @namespace { Object } [negative] - container for following properties.
 * @property { Function } [negative.action] - negative button onClick handler.
 * @property { String } [negative.text] - negative button text.
 * NOTE: It is only necessary to specify "negative" namespace if you wish to override default behaviour.
 
 * @param { JSX } children - modal content; rendered in DialogContent.
 */
const ConfirmActionModal = ({
    title,
    openModal,
    setOpenModal,
    buttons,
    children,
}) => {
    const { positive, negative } = buttons;

    const closeModal = () => setOpenModal(false);

    const PositiveButton = () => (
        <Button
            onClick={positive.action} // required
            variant="contained"
            color="primary"
            startIcon={positive.startIcon}
        >
            {positive.text || "Ok"}
        </Button>
    );

    const NegativeButton = () => (
        <Button
            onClick={negative?.action || closeModal}
            variant="outlined"
            color="secondary"
        >
            {negative?.text || "Cancel"}
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
            <DialogActions>
                <PositiveButton />
                <NegativeButton />
            </DialogActions>
        </Dialog>
    );
};

ConfirmActionModal.propTypes = {
    title: PropTypes.string,
    openModal: PropTypes.bool.isRequired,
    setOpenModal: PropTypes.func.isRequired,
    buttons: PropTypes.object.isRequired,
};

export default ConfirmActionModal;
