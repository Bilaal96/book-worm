import { useState, useEffect, useContext } from "react";

// Context
import { AuthContext } from "contexts/auth/auth.context";

// Components
import { AppBar, Toolbar, Container, Hidden } from "@material-ui/core";
import NavDrawer from "components/NavDrawer/NavDrawer";
import Logo from "components/Logo/Logo";
import NavTop from "components/NavTop/NavTop";

// Navigation Options
import { NAV_MAP_BASE, NAV_MAP_GUEST } from "constants/index";

import useStyles from "./styles";

const Header = () => {
    const classes = useStyles();

    const { auth } = useContext(AuthContext);
    const [navigationMap, setNavigationMap] = useState(NAV_MAP_GUEST);

    // Set Navigation options based on Auth state
    useEffect(() => {
        if (auth.isAuthenticated) {
            setNavigationMap(NAV_MAP_BASE);
        } else {
            setNavigationMap(NAV_MAP_GUEST);
        }
    }, [auth.isAuthenticated]);

    // ! DEV-ONLY
    useEffect(
        () => console.log("NAV ITEMS MAP:", navigationMap),
        [navigationMap]
    );

    // Render NavDrawer / NavTop at the appropriate breakpoints
    return (
        <AppBar>
            <Container maxWidth="lg" disableGutters>
                <Toolbar className={classes.toolBar} disableGutters>
                    {/* Mobile Navigation */}
                    <Hidden mdUp>
                        <NavDrawer navigationMap={navigationMap} />
                    </Hidden>

                    <Logo />

                    {/* Desktop Navigation */}
                    <Hidden smDown>
                        <NavTop navigationMap={navigationMap} />
                    </Hidden>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;
