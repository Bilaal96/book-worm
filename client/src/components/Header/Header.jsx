// Components
import { AppBar, Toolbar, Container, Hidden } from "@material-ui/core";
import Logo from "components/Logo/Logo";
import NavTop from "components/NavTop/NavTop";
import NavDrawer from "components/NavDrawer/NavDrawer";

import useStyles from "./styles";

const Header = () => {
    const classes = useStyles();

    return (
        <AppBar>
            <Container maxWidth="lg" disableGutters>
                <Toolbar className={classes.toolBar} disableGutters>
                    {/**
                     * Mobile Navigation
                     * DOCS: https://material-ui.com/components/hidden/
                     */}
                    <Hidden mdUp>
                        <NavDrawer />
                    </Hidden>

                    <Logo />

                    {/* Desktop Navigation */}
                    <Hidden smDown>
                        <NavTop />
                    </Hidden>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;
