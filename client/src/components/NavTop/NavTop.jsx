import { useContext } from "react";

// Contexts
import { AuthContext } from "contexts/auth/auth.context";

// Components
import { NavLink as RouterNavLink } from "react-router-dom";
import { Button } from "@material-ui/core";
import LogoutButton from "components/LogoutButton/LogoutButton";

import useStyles from "./styles";

const NavTop = ({ navigationMap }) => {
    const classes = useStyles();
    const { auth } = useContext(AuthContext);

    return (
        <nav className={classes.nav}>
            {/** 
              * Composing React Router NavLink with MUI components
              * v4 and v5 documentation, respectively:
                - https://v4.mui.com/guides/composition/#button
                - https://material-ui.com/guides/composition/#button 
              */}
            {navigationMap.map(({ routeName, isExact, text, icon }, index) => (
                <Button
                    key={index}
                    className={classes.navLink}
                    startIcon={icon}
                    activeClassName={classes.navLinkSelected}
                    component={RouterNavLink}
                    to={routeName}
                    exact={isExact}
                >
                    {text}
                </Button>
            ))}

            {/* Render LogoutButton if user is logged in */}
            {auth.isAuthenticated && (
                <LogoutButton className={classes.navLink}>LOG OUT</LogoutButton>
            )}
        </nav>
    );
};

export default NavTop;
