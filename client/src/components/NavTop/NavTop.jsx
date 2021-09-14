// Components
import { Link as RouterLink } from "react-router-dom";
import { Button } from "@material-ui/core";

// Constants
import { NAV_ITEMS_MAP } from "constants/index";

import useStyles from "./styles";

const NavTop = () => {
    const classes = useStyles();

    return (
        <nav className={classes.nav}>
            {/* DOCS: https://material-ui.com/guides/composition/#button */}
            {NAV_ITEMS_MAP.map((item, index) => (
                <Button
                    key={index}
                    className={classes.navLink}
                    component={RouterLink}
                    to={item.route}
                    startIcon={item.icon}
                >
                    {item.text}
                </Button>
            ))}
        </nav>
    );
};

export default NavTop;
