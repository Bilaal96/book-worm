import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

// Components
import ConfirmActionModal from "components/ConfirmActionModal/ConfirmActionModal";
import { Typography } from "@material-ui/core";
import { LockOpen } from "@material-ui/icons";

/**
 * A specific instance of ConfirmActionModal, rendered to notify user that the action performed requires logging in.
 * The "positive" action navigates to the Login page.
 * The "negative" action uses default behaviour (i.e. closes modal); see ConfirmActionModal for details.
 */
const ActionRequiresLoginModal = ({ openModal, setOpenModal }) => {
    const history = useHistory();

    // Positive button properties
    const positive = {
        // Required
        action: () => history.push("/login"),
        // Optional
        text: "Go To Login ",
        startIcon: <LockOpen />,
    };

    // Negative button properties (optional)
    const negative = { text: "Close" };

    return (
        <ConfirmActionModal
            title="Login Required"
            openModal={openModal}
            setOpenModal={setOpenModal}
            buttons={{ positive, negative }}
        >
            <Typography
                style={{ fontSize: "18px", padding: "14px 28px" }}
                variant="body1"
            >
                You must login to use this feature
            </Typography>
        </ConfirmActionModal>
    );
};

ActionRequiresLoginModal.propTypes = {
    openModal: PropTypes.bool.isRequired,
    setOpenModal: PropTypes.func.isRequired,
};

export default ActionRequiresLoginModal;
