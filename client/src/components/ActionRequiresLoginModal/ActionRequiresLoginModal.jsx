import { useHistory } from "react-router-dom";
import PopupModal from "components/PopupModal/PopupModal";
import { Typography } from "@material-ui/core";
import { LockOpen } from "@material-ui/icons";

/**
 * A custom and reusable instance of PopupModal
 * Is rendered to notify user that the action performed requires logging in
 * The "positive" action navigates to the Login page
 * The "negative" action uses default behaviour (i.e. closes modal); see PopupModal for details
 */
const ActionRequiresLoginModal = ({ openModal, setOpenModal }) => {
    const history = useHistory();

    const positiveButton = {
        // Required properties
        text: "Go To Login ",
        action: () => history.push("/login"),
        // Optional properties
        startIcon: <LockOpen />,
    };

    return (
        <PopupModal
            title="Login Required"
            openModal={openModal}
            setOpenModal={setOpenModal}
            buttons={{ positive: positiveButton }}
        >
            <Typography
                style={{ fontSize: "18px", padding: "14px 28px" }}
                variant="body1"
            >
                You must login to use this feature
            </Typography>
        </PopupModal>
    );
};

export default ActionRequiresLoginModal;
