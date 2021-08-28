import { Typography } from '@material-ui/core';
import useStyles from './styles';

const ReadingList = () => {
  const classes = useStyles();

  return (
    <Typography variant="h4" component="h1" className={classes.pageHeading}>
      Reading List
    </Typography>
  );
};

export default ReadingList;
