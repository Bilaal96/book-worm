import { makeStyles } from '@material-ui/core';

export default makeStyles((theme) => ({
  logo: {
    flexGrow: 1,
    [theme.breakpoints.down('sm')]: {
      marginLeft: theme.spacing(1),
    },
  },
  drawerLogo: {},
}));
