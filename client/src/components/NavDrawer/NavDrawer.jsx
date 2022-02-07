import { useState, useContext, useEffect } from "react";

// Contexts
import { AuthContext } from "contexts/auth/auth.context";

// Components
import { Link as RouterLink } from "react-router-dom";
import {
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from "@material-ui/core";
import Logo from "components/Logo/Logo";
import LogoutButton from "components/LogoutButton/LogoutButton";

// MUI Icons
import { Menu } from "@material-ui/icons";

import useStyles from "./styles";

/** findDomNode Warning options
 * ! CURRENTLY DISABLED REACT STRICT MODE TO PREVENT CONSOLE ERROR
 
 * 1) ignore -> is an issue with Material UI
 * 2) disable React Strict Mode
 * 3) use unstable version of createMuiTheme 
 
 * SEE: https://stackoverflow.com/questions/61220424/material-ui-drawer-finddomnode-is-deprecated-in-strictmode 
 */
const NavDrawer = ({ navigationMap }) => {
    const classes = useStyles();

    const auth = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    /**
     * Defining this handler is not absolutely necessary, but is optimal
     * Because a callback passed as a prop is redefined on every render
     * e.g. onClick={ () => setIsOpen(true) }
     */
    const handleDrawerToggle = (openState) => (event) => {
        setIsOpen(openState);
    };

    const handleListItemClick = (index) => (event) => {
        // set value of ListItem's "selected" prop, which determines styles for selected ListItem
        setSelectedIndex(index);
        // close NavDrawer
        setIsOpen(false);
    };

    // Highlight the correct ListItem after route redirect on login/logout
    useEffect(() => {
        if (auth.user) {
            setSelectedIndex(1); // select: Manage Lists
        } else {
            setSelectedIndex(0); // select: Home
        }
    }, [auth.user]);

    return (
        <>
            {/* Hamburger Button */}
            <IconButton onClick={handleDrawerToggle(true)}>
                <Menu className={classes.hamburger} />
            </IconButton>

            {/* Collapsible Side Drawer */}
            <nav className={classes.drawer} aria-label="Navigation">
                <Drawer open={isOpen} onClose={handleDrawerToggle(false)}>
                    <div className={classes.list}>
                        <List>
                            <ListItem>
                                <Logo />
                            </ListItem>

                            {navigationMap.map(
                                ({ routeName, text, icon }, index) => (
                                    <ListItem
                                        button
                                        key={index}
                                        component={RouterLink}
                                        to={routeName}
                                        onClick={handleListItemClick(index)}
                                        selected={selectedIndex === index}
                                    >
                                        <ListItemIcon>{icon}</ListItemIcon>
                                        <ListItemText primary={text} />
                                    </ListItem>
                                )
                            )}

                            {/* Render LogoutButton if user is logged in */}
                            {auth.user && (
                                <LogoutButton
                                    listItem
                                    closeDrawer={() => setIsOpen(false)}
                                />
                            )}
                        </List>
                    </div>
                </Drawer>
            </nav>
        </>
    );
};

export default NavDrawer;
