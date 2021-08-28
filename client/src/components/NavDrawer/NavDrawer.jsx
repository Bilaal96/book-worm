import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

// M-UI
// -- components
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';

// Components
import Logo from '../Logo/Logo';

import { NAV_ITEMS_MAP } from '../../constants';

import useStyles from './styles';

/** findDomNode Warning options
 * SEE: https://stackoverflow.com/questions/61220424/material-ui-drawer-finddomnode-is-deprecated-in-strictmode 
 
 * ignore -> is an issue with Material UI
 * or use unstable version of createMuiTheme
 */
const NavDrawer = ({ isOpen, toggleDrawer }) => {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleListItemClick = (index) => (event) => {
    setSelectedIndex(index);
    toggleDrawer(false);
  };

  return (
    <nav className={classes.drawer} aria-label="Navigation">
      <Drawer open={isOpen} onClose={toggleDrawer(false)}>
        <div className={classes.list}>
          <List>
            <ListItem>
              <Logo />
            </ListItem>

            {NAV_ITEMS_MAP.map((item, index) => (
              <ListItem
                button
                key={index}
                component={RouterLink}
                to={item.route}
                onClick={handleListItemClick(index)}
                selected={selectedIndex === index}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </nav>
  );
};

NavDrawer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
};

export default NavDrawer;
