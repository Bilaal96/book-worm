import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  searchBar: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBox: {
    width: '400px',
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #aaa',
    borderRadius: '4px',
    color: '#aaa',
  },
  searchIcon: {
    height: '100%',
    marginRight: theme.spacing(1),
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
  },
}));
