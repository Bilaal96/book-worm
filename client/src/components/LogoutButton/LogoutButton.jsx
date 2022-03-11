import PropTypes from "prop-types";
import { useContext, useState } from "react";

// Contexts
import { AuthContext } from "contexts/auth/auth.context";

// Components
import ConfirmActionModal from "components/ConfirmActionModal/ConfirmActionModal";
import {
    Typography,
    Button,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@material-ui/core";

// Icons
import { PowerSettingsNew } from "@material-ui/icons";

import useStyles from "./styles";

// Modal opened on LogoutButton click - to confirm user logout
const ConfirmLogoutModal = ({
    title,
    openModal,
    setOpenModal,
    handleLogout,
}) => {
    const { authInProgress } = useContext(AuthContext);

    const positive = {
        action: handleLogout,
        async: { loading: authInProgress, altText: "Logging Out" },
        startIcon: <PowerSettingsNew />,
        text: "Log Out",
    };

    return (
        <ConfirmActionModal
            title={title}
            openModal={openModal}
            setOpenModal={setOpenModal}
            buttons={{ positive }}
        >
            <Typography
                style={{ fontSize: "18px", padding: "14px 28px" }}
                variant="body1"
            >
                Are you sure you want to logout?
            </Typography>
        </ConfirmActionModal>
    );
};

// LogoutButton - for NavDrawer / NavTop
const LogoutButton = ({ listItem, closeDrawer, ...otherProps }) => {
    const auth = useContext(AuthContext);
    const [openModal, setOpenModal] = useState(false);

    const openConfirmationModal = (e) => setOpenModal(true);

    const handleLogout = (e) => {
        auth.logout();
        if (listItem) closeDrawer();
    };

    const confirmModalProps = { openModal, setOpenModal, handleLogout };
    const classes = useStyles({ openModal });

    // Render LogoutButton as ListItem (for NavDrawer)
    if (listItem) {
        return (
            <>
                <ConfirmLogoutModal {...confirmModalProps} />
                <ListItem
                    className={classes.listItem}
                    button
                    onClick={openConfirmationModal}
                >
                    <ListItemIcon className={classes.listItemIcon}>
                        <PowerSettingsNew />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItem>
            </>
        );
    }

    // Render LogoutButton as Button (for NavTop)
    return (
        <>
            <ConfirmLogoutModal {...confirmModalProps} />
            <Button
                className={classes.button}
                startIcon={<PowerSettingsNew />}
                onClick={openConfirmationModal}
                {...otherProps}
            >
                LOG OUT
            </Button>
        </>
    );
};

LogoutButton.propTypes = {
    listItem: PropTypes.bool,
    closeDrawer: PropTypes.func,
};

export default LogoutButton;
