// Components
import { NavLink as RouterNavLink } from "react-router-dom";
import { Button } from "@material-ui/core";

// Constants
import { NAV_ITEMS_MAP } from "constants/index";

import useStyles from "./styles";

const NavTop = () => {
    const classes = useStyles();

    return (
        <nav className={classes.nav}>
            {/* DOCS: https://material-ui.com/guides/composition/#button */}
            {NAV_ITEMS_MAP.map(({ routeName, isExact, text, icon }, index) => (
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
        </nav>
    );
};

export default NavTop;
