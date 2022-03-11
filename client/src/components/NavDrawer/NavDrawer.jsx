import PropTypes from "prop-types";
import { useState, useContext } from "react";
import { useLocation } from "react-router-dom";

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

// Icons
import { Menu } from "@material-ui/icons";

import useStyles from "./styles";

const NavDrawer = ({ navigationMap }) => {
    const classes = useStyles();
    const { pathname } = useLocation();

    const auth = useContext(AuthContext);
    const [openDrawer, setOpenDrawer] = useState(false);

    // Sets openDrawer state - accepts boolean argument
    const handleDrawerToggle = (openState) => (e) => setOpenDrawer(openState);

    return (
        <>
            {/* Hamburger Button */}
            <IconButton onClick={handleDrawerToggle(true)}>
                <Menu className={classes.hamburger} />
            </IconButton>

            {/* Collapsible Side Drawer */}
            <Drawer open={openDrawer} onClose={handleDrawerToggle(false)}>
                <List className={classes.list}>
                    <ListItem className={classes.logo}>
                        <Logo />
                    </ListItem>

                    {navigationMap.map(({ routeName, text, icon }, index) => (
                        <ListItem
                            className={classes.navLink}
                            button
                            key={index}
                            component={RouterLink}
                            to={routeName}
                            onClick={handleDrawerToggle(false)}
                            selected={pathname.includes(routeName)}
                        >
                            <ListItemIcon className={classes.navLinkIcon}>
                                {icon}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}

                    {/* Render LogoutButton if user is logged in */}
                    {auth.user && (
                        <LogoutButton
                            listItem
                            closeDrawer={handleDrawerToggle(false)}
                        />
                    )}
                </List>
            </Drawer>
        </>
    );
};

NavDrawer.propTypes = {
    navigationMap: PropTypes.array.isRequired,
};

export default NavDrawer;
