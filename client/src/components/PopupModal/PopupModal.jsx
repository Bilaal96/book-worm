import PropTypes from "prop-types";
import clsx from "clsx";

// Components
import {
    Dialog,
    DialogTitle,
    DialogContent,
    makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    dialogContent: {
        maxHeight: 600,
    },
}));

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
 * A simple custom & reusable MUI Dialog component.
 * Configured as a Popup Modal, with optional title.

 * @param { String } [title] - modal title - summarises functional use.

 * @param { Boolean } openModal - render state of MUI Dialog component.
 * @param { Function } setOpenModal - used to set render state of MUI Dialog component.
 * Create openModal state in parent (i.e. where PopupModal is rendered).
 * Pass the state and state-modifier function to the PopupModal as props.
 
 * @param { JSX } children - modal content; rendered in DialogContent.
 */
const PopupModal = ({
    title,
    openModal,
    setOpenModal,
    className,
    children,
}) => {
    const classes = useStyles();

    const closeModal = () => setOpenModal(false);

    return (
        <Dialog open={openModal} onClose={closeModal} maxWidth="sm">
            {/* Title [ OPTIONAL ] */}
            {title && <DialogTitle>{title}</DialogTitle>}

            {/* Content */}
            <DialogContent
                className={clsx(classes.dialogContent, className)}
                dividers
            >
                {children}
            </DialogContent>
        </Dialog>
    );
};

PopupModal.propTypes = {
    title: PropTypes.string,
    openModal: PropTypes.bool.isRequired,
    setOpenModal: PropTypes.func.isRequired,
    className: PropTypes.string,
    children: PropTypes.node,
};

export default PopupModal;
