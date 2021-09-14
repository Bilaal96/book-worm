import { Typography } from "@material-ui/core";

import useStyles from "./styles";

const Logo = () => {
    const classes = useStyles();

    return (
        <div className={classes.logo}>
            <Typography variant="h5" noWrap>
                Book Worm
            </Typography>
        </div>
    );
};

export default Logo;
