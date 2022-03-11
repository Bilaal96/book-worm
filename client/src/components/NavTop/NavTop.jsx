import PropTypes from "prop-types";
import { useContext } from "react";
import { useLocation } from "react-router-dom";

// Contexts
import { AuthContext } from "contexts/auth/auth.context";

// Components
import { NavLink as RouterNavLink } from "react-router-dom";
import { Button } from "@material-ui/core";
import LogoutButton from "components/LogoutButton/LogoutButton";

import useStyles from "./styles";

const NavTop = ({ navigationMap }) => {
    const classes = useStyles();
    const { pathname } = useLocation();

    const auth = useContext(AuthContext);

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
                    activeClassName={
                        pathname.includes(routeName)
                            ? classes.navLinkSelected
                            : ""
                    }
                    startIcon={icon}
                    component={RouterNavLink}
                    to={routeName}
                    exact={isExact}
                >
                    {text}
                </Button>
            ))}

            {/* Render LogoutButton if user is logged in */}
            {auth.user && <LogoutButton>LOG OUT</LogoutButton>}
        </nav>
    );
};

NavTop.propTypes = {
    navigationMap: PropTypes.array.isRequired,
};

export default NavTop;
