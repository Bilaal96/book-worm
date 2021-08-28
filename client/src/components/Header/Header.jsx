import { useState } from 'react';

// M-UI
// -- components
import {
  AppBar,
  Toolbar,
  Container,
  IconButton,
  Hidden,
} from '@material-ui/core';
// -- icons
import { Menu } from '@material-ui/icons';

// Components
import Logo from '../Logo/Logo';
import NavTop from '../NavTop/NavTop';
import NavDrawer from '../NavDrawer/NavDrawer';

import useStyles from './styles';

const Header = () => {
  const classes = useStyles();
  const [drawerToggle, setDrawerToggle] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setDrawerToggle(open);
  };

  return (
    <>
      <AppBar>
        <Container maxWidth="lg" disableGutters>
          <Toolbar className={classes.toolBar} disableGutters>
            {/* DOCS: https://material-ui.com/components/hidden/ */}
            <Hidden mdUp>
              <IconButton
                className={classes.menuButton}
                onClick={toggleDrawer(true)}
              >
                <Menu className={classes.colorWhite} />
              </IconButton>
              <NavDrawer isOpen={drawerToggle} toggleDrawer={toggleDrawer} />
            </Hidden>

            <Logo />

            {/* Desktop Navigation */}
            <Hidden smDown>
              <NavTop />
            </Hidden>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Header;
