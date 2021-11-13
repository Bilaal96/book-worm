import { useContext } from "react";
import { useHistory } from "react-router-dom";

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
    const history = useHistory();
    const { setAuth } = useContext(AuthContext);

    // ! TEMPORARILY SIMULATE LOGOUT
    // TODO: make request to GET /auth/logout
    const handleLogout = (e) => {
        history.push("/");
        setAuth({
            isAuthenticated: false,
            user: null,
        });
    };

    // Render LogoutButton as ListItem (for NavDrawer)
    if (listItem) {
        return (
            <ListItem
                button
                onClick={(e) => {
                    handleLogout(e);
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
            onClick={handleLogout}
            {...otherProps}
        >
            LOG OUT
        </Button>
    );
};

export default LogoutButton;
