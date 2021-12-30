import { useContext } from "react";

// Contexts
import { AuthContext } from "contexts/auth/auth.context";
import { MasterListContext } from "contexts/master-list/master-list.context";

// Components
import {
    Button,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@material-ui/core";

// Icons
import { PowerSettingsNew } from "@material-ui/icons";

const LogoutButton = ({ listItem, closeDrawer, ...otherProps }) => {
    const auth = useContext(AuthContext);
    const { clearMasterList } = useContext(MasterListContext);

    const handleLogoutClick = (e) => {
        clearMasterList();
        auth.logout();

        if (listItem) closeDrawer(); // Close NavDrawer
    };

    // Render LogoutButton as ListItem (for NavDrawer)
    if (listItem) {
        return (
            <ListItem button onClick={handleLogoutClick}>
                <ListItemIcon>
                    <PowerSettingsNew />
                </ListItemIcon>
                <ListItemText primary="Logout" />
            </ListItem>
        );
    }

    // Render LogoutButton as Button (for NavTop)
    return (
        <Button
            startIcon={<PowerSettingsNew />}
            onClick={handleLogoutClick}
            {...otherProps}
        >
            LOG OUT
        </Button>
    );
};

export default LogoutButton;
