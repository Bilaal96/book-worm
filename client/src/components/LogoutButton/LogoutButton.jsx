import { useContext } from "react";

// Contexts
import { AuthContext } from "contexts/auth/auth.context";

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
    const { logout } = useContext(AuthContext);

    // Render LogoutButton as ListItem (for NavDrawer)
    if (listItem) {
        return (
            <ListItem
                button
                onClick={(e) => {
                    logout();
                    closeDrawer();
                }}
            >
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
            onClick={logout}
            {...otherProps}
        >
            LOG OUT
        </Button>
    );
};

export default LogoutButton;
