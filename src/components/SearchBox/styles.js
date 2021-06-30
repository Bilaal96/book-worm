import { makeStyles } from '@material-ui/core';
import { findByLabelText } from '@testing-library/react';

export default makeStyles((theme) => ({
  searchBox: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    height: '100%',
    marginRight: theme.spacing(1),
    pointerEvents: 'none',
  },
  searchInput: {
    width: '400px',
  },
}));
