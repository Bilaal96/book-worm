import { Typography } from '@material-ui/core';
import useStyles from './styles';

const Favourites = () => {
  const classes = useStyles();

  return (
    <Typography variant="h4" component="h1" className={classes.pageHeading}>
      Favourites
    </Typography>
  );
};

export default Favourites;
