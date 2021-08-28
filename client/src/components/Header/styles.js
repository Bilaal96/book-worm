import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  toolBar: {
    padding: theme.spacing(1, 2),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(2),
    },
  },
  menuButton: {},
  colorWhite: {
    color: '#fff',
  },
}));
