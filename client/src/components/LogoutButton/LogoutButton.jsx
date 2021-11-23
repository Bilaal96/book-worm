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

    const handleLogout = async (e) => {
        try {
            const response = await fetch("http://localhost:5000/auth/logout", {
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    // no-cache - require validation for resource freshness
                    "Cache-Control": "no-cache",
                },
            });

            console.log("Logout HTTP response status:", response.status);

            // Handle successful logout; server responds with 301
            if (response.status === 301) {
                const data = await response.json();
                console.log("LOGOUT SUCCESS:", { data });

                // Redirect to homepage
                // React Router handles redirect from '/' to '/books'
                history.push("/");

                // Update Auth Context
                setAuth({
                    isAuthenticated: false,
                    user: data.user,
                });

                // guard response.ok check below as 301 will trigger it
                return;
            }

            // Throw error if response is not 301 / not within 200-299 range
            if (!response.ok) throw Error(`HTTP Error: ${response.status}`);
        } catch (err) {
            console.error(err);
        }
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
