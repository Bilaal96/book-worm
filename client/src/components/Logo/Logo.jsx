import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";

// Components
import { makeStyles, Typography } from "@material-ui/core";
import { Book } from "@material-ui/icons";

// Styles
const useStyles = makeStyles((theme) => ({
    logo: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: theme.spacing(1),
        padding: theme.spacing(1),
        margin: ({ isLogoInDrawer }) =>
            isLogoInDrawer
                ? theme.spacing(0, "auto") // center in NavDrawer
                : theme.spacing(0, 0, 0, 2), // margin-left in NavTop
        cursor: "pointer",
    },
}));

const Logo = ({ closeDrawer }) => {
    const history = useHistory();

    // Check if closeDrawer function was received as prop
    const isLogoInDrawer = typeof closeDrawer === "function";
    const classes = useStyles({ isLogoInDrawer });

    const navigateToHome = () => {
        history.push("/books");
        if (isLogoInDrawer) closeDrawer();
    };

    return (
        <div
            className={classes.logo}
            onClick={navigateToHome}
            title="Book Worm logo"
        >
            <Book />
            <Typography variant="h5" noWrap>
                Book Worm
            </Typography>
        </div>
    );
};

Logo.propTypes = {
    closeDrawer: PropTypes.func,
};

export default Logo;
