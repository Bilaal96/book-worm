import { Typography } from "@material-ui/core";
import useStyles from "./styles";

const ManageLists = () => {
    const classes = useStyles();

    return (
        <Typography variant="h4" component="h1" className={classes.pageHeading}>
            Manage Lists
        </Typography>
    );
};

export default ManageLists;
