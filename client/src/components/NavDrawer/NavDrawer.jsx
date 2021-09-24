import { useState } from "react";

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

// MUI Icons
import { Menu } from "@material-ui/icons";

// Constants
import { NAV_ITEMS_MAP } from "constants/index";

import useStyles from "./styles";

/** findDomNode Warning options
 * SEE: https://stackoverflow.com/questions/61220424/material-ui-drawer-finddomnode-is-deprecated-in-strictmode 
 
 * ignore -> is an issue with Material UI
 * or use unstable version of createMuiTheme
 */
const NavDrawer = () => {
    const classes = useStyles();

    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleDrawerToggle = (openState) => (event) => {
        /**
         * Defining this handler is not absolutely necessary, but is optimal If we simply pass a
         * callback to a component's event listener prop - e.g. onClick={() => setIsOpen(true)} -
         * the callback is redefined on every render
         */
        setIsOpen(openState);
    };

    const handleListItemClick = (index) => (event) => {
        // set value of ListItem's "selected" prop, which determines styles for selected ListItem
        setSelectedIndex(index);
        // close NavDrawer
        setIsOpen(false);
    };

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

                            {NAV_ITEMS_MAP.map(
                                ({ routeName, isExact, text, icon }, index) => (
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
                        </List>
                    </div>
                </Drawer>
            </nav>
        </>
    );
};

export default NavDrawer;
